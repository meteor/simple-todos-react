App.info({
  id: 'com.mrw.pos',
  name: 'Mr Winston',
  description: 'De kassa voor de horeca door de horeca',
  author: 'Mr. Winston',
  email: 'info@mrwinston.nl',
  website: 'https://www.mrwinston.nl/',
  version: '2.7.1',
});

App.icons({
  'android_mdpi': 'public/icons/android-icon-48x48.png',
  'android_hdpi': 'public/icons/android-icon-72x72.png',
  'android_xhdpi': 'public/icons/android-icon-96x96.png',
  'android_xxhdpi': 'public/icons/android-icon-144x144.png',
  'android_xxxhdpi': 'public/icons/android-icon-192x192.png',

  'app_store': 'public/icons/apple-icon-1024x1024.jpg', //1024x1024
  'iphone_2x': 'public/icons/apple-icon-120x120.png',
  'iphone_3x': 'public/icons/apple-icon-180x180.png',
  'ipad': 'public/icons/apple-icon-76x76.png',
  'ipad_2x': 'public/icons/apple-icon-152x152.png',
  'ipad_pro': 'public/icons/apple-icon-167x167.png', // 167 x 167
  'ios_settings': 'public/icons/apple-icon-29x29.png', //29x29
  'ios_settings_2x': 'public/icons/apple-icon-58x58.png', //58x58
  'ios_settings_3x': 'public/icons/apple-icon-87x87.png', //87x87
  'ios_spotlight': 'public/icons/apple-icon-40x40.png', //40x40
  'ios_spotlight_2x': 'public/icons/apple-icon-80x80.png', //80x80
  'ios_spotlight_3x': 'public/icons/apple-icon-120x120.png', //120x120
  'ios_notification_2x': 'public/icons/apple-icon-40x40.png',
  'ios_notification_3x': 'public/icons/apple-icon-60x60.png',
});

// Due to a bug in the Cordova Android version that is used with Meteor, you will need to add the following to your
// mobile-config.js or you will have problems with this package on Android devices:
App.accessRule('blob:*');
App.accessRule('*');
App.accessRule('*://fonts.gstatic.com/*');
App.accessRule('https://*.googleapis.com/*');
App.accessRule('https://*.google.com/*');
App.accessRule('https://*.gstatic.com/*');
App.accessRule('http://*.mrwinston.nl/*');
App.accessRule('https://*.mrwinston.nl/*');

App.setPreference('Orientation', 'all', 'ios');
App.setPreference('SplashScreen', 'CDVSplashScreen');
App.setPreference('Fullscreen', 'true');