const translations = {
  en: {
    // App
    app_name: 'PublicReport',
    app_tagline: 'Report. Track. Resolve.',

    // Login
    login_title: 'Sign in / Register',
    login_subtitle: 'Enter your name and mobile number to continue',
    login_phone_placeholder: '9876543210',
    login_name_placeholder: 'Full Name',
    login_continue: 'Continue',
    login_terms: 'By continuing, you agree to our Terms of Service and Privacy Policy',
    login_invalid_number: 'Invalid Number',
    login_invalid_number_msg: 'Enter a valid 10-digit Indian mobile number.',
    login_name_required: 'Name Required',
    login_name_required_msg: 'Please enter your full name',
    login_failed: 'Login Failed',

    // Home
    home_greeting: 'Hello, {name} 👋',
    home_your_city: 'Your City',
    home_report_btn: 'Report an Issue',
    home_report_sub: 'Roads, water, power & more',
    home_track_btn: 'Track by Ticket ID (e.g. CR-ROA-00001)',
    home_city_overview: 'City Overview',
    home_open: 'Open',
    home_in_progress: 'In Progress',
    home_resolved: 'Resolved',
    home_total: 'Total',
    home_browse_category: 'Browse by Category',
    home_recent_reports: 'Recent Reports',
    home_see_all: 'See all',

    // Report Issue
    report_nav_title: 'Report Issue',
    report_issue_type: 'Issue Type',
    report_title_label: 'Title',
    report_title_placeholder: 'Brief title of the issue...',
    report_description_label: 'Description',
    report_description_placeholder: 'Describe the problem in detail...',
    report_priority_label: 'Priority',
    report_location_label: 'Location',
    report_location_detected: '📍 Location detected — tap to update',
    report_use_location: 'Use My Current Location',
    report_address_placeholder: 'Full address / area',
    report_ward_placeholder: 'Ward (e.g. Ward 45)',
    report_landmark_placeholder: 'Landmark (optional)',
    report_photos_label: 'Photos ({count}/4)',
    report_add_photo: 'Add Photo',
    report_submit: 'Submit Report',
    report_permission_denied: 'Permission Denied',
    report_location_permission_msg: 'Location permission is needed to pin the issue location.',
    report_error: 'Error',
    report_location_error_msg: 'Could not get your location. Please enter manually.',
    report_limit_reached: 'Limit Reached',
    report_max_images_msg: 'Maximum 4 images allowed',
    report_add_photo_title: 'Add Photo',
    report_choose_source: 'Choose source',
    report_camera: 'Camera',
    report_gallery: 'Gallery',
    report_cancel: 'Cancel',
    report_permission_needed: 'Permission needed',
    report_camera_permission_msg: 'Camera access is required.',
    report_gallery_permission_msg: 'Gallery access is required.',
    report_validation_title: 'Please enter an issue title',
    report_validation_category: 'Please select a category',
    report_validation_description: 'Please describe the issue',
    report_validation_location: 'Please provide a location',
    report_missing_info: 'Missing Information',
    report_success_title: '✅ Issue Reported!',
    report_success_msg: 'Your ticket ID is: {ticketId}\n\nSave this for tracking.',
    report_track_issue: 'Track Issue',
    report_go_home: 'Go Home',
    report_submit_error: 'Failed to submit issue',

    // Issue Detail
    detail_issue_not_found: 'Issue not found',
    detail_login_required: 'Login Required',
    detail_upvote_login_msg: 'Please login to upvote',
    detail_comment_login_msg: 'Please login to comment',
    detail_load_error: 'Failed to load issue',
    detail_status_timeline: 'Status Timeline',
    detail_comments_title: 'Updates & Comments ({count})',
    detail_official_response: 'Official Response',
    detail_comment_placeholder: 'Add a comment...',
    detail_reported_by: 'Reported by {name}',
    detail_assigned_to: 'Assigned to: {name}',
    detail_priority_suffix: 'Priority',

    // Track Issue
    track_nav_title: 'Track Complaint',
    track_helper_text: 'Enter your ticket ID to check the current status of your complaint',
    track_input_placeholder: 'e.g. CR-ROA-00001',
    track_not_found: 'Not Found',
    track_not_found_msg: 'No issue found with ticket ID: {ticketId}',
    track_view_full: 'View Full Details',
    track_assigned_to: 'Assigned to: {name}',
    track_resolved_on: '✅ Resolved on {date}',

    // Public Feed
    feed_search_placeholder: 'Search issues...',
    feed_no_issues: 'No issues found',
    feed_all: 'All',

    // My Issues
    my_login_prompt: 'Login to see your reports',
    my_login_btn: 'Login',
    my_no_issues: 'No issues reported yet',
    my_report_new: 'Report an Issue',
    my_all: 'All',

    // Profile
    profile_not_logged_in: "You're not logged in",
    profile_login_signup: 'Login / Sign Up',
    profile_edit: 'Edit Profile',
    profile_notifications: 'Notifications',
    profile_privacy: 'Privacy & Security',
    profile_help: 'Help & Support',
    profile_about: 'About PublicReport',
    profile_light_mode: 'Switch to Light Mode',
    profile_dark_mode: 'Switch to Dark Mode',
    profile_logout: 'Logout',
    profile_logout_confirm: 'Are you sure you want to logout?',
    profile_cancel: 'Cancel',
    profile_issues_filed: 'Issues Filed',
    profile_resolved: 'Resolved',
    profile_upvotes: 'Upvotes Given',
    profile_version: 'PublicReport v1.0.0',
    profile_language: 'Language',

    // Categories
    category_road: 'Road & Potholes',
    category_water: 'Water Supply',
    category_drainage: 'Drainage',
    category_electricity: 'Electricity',
    category_garbage: 'Garbage',
    category_streetlight: 'Street Light',
    category_other: 'Other',

    // Priority
    priority_low: 'Low',
    priority_medium: 'Medium',
    priority_high: 'High',
    priority_critical: 'Critical',

    // Status
    status_open: 'Open',
    status_assigned: 'Assigned',
    status_in_progress: 'In Progress',
    status_resolved: 'Resolved',
    status_closed: 'Closed',
    status_rejected: 'Rejected',

    // Sort
    sort_newest: 'Newest First',
    sort_upvoted: 'Most Upvoted',
    sort_priority: 'Priority',

    // Navigation tabs
    tab_home: 'Home',
    tab_feed: 'Public Feed',
    tab_my_issues: 'My Reports',
    tab_profile: 'Profile',

    // Language names
    lang_en: 'English',
    lang_hi: 'हिंदी',
    lang_te: 'తెలుగు',
  },

  hi: {
    // App
    app_name: 'पब्लिक रिपोर्ट',
    app_tagline: 'रिपोर्ट करें। ट्रैक करें। समाधान पाएं।',

    // Login
    login_title: 'साइन इन / रजिस्टर',
    login_subtitle: 'जारी रखने के लिए अपना नाम और मोबाइल नंबर दर्ज करें',
    login_phone_placeholder: '9876543210',
    login_name_placeholder: 'पूरा नाम',
    login_continue: 'जारी रखें',
    login_terms: 'जारी रखने पर आप हमारी सेवा शर्तों और गोपनीयता नीति से सहमत होते हैं',
    login_invalid_number: 'अमान्य नंबर',
    login_invalid_number_msg: 'एक वैध 10-अंकीय भारतीय मोबाइल नंबर दर्ज करें।',
    login_name_required: 'नाम आवश्यक है',
    login_name_required_msg: 'कृपया अपना पूरा नाम दर्ज करें',
    login_failed: 'लॉगिन विफल',

    // Home
    home_greeting: 'नमस्ते, {name} 👋',
    home_your_city: 'आपका शहर',
    home_report_btn: 'समस्या रिपोर्ट करें',
    home_report_sub: 'सड़क, पानी, बिजली और अधिक',
    home_track_btn: 'टिकट ID से ट्रैक करें (जैसे CR-ROA-00001)',
    home_city_overview: 'शहर का अवलोकन',
    home_open: 'खुला',
    home_in_progress: 'प्रगति में',
    home_resolved: 'हल किया गया',
    home_total: 'कुल',
    home_browse_category: 'श्रेणी के अनुसार ब्राउज़ करें',
    home_recent_reports: 'हाल की रिपोर्ट',
    home_see_all: 'सभी देखें',

    // Report Issue
    report_nav_title: 'समस्या रिपोर्ट करें',
    report_issue_type: 'समस्या का प्रकार',
    report_title_label: 'शीर्षक',
    report_title_placeholder: 'समस्या का संक्षिप्त शीर्षक...',
    report_description_label: 'विवरण',
    report_description_placeholder: 'समस्या को विस्तार से बताएं...',
    report_priority_label: 'प्राथमिकता',
    report_location_label: 'स्थान',
    report_location_detected: '📍 स्थान मिला — अपडेट के लिए टैप करें',
    report_use_location: 'मेरी वर्तमान स्थान का उपयोग करें',
    report_address_placeholder: 'पूरा पता / क्षेत्र',
    report_ward_placeholder: 'वार्ड (जैसे वार्ड 45)',
    report_landmark_placeholder: 'लैंडमार्क (वैकल्पिक)',
    report_photos_label: 'फ़ोटो ({count}/4)',
    report_add_photo: 'फ़ोटो जोड़ें',
    report_submit: 'रिपोर्ट सबमिट करें',
    report_permission_denied: 'अनुमति अस्वीकृत',
    report_location_permission_msg: 'समस्या का स्थान चिह्नित करने के लिए स्थान अनुमति आवश्यक है।',
    report_error: 'त्रुटि',
    report_location_error_msg: 'आपका स्थान नहीं मिला। कृपया मैन्युअल रूप से दर्ज करें।',
    report_limit_reached: 'सीमा पहुंच गई',
    report_max_images_msg: 'अधिकतम 4 चित्र अनुमति हैं',
    report_add_photo_title: 'फ़ोटो जोड़ें',
    report_choose_source: 'स्रोत चुनें',
    report_camera: 'कैमरा',
    report_gallery: 'गैलरी',
    report_cancel: 'रद्द करें',
    report_permission_needed: 'अनुमति आवश्यक',
    report_camera_permission_msg: 'कैमरे की अनुमति आवश्यक है।',
    report_gallery_permission_msg: 'गैलरी की अनुमति आवश्यक है।',
    report_validation_title: 'कृपया समस्या का शीर्षक दर्ज करें',
    report_validation_category: 'कृपया एक श्रेणी चुनें',
    report_validation_description: 'कृपया समस्या का वर्णन करें',
    report_validation_location: 'कृपया स्थान प्रदान करें',
    report_missing_info: 'जानकारी अधूरी है',
    report_success_title: '✅ समस्या रिपोर्ट हो गई!',
    report_success_msg: 'आपका टिकट ID है: {ticketId}\n\nट्रैकिंग के लिए इसे सेव करें।',
    report_track_issue: 'समस्या ट्रैक करें',
    report_go_home: 'होम पर जाएं',
    report_submit_error: 'समस्या सबमिट नहीं हो सकी',

    // Issue Detail
    detail_issue_not_found: 'समस्या नहीं मिली',
    detail_login_required: 'लॉगिन आवश्यक',
    detail_upvote_login_msg: 'अपवोट करने के लिए लॉगिन करें',
    detail_comment_login_msg: 'टिप्पणी करने के लिए लॉगिन करें',
    detail_load_error: 'समस्या लोड नहीं हो सकी',
    detail_status_timeline: 'स्थिति समयरेखा',
    detail_comments_title: 'अपडेट और टिप्पणियाँ ({count})',
    detail_official_response: 'आधिकारिक प्रतिक्रिया',
    detail_comment_placeholder: 'टिप्पणी जोड़ें...',
    detail_reported_by: '{name} द्वारा रिपोर्ट',
    detail_assigned_to: '{name} को सौंपा गया',
    detail_priority_suffix: 'प्राथमिकता',

    // Track Issue
    track_nav_title: 'शिकायत ट्रैक करें',
    track_helper_text: 'अपनी शिकायत की वर्तमान स्थिति जांचने के लिए टिकट ID दर्ज करें',
    track_input_placeholder: 'जैसे CR-ROA-00001',
    track_not_found: 'नहीं मिला',
    track_not_found_msg: 'टिकट ID {ticketId} से कोई समस्या नहीं मिली',
    track_view_full: 'पूरा विवरण देखें',
    track_assigned_to: 'सौंपा गया: {name}',
    track_resolved_on: '✅ हल किया गया {date} को',

    // Public Feed
    feed_search_placeholder: 'समस्याएं खोजें...',
    feed_no_issues: 'कोई समस्या नहीं मिली',
    feed_all: 'सभी',

    // My Issues
    my_login_prompt: 'अपनी रिपोर्ट देखने के लिए लॉगिन करें',
    my_login_btn: 'लॉगिन',
    my_no_issues: 'अभी तक कोई समस्या रिपोर्ट नहीं की गई',
    my_report_new: 'समस्या रिपोर्ट करें',
    my_all: 'सभी',

    // Profile
    profile_not_logged_in: 'आप लॉग इन नहीं हैं',
    profile_login_signup: 'लॉगिन / साइन अप',
    profile_edit: 'प्रोफ़ाइल संपादित करें',
    profile_notifications: 'सूचनाएं',
    profile_privacy: 'गोपनीयता और सुरक्षा',
    profile_help: 'सहायता',
    profile_about: 'पब्लिक रिपोर्ट के बारे में',
    profile_light_mode: 'लाइट मोड में बदलें',
    profile_dark_mode: 'डार्क मोड में बदलें',
    profile_logout: 'लॉगआउट',
    profile_logout_confirm: 'क्या आप वाकई लॉगआउट करना चाहते हैं?',
    profile_cancel: 'रद्द करें',
    profile_issues_filed: 'दर्ज समस्याएं',
    profile_resolved: 'हल किया गया',
    profile_upvotes: 'दिए गए अपवोट',
    profile_version: 'पब्लिक रिपोर्ट v1.0.0',
    profile_language: 'भाषा',

    // Categories
    category_road: 'सड़क और गड्ढे',
    category_water: 'जल आपूर्ति',
    category_drainage: 'जलनिकासी',
    category_electricity: 'बिजली',
    category_garbage: 'कचरा',
    category_streetlight: 'स्ट्रीट लाइट',
    category_other: 'अन्य',

    // Priority
    priority_low: 'कम',
    priority_medium: 'मध्यम',
    priority_high: 'उच्च',
    priority_critical: 'गंभीर',

    // Status
    status_open: 'खुला',
    status_assigned: 'सौंपा गया',
    status_in_progress: 'प्रगति में',
    status_resolved: 'हल किया गया',
    status_closed: 'बंद',
    status_rejected: 'अस्वीकृत',

    // Sort
    sort_newest: 'सबसे नया पहले',
    sort_upvoted: 'सबसे अधिक अपवोट',
    sort_priority: 'प्राथमिकता',

    // Navigation tabs
    tab_home: 'होम',
    tab_feed: 'सार्वजनिक फ़ीड',
    tab_my_issues: 'मेरी रिपोर्ट',
    tab_profile: 'प्रोफ़ाइल',

    // Language names
    lang_en: 'English',
    lang_hi: 'हिंदी',
    lang_te: 'తెలుగు',
  },

  te: {
    // App
    app_name: 'పబ్లిక్ రిపోర్ట్',
    app_tagline: 'నివేదించండి. ట్రాక్ చేయండి. పరిష్కరించండి.',

    // Login
    login_title: 'సైన్ ఇన్ / నమోదు',
    login_subtitle: 'కొనసాగించడానికి మీ పేరు మరియు మొబైల్ నంబర్ నమోదు చేయండి',
    login_phone_placeholder: '9876543210',
    login_name_placeholder: 'పూర్తి పేరు',
    login_continue: 'కొనసాగించు',
    login_terms: 'కొనసాగించడం ద్వారా మీరు మా సేవా నిబంధనలు మరియు గోపనీయతా విధానంతో అంగీకరిస్తున్నారు',
    login_invalid_number: 'చెల్లని నంబర్',
    login_invalid_number_msg: 'చెల్లుబాటు అయ్యే 10 అంకెల భారతీయ మొబైల్ నంబర్ నమోదు చేయండి.',
    login_name_required: 'పేరు అవసరం',
    login_name_required_msg: 'దయచేసి మీ పూర్తి పేరు నమోదు చేయండి',
    login_failed: 'లాగిన్ విఫలమైంది',

    // Home
    home_greeting: 'హలో, {name} 👋',
    home_your_city: 'మీ నగరం',
    home_report_btn: 'సమస్యను నివేదించండి',
    home_report_sub: 'రోడ్లు, నీరు, విద్యుత్ & మరిన్ని',
    home_track_btn: 'టికెట్ ID ద్వారా ట్రాక్ చేయండి (ఉదా. CR-ROA-00001)',
    home_city_overview: 'నగర అవలోకనం',
    home_open: 'తెరిచి',
    home_in_progress: 'పురోగతిలో',
    home_resolved: 'పరిష్కరించబడింది',
    home_total: 'మొత్తం',
    home_browse_category: 'వర్గం వారీగా చూడండి',
    home_recent_reports: 'ఇటీవలి నివేదికలు',
    home_see_all: 'అన్నీ చూడండి',

    // Report Issue
    report_nav_title: 'సమస్య నివేదించండి',
    report_issue_type: 'సమస్య రకం',
    report_title_label: 'శీర్షిక',
    report_title_placeholder: 'సమస్య యొక్క క్లుప్త శీర్షిక...',
    report_description_label: 'వివరణ',
    report_description_placeholder: 'సమస్యను వివరంగా వివరించండి...',
    report_priority_label: 'ప్రాధాన్యత',
    report_location_label: 'స్థానం',
    report_location_detected: '📍 స్థానం గుర్తించబడింది — నవీకరించడానికి నొక్కండి',
    report_use_location: 'నా ప్రస్తుత స్థానాన్ని ఉపయోగించు',
    report_address_placeholder: 'పూర్తి చిరునామా / ప్రాంతం',
    report_ward_placeholder: 'వార్డ్ (ఉదా. వార్డ్ 45)',
    report_landmark_placeholder: 'ల్యాండ్‌మార్క్ (ఐచ్ఛికం)',
    report_photos_label: 'ఫోటోలు ({count}/4)',
    report_add_photo: 'ఫోటో జోడించు',
    report_submit: 'నివేదిక సమర్పించండి',
    report_permission_denied: 'అనుమతి నిరాకరించబడింది',
    report_location_permission_msg: 'సమస్య స్థానాన్ని గుర్తించడానికి స్థాన అనుమతి అవసరం.',
    report_error: 'లోపం',
    report_location_error_msg: 'మీ స్థానాన్ని పొందలేకపోయాం. దయచేసి మాన్యువల్‌గా నమోదు చేయండి.',
    report_limit_reached: 'పరిమితి చేరుకుంది',
    report_max_images_msg: 'గరిష్టంగా 4 చిత్రాలు అనుమతించబడతాయి',
    report_add_photo_title: 'ఫోటో జోడించు',
    report_choose_source: 'మూలాన్ని ఎంచుకోండి',
    report_camera: 'కెమెరా',
    report_gallery: 'గ్యాలరీ',
    report_cancel: 'రద్దు చేయి',
    report_permission_needed: 'అనుమతి అవసరం',
    report_camera_permission_msg: 'కెమెరా యాక్సెస్ అవసరం.',
    report_gallery_permission_msg: 'గ్యాలరీ యాక్సెస్ అవసరం.',
    report_validation_title: 'దయచేసి సమస్య శీర్షికను నమోదు చేయండి',
    report_validation_category: 'దయచేసి ఒక వర్గాన్ని ఎంచుకోండి',
    report_validation_description: 'దయచేసి సమస్యను వివరించండి',
    report_validation_location: 'దయచేసి స్థానాన్ని అందించండి',
    report_missing_info: 'సమాచారం లేదు',
    report_success_title: '✅ సమస్య నివేదించబడింది!',
    report_success_msg: 'మీ టికెట్ ID: {ticketId}\n\nట్రాకింగ్ కోసం దీన్ని సేవ్ చేయండి.',
    report_track_issue: 'సమస్య ట్రాక్ చేయండి',
    report_go_home: 'హోమ్‌కు వెళ్ళు',
    report_submit_error: 'సమస్యను సమర్పించడం విఫలమైంది',

    // Issue Detail
    detail_issue_not_found: 'సమస్య కనుగొనబడలేదు',
    detail_login_required: 'లాగిన్ అవసరం',
    detail_upvote_login_msg: 'అప్‌వోట్ చేయడానికి లాగిన్ అవ్వండి',
    detail_comment_login_msg: 'వ్యాఖ్య చేయడానికి లాగిన్ అవ్వండి',
    detail_load_error: 'సమస్యను లోడ్ చేయడం విఫలమైంది',
    detail_status_timeline: 'స్థితి టైమ్‌లైన్',
    detail_comments_title: 'అప్‌డేట్‌లు & వ్యాఖ్యలు ({count})',
    detail_official_response: 'అధికారిక స్పందన',
    detail_comment_placeholder: 'వ్యాఖ్య జోడించు...',
    detail_reported_by: '{name} ద్వారా నివేదించబడింది',
    detail_assigned_to: '{name}కు కేటాయించబడింది',
    detail_priority_suffix: 'ప్రాధాన్యత',

    // Track Issue
    track_nav_title: 'ఫిర్యాదు ట్రాక్ చేయండి',
    track_helper_text: 'మీ ఫిర్యాదు యొక్క ప్రస్తుత స్థితిని తనిఖీ చేయడానికి టికెట్ ID నమోదు చేయండి',
    track_input_placeholder: 'ఉదా. CR-ROA-00001',
    track_not_found: 'కనుగొనబడలేదు',
    track_not_found_msg: 'టికెట్ ID {ticketId}తో ఏ సమస్యా కనుగొనబడలేదు',
    track_view_full: 'పూర్తి వివరాలు చూడండి',
    track_assigned_to: 'కేటాయించబడింది: {name}',
    track_resolved_on: '✅ {date} న పరిష్కరించబడింది',

    // Public Feed
    feed_search_placeholder: 'సమస్యలు వెతుకు...',
    feed_no_issues: 'సమస్యలు కనుగొనబడలేదు',
    feed_all: 'అన్నీ',

    // My Issues
    my_login_prompt: 'మీ నివేదికలు చూడటానికి లాగిన్ అవ్వండి',
    my_login_btn: 'లాగిన్',
    my_no_issues: 'ఇంకా ఏ సమస్యలూ నివేదించబడలేదు',
    my_report_new: 'సమస్యను నివేదించండి',
    my_all: 'అన్నీ',

    // Profile
    profile_not_logged_in: 'మీరు లాగిన్ అవ్వలేదు',
    profile_login_signup: 'లాగిన్ / సైన్ అప్',
    profile_edit: 'ప్రొఫైల్ సవరించు',
    profile_notifications: 'నోటిఫికేషన్లు',
    profile_privacy: 'గోపనీయత & భద్రత',
    profile_help: 'సహాయం',
    profile_about: 'పబ్లిక్ రిపోర్ట్ గురించి',
    profile_light_mode: 'లైట్ మోడ్‌కు మారు',
    profile_dark_mode: 'డార్క్ మోడ్‌కు మారు',
    profile_logout: 'లాగ్ అవుట్',
    profile_logout_confirm: 'మీరు నిజంగా లాగ్ అవుట్ చేయాలనుకుంటున్నారా?',
    profile_cancel: 'రద్దు చేయి',
    profile_issues_filed: 'నమోదైన సమస్యలు',
    profile_resolved: 'పరిష్కరించబడింది',
    profile_upvotes: 'ఇచ్చిన అప్‌వోట్లు',
    profile_version: 'పబ్లిక్ రిపోర్ట్ v1.0.0',
    profile_language: 'భాష',

    // Categories
    category_road: 'రోడ్లు & గుంతలు',
    category_water: 'నీటి సరఫరా',
    category_drainage: 'నీటి పారుదల',
    category_electricity: 'విద్యుత్',
    category_garbage: 'చెత్త',
    category_streetlight: 'వీధి దీపం',
    category_other: 'ఇతర',

    // Priority
    priority_low: 'తక్కువ',
    priority_medium: 'మధ్యస్థ',
    priority_high: 'అధిక',
    priority_critical: 'క్లిష్టమైన',

    // Status
    status_open: 'తెరిచి',
    status_assigned: 'కేటాయించబడింది',
    status_in_progress: 'పురోగతిలో',
    status_resolved: 'పరిష్కరించబడింది',
    status_closed: 'మూసివేయబడింది',
    status_rejected: 'తిరస్కరించబడింది',

    // Sort
    sort_newest: 'కొత్తవి మొదటి',
    sort_upvoted: 'ఎక్కువ అప్‌వోట్లు',
    sort_priority: 'ప్రాధాన్యత',

    // Navigation tabs
    tab_home: 'హోమ్',
    tab_feed: 'పబ్లిక్ ఫీడ్',
    tab_my_issues: 'నా నివేదికలు',
    tab_profile: 'ప్రొఫైల్',

    // Language names
    lang_en: 'English',
    lang_hi: 'हिंदी',
    lang_te: 'తెలుగు',
  },
};

export function interpolate(str, params = {}) {
  return str.replace(/\{(\w+)\}/g, (_, key) => (params[key] !== undefined ? params[key] : `{${key}}`));
}

export function createT(language) {
  const dict = translations[language] || translations.en;
  return function t(key, params) {
    const str = dict[key] ?? translations.en[key] ?? key;
    return params ? interpolate(str, params) : str;
  };
}

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिंदी' },
  { code: 'te', label: 'Telugu', nativeLabel: 'తెలుగు' },
];

export default translations;
