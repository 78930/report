import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity,
  Image, Alert, ActivityIndicator, SafeAreaView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useTheme } from '../context/ThemeContext';
import { issueAPI } from '../services/api';
import { COLORS, CATEGORY_CONFIG, PRIORITY_CONFIG } from '../utils/constants';

const CATEGORIES = Object.entries(CATEGORY_CONFIG).map(([k, v]) => ({ value: k, ...v }));
const PRIORITIES = Object.entries(PRIORITY_CONFIG).map(([k, v]) => ({ value: k, ...v }));

export default function ReportIssueScreen({ navigation }) {
  const { theme } = useTheme();
  const [form, setForm] = useState({
    title: '', description: '', category: '', priority: 'medium',
    locationAddress: '', ward: '', landmark: '',
  });
  const [images, setImages] = useState([]);
  const [coords, setCoords] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const s = styles(theme);

  const getLocation = async () => {
    setLoadingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is needed to pin the issue location.');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      setCoords({ lat: loc.coords.latitude, lng: loc.coords.longitude });

      const geocode = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
      if (geocode[0]) {
        const g = geocode[0];
        const addr = [g.streetNumber, g.street, g.district, g.city].filter(Boolean).join(', ');
        setForm((f) => ({ ...f, locationAddress: addr, ward: g.subregion || f.ward }));
      }
    } catch (err) {
      Alert.alert('Error', 'Could not get your location. Please enter manually.');
    } finally {
      setLoadingLocation(false);
    }
  };

  const pickImage = async () => {
    if (images.length >= 4) {
      Alert.alert('Limit Reached', 'Maximum 4 images allowed');
      return;
    }
    Alert.alert('Add Photo', 'Choose source', [
      { text: 'Camera', onPress: () => launchCamera() },
      { text: 'Gallery', onPress: () => launchGallery() },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const launchCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') return Alert.alert('Permission needed', 'Camera access is required.');
    const result = await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.7, allowsEditing: true });
    if (!result.canceled) setImages((imgs) => [...imgs, result.assets[0]]);
  };

  const launchGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return Alert.alert('Permission needed', 'Gallery access is required.');
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.7, allowsMultipleSelection: true, selectionLimit: 4 - images.length });
    if (!result.canceled) setImages((imgs) => [...imgs, ...result.assets].slice(0, 4));
  };

  const removeImage = (idx) => setImages((imgs) => imgs.filter((_, i) => i !== idx));

  const validate = () => {
    if (!form.title.trim()) return 'Please enter an issue title';
    if (!form.category) return 'Please select a category';
    if (!form.description.trim()) return 'Please describe the issue';
    if (!form.locationAddress.trim()) return 'Please provide a location';
    return null;
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) return Alert.alert('Missing Information', err);

    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v) formData.append(k, v); });
      if (coords) {
        formData.append('latitude', coords.lat.toString());
        formData.append('longitude', coords.lng.toString());
      }
      images.forEach((img, i) => {
        formData.append('images', {
          uri: img.uri,
          type: 'image/jpeg',
          name: `issue_${i}.jpg`,
        });
      });

      const res = await issueAPI.create(formData);
      Alert.alert(
        '✅ Issue Reported!',
        `Your ticket ID is: ${res.data.issue.ticketId}\n\nSave this for tracking.`,
        [{ text: 'Track Issue', onPress: () => navigation.navigate('IssueDetail', { issueId: res.data.issue._id }) },
         { text: 'Go Home', onPress: () => navigation.navigate('Home') }]
      );
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to submit issue');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={s.container}>
      <View style={s.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={s.navTitle}>Report Issue</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>
        {/* Category Selection */}
        <Text style={s.label}>Issue Type <Text style={s.required}>*</Text></Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.catRow}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.value}
              style={[s.catBtn, form.category === cat.value && { backgroundColor: cat.color, borderColor: cat.color }]}
              onPress={() => setForm((f) => ({ ...f, category: cat.value }))}
            >
              <Ionicons name={cat.icon} size={20} color={form.category === cat.value ? '#fff' : cat.color} />
              <Text style={[s.catBtnText, { color: form.category === cat.value ? '#fff' : cat.color }]}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Title */}
        <Text style={s.label}>Title <Text style={s.required}>*</Text></Text>
        <TextInput
          style={s.input}
          placeholder="Brief title of the issue..."
          placeholderTextColor={theme.colors.textSecondary}
          value={form.title}
          onChangeText={(v) => setForm((f) => ({ ...f, title: v }))}
          maxLength={100}
        />

        {/* Description */}
        <Text style={s.label}>Description <Text style={s.required}>*</Text></Text>
        <TextInput
          style={[s.input, s.textArea]}
          placeholder="Describe the problem in detail..."
          placeholderTextColor={theme.colors.textSecondary}
          value={form.description}
          onChangeText={(v) => setForm((f) => ({ ...f, description: v }))}
          multiline
          numberOfLines={4}
          maxLength={1000}
        />

        {/* Priority */}
        <Text style={s.label}>Priority</Text>
        <View style={s.priorityRow}>
          {PRIORITIES.map((p) => (
            <TouchableOpacity
              key={p.value}
              style={[s.priorityBtn, form.priority === p.value && { backgroundColor: p.color, borderColor: p.color }]}
              onPress={() => setForm((f) => ({ ...f, priority: p.value }))}
            >
              <Text style={[s.priorityText, { color: form.priority === p.value ? '#fff' : p.color }]}>{p.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Location */}
        <Text style={s.label}>Location <Text style={s.required}>*</Text></Text>
        <TouchableOpacity style={s.gpsBtn} onPress={getLocation} disabled={loadingLocation}>
          {loadingLocation ? (
            <ActivityIndicator size="small" color={COLORS.primary} />
          ) : (
            <Ionicons name="locate" size={20} color={COLORS.primary} />
          )}
          <Text style={s.gpsBtnText}>
            {coords ? '📍 Location detected — tap to update' : 'Use My Current Location'}
          </Text>
        </TouchableOpacity>

        <TextInput
          style={s.input}
          placeholder="Full address / area"
          placeholderTextColor={theme.colors.textSecondary}
          value={form.locationAddress}
          onChangeText={(v) => setForm((f) => ({ ...f, locationAddress: v }))}
        />
        <View style={s.row}>
          <TextInput style={[s.input, { flex: 1 }]} placeholder="Ward (e.g. Ward 45)" placeholderTextColor={theme.colors.textSecondary} value={form.ward} onChangeText={(v) => setForm((f) => ({ ...f, ward: v }))} />
          <View style={{ width: 8 }} />
          <TextInput style={[s.input, { flex: 1 }]} placeholder="Landmark (optional)" placeholderTextColor={theme.colors.textSecondary} value={form.landmark} onChangeText={(v) => setForm((f) => ({ ...f, landmark: v }))} />
        </View>

        {/* Images */}
        <Text style={s.label}>Photos ({images.length}/4)</Text>
        <View style={s.imagesGrid}>
          {images.map((img, i) => (
            <View key={i} style={s.imgThumb}>
              <Image source={{ uri: img.uri }} style={s.thumbImg} />
              <TouchableOpacity style={s.removeImg} onPress={() => removeImage(i)}>
                <Ionicons name="close-circle" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          ))}
          {images.length < 4 && (
            <TouchableOpacity style={s.addImgBtn} onPress={pickImage}>
              <Ionicons name="camera-outline" size={28} color={theme.colors.textSecondary} />
              <Text style={s.addImgText}>Add Photo</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Submit */}
        <TouchableOpacity style={s.submitBtn} onPress={handleSubmit} disabled={submitting}>
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="send" size={20} color="#fff" />
              <Text style={s.submitText}>Submit Report</Text>
            </>
          )}
        </TouchableOpacity>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = (theme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  navBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: theme.colors.card, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  navTitle: { fontSize: 17, fontWeight: '700', color: theme.colors.text },
  content: { padding: 20 },
  label: { fontSize: 14, fontWeight: '600', color: theme.colors.text, marginBottom: 8, marginTop: 16 },
  required: { color: COLORS.error },
  catRow: { gap: 8, paddingBottom: 4 },
  catBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1.5, borderColor: theme.colors.border, backgroundColor: theme.colors.card },
  catBtnText: { fontSize: 13, fontWeight: '600' },
  input: { backgroundColor: theme.colors.card, borderWidth: 1, borderColor: theme.colors.border, borderRadius: 12, padding: 13, fontSize: 15, color: theme.colors.text },
  textArea: { height: 100, textAlignVertical: 'top' },
  priorityRow: { flexDirection: 'row', gap: 8 },
  priorityBtn: { flex: 1, paddingVertical: 9, borderRadius: 10, borderWidth: 1.5, borderColor: theme.colors.border, alignItems: 'center' },
  priorityText: { fontSize: 13, fontWeight: '700' },
  gpsBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#E8F5E9', borderRadius: 12, padding: 13, marginBottom: 8, borderWidth: 1, borderColor: COLORS.accent },
  gpsBtnText: { color: COLORS.primary, fontSize: 14, fontWeight: '600' },
  row: { flexDirection: 'row', marginTop: 8 },
  imagesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  imgThumb: { width: 80, height: 80, borderRadius: 10, position: 'relative' },
  thumbImg: { width: 80, height: 80, borderRadius: 10 },
  removeImg: { position: 'absolute', top: -6, right: -6 },
  addImgBtn: { width: 80, height: 80, borderRadius: 10, borderWidth: 2, borderColor: theme.colors.border, borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.card },
  addImgText: { fontSize: 10, color: theme.colors.textSecondary, marginTop: 2 },
  submitBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: COLORS.primary, borderRadius: 16, padding: 16, marginTop: 24 },
  submitText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
