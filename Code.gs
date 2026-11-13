/* ============================================================================
 * GOOGLE APPS SCRIPT E-COMMERCE
 * Backend: Google Sheets + Google Drive
 * Keep the four deployment settings below in this single location.
 * ========================================================================== */
const SHEET_ID = "1j7crcGh_9gtojDogwecvD_TNPr7lG1vTn0DJafrWNJw";
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwArhL3V9EYMLj6EDzRj66-ruRAEbHpMEgDX0XcUxvH5RzSKYOiRUp2K33SiSbXDKYnYA/exec";
const FOLDER_ID = "1WowUHSERuWRl95J8rNCJHGL9KwVbWd-c";
const ADMIN_PASSWORD = "1234";

var APP_VERSION_ = '1.0.0';
var SESSION_HOURS_ = 8;
var CACHE_SECONDS_ = 240;
var PASSWORD_ROUNDS_ = 4000;
var MAX_UPLOAD_BYTES_ = 5 * 1024 * 1024;
var MAX_PRODUCT_VIDEO_BYTES_ = 10 * 1024 * 1024;
var DB_SPREADSHEET_ = null; // Reuse one Spreadsheet handle within each Apps Script execution.

var SCHEMA_ = {
  Settings: ['key','value','updatedAt'],
  Users: ['id','username','email','passwordHash','name','role','permissions','status','mustChangePassword','createdAt','updatedAt'],
  Customers: ['id','username','passwordHash','firstname','lastname','phone','email','emailVerified','gender','birthDate','profileImage','authProvider','providerId','status','createdAt','updatedAt','phoneCountry'],
  EmailOtpChallenges: ['id','email','purpose','userId','codeHash','status','attempts','expiresAt','lastSentAt','registrationTicketHash','registrationTicketExpiresAt','verifiedAt','consumedAt','createdAt'],
  Sessions: ['id','tokenHash','userId','username','accountType','role','permissions','expiresAt','createdAt','revokedAt'],
  Categories: ['id','name','slug','description','image','parentId','order','status','createdAt','updatedAt'],
  Products: ['id','sku','barcode','name','slug','categoryId','brand','summary','description','coverImage','images','price','salePrice','costPrice','stock','unit','weight','featured','featuredLabel','bestSeller','sellerId','tags','status','createdAt','updatedAt','quantityPromoEnabled','quantityPromoQty','quantityPromoDiscount','mallBadgeEnabled','mallBadgeText','featuredLabel','videoUrl','campaignLabel','campaignImage','promoTag','originProvince','freeShippingMinimum','sizeChart'],
  ProductVariants: ['id','productId','sku','variantName','attributes','price','salePrice','stock','status','createdAt','updatedAt'],
  Carts: ['id','customerId','sessionId','items','updatedAt'],
  Orders: ['id','orderNumber','customerId','customerName','phone','email','shippingAddress','subtotal','discount','shippingFee','tax','grandTotal','paymentMethod','paymentStatus','orderStatus','shippingStatus','trackingNumber','note','idempotencyKey','guestAccessToken','createdAt','updatedAt','paidAt','completedAt','grossSubtotal','quantityPromoDiscount'],
  OrderItems: ['id','orderId','productId','variantId','productName','sku','image','unitPrice','quantity','subtotal','sellerId','sellerOrderId','quantityPromoDiscount'],
  Payments: ['id','orderId','paymentMethod','amount','reference','proofFileId','proofUrl','paymentDate','status','verifiedBy','verifiedAt','note','createdAt'],
  Shipping: ['id','orderId','carrier','method','trackingNumber','shippingFee','status','shippedAt','deliveredAt','createdAt'],
  ShippingMethods: ['id','name','method','fee','freeMinimum','maxWeight','status','createdAt','updatedAt'],
  Inventory: ['id','productId','variantId','quantity','reserved','minimumStock','updatedAt'],
  InventoryMovements: ['id','productId','variantId','type','quantity','referenceId','reason','createdBy','createdAt'],
  Promotions: ['id','name','type','value','startDate','endDate','productIds','categoryIds','status','createdAt'],
  Coupons: ['id','code','title','discountType','discountValue','minimumOrder','maximumDiscount','usageLimit','usagePerCustomer','usedCount','startDate','endDate','sellerId','status','createdAt'],
  Reviews: ['id','productId','customerId','orderId','rating','review','images','status','createdAt'],
  ProductReports: ['id','productId','customerId','reason','detail','status','createdAt'],
  Banners: ['id','title','description','image','url','buttonText','position','startDate','endDate','order','status','createdAt','updatedAt','destinationType','destinationStoreId','showDestination','openInNewTab'],
  Addresses: ['id','customerId','recipient','phone','address','subdistrict','district','province','postalCode','country','isDefault','createdAt'],
  Visitors: ['id','date','ipHash','userAgent','count','createdAt'],
  Logs: ['id','username','action','module','detail','timestamp'],
  Backups: ['id','fileId','fileName','createdBy','createdAt','status'],
  DriveAssets: ['id','fileId','mimeType','folder','access','ownerType','ownerId','purpose','status','createdAt'],
  Favorites: ['id','customerId','productId','createdAt'],
  PasswordResets: ['id','tokenHash','accountType','userId','expiresAt','usedAt','createdAt'],
  QrLoginChallenges: ['id','challengeHash','status','approvedCustomerId','expiresAt','createdAt','approvedAt','consumedAt'],
  Newsletters: ['id','email','status','createdAt'],
  Stores: ['id','ownerCustomerId','shopName','slug','description','logo','banner','email','phone','address','status','rating','followerCount','commissionRate','approvedAt','createdAt','updatedAt'],
  StoreFollows: ['id','customerId','storeId','createdAt'],
  SellerOrders: ['id','parentOrderId','orderNumber','sellerId','subtotal','discountAmount','commissionRate','commissionAmount','netAmount','shippingFee','shippingAddress','status','carrier','trackingNumber','shippedAt','deliveredAt','createdAt','updatedAt'],
  SellerPayouts: ['id','sellerId','sellerOrderId','grossAmount','discountAmount','commissionAmount','netAmount','status','payoutReference','paidAt','createdAt','updatedAt'],
  FlashDeals: ['id','name','sellerId','productId','dealPrice','quota','soldCount','startAt','endAt','status','createdAt','updatedAt'],
  CollectedVouchers: ['id','customerId','couponId','collectedAt','usedAt'],
  ChatThreads: ['id','customerId','sellerId','productId','lastMessage','lastMessageAt','status','createdAt','updatedAt'],
  ChatMessages: ['id','threadId','senderId','senderType','message','attachmentUrl','clientMessageId','isRead','readAt','deletedAt','deletedBy','createdAt'],
  ReturnRequests: ['id','orderId','orderItemId','customerId','sellerId','quantity','reason','details','evidence','status','sellerResponse','adminResponse','createdAt','updatedAt','resolvedAt'],
  CoinTransactions: ['id','customerId','orderId','type','amount','description','createdAt'],
  Notifications: ['id','recipientId','recipientType','title','message','type','link','isRead','createdAt'],
  CustomerPreferences: ['id','customerId','profileReviewVisibility','personalizedOffers','orderNotifications','promotionNotifications','securityNotifications','defaultAddressId','defaultPaymentMethod','updatedAt'],
  CustomerBankAccounts: ['id','customerId','bankName','accountName','accountLast4','isDefault','createdAt','updatedAt'],
  LiveRooms: ['id','sellerId','title','description','streamUrl','thumbnail','scheduledAt','status','createdAt','updatedAt']
};

var DEFAULT_SETTINGS_ = {
  storeName: 'My Online Store', storeNameEn: 'My Online Store', storeDescription: 'สินค้าคุณภาพ ส่งตรงถึงคุณ',
  logo: '', favicon: '', setFaviconUrl: '', heroImage: '', address: '', phone: '', email: '', currency: 'THB', currencySymbol: '฿',
  locale: 'th-TH', timezone: 'Asia/Bangkok', taxRate: '0', defaultShippingFee: '40', freeShippingMinimum: '1000',
  minimumOrder: '0', allowGuestCheckout: 'true', paymentMethods: '["bank_transfer","qr_payment","cod"]',
  bankName: '', bankAccountName: '', bankAccountNumber: '', bankQrImage: '', facebook: '', instagram: '',
  tiktok: '', line: '', youtube: '', googleMaps: '', returnPolicy: '', privacyPolicy: '', terms: '',
  primaryColor: '#ee4d2d', secondaryColor: '#0f172a', accentColor: '#f59e0b', footerText: 'ขอบคุณที่เลือกซื้อสินค้ากับเรา',
  seoTitle: 'Online Store', seoDescription: '', homeSections: '[]', mallStoreIds: '[]',
  marketplaceCommissionRate: '5', returnWindowDays: '7', coinRewardRate: '1', sellerRegistrationEnabled: 'true'
};

function doGet(e) {
  var params = e && e.parameter ? e.parameter : {};
  var qrChallenge = String(params.qr || '');
  if (!/^[a-fA-F0-9]{50,100}$/.test(qrChallenge)) qrChallenge = '';
  var portalEntry = String(params.portal || '').toLowerCase();
  if (['customer', 'seller', 'owner'].indexOf(portalEntry) < 0) portalEntry = '';
  var page = HtmlService.createTemplateFromFile('Index');
  page.qrLoginChallenge = qrChallenge;
  page.portalEntry = portalEntry;
  page.webAppUrl = getWebAppUrl_();
  var output = page.evaluate().setTitle(getInitialPageTitle_());
  // Apps Script must receive the favicon URL from HtmlOutput.setFaviconUrl();
  // a <link rel=icon> added by client JavaScript is inside the sandbox iframe
  // and does not reliably control the browser tab icon.
  try {
    var browserFaviconUrl = getInitialFaviconUrl_();
    if (browserFaviconUrl) output.setFaviconUrl(browserFaviconUrl);
  } catch (faviconError) {
    // A bad or inaccessible favicon must never prevent the storefront loading.
    console.warn('Favicon skipped: ' + String(faviconError && faviconError.message || faviconError));
  }
  return output.addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1');
}

/**
 * Returns a URL with an explicit image extension for HtmlOutput.setFaviconUrl.
 * Only the configured Website/Favicon file is made publicly readable: browser
 * tabs fetch favicons outside the authenticated Apps Script image service.
 * All other Drive assets remain private and continue using the asset service.
 */
function getInitialFaviconUrl_() {
  try {
    var result = getSettings();
    var settings = result && result.success ? (result.data || {}) : {};
    var configured = String(settings.setFaviconUrl || settings.favicon || '').trim();
    if (!configured) return '';

    var driveId = extractDriveIdFromAssetValue_(configured);
    if (driveId) {
      if (!/^[A-Za-z0-9_-]{10,100}$/.test(driveId)) return '';
      var file = DriveApp.getFileById(driveId);
      if (!file || file.isTrashed() || !isFileInSystemFolder_(file, 'Website')) return '';
      var mime = String(file.getMimeType() || '').toLowerCase();
      // New uploads are normalized to PNG before they are saved.
      if (mime !== 'image/png') return '';
      var access = file.getSharingAccess();
      if (access !== DriveApp.Access.ANYONE_WITH_LINK && access !== DriveApp.Access.ANYONE) {
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        access = file.getSharingAccess();
      }
      if (access !== DriveApp.Access.ANYONE_WITH_LINK && access !== DriveApp.Access.ANYONE) return '';
      var version = file.getLastUpdated ? file.getLastUpdated().getTime() : Date.now();
      // `format=png` is intentionally the final URL suffix. HtmlOutput checks
      // the URL's image extension before accepting setFaviconUrl().
      return 'https://drive.google.com/uc?export=download&id=' + encodeURIComponent(driveId) +
        '&v=' + encodeURIComponent(String(version)) + '&format=png';
    }

    // External Favicon URLs must identify an image format. Preserve signed
    // query parameters and append a recognized format suffix where needed.
    if (!/^https:\/\//i.test(configured)) return '';
    var extMatch = configured.match(/\.(png|ico|gif|jpe?g)(?:[?#].*)?$/i);
    if (!extMatch) return '';
    var ext = String(extMatch[1] || 'png').toLowerCase();
    if (/[?#]/.test(configured)) {
      if (configured.indexOf('#') >= 0) {
        var parts = configured.split('#');
        configured = parts[0] + (parts[0].indexOf('?') >= 0 ? '&' : '?') + 'format=' + ext + '#' + parts.slice(1).join('#');
      } else {
        configured += (configured.indexOf('?') >= 0 ? '&' : '?') + 'format=' + ext;
      }
    }
    return configured;
  } catch (error) {
    console.warn('Unable to prepare browser favicon: ' + String(error && error.message || error));
    return '';
  }
}

/**
 * Uses the configured browser title (SEO Title) or store name for the initial
 * document title. Client-side applySettings() applies the same value after load.
 */
function getInitialPageTitle_() {
  try {
    var result = getSettings();
    var settings = result && result.success ? (result.data || {}) : {};
    var title = String(settings.seoTitle || settings.storeName || 'Online Store')
      .replace(/[\r\n\t]+/g, ' ').trim().substring(0, 120);
    return title || 'Online Store';
  } catch (err) {
    return 'Online Store';
  }
}

/**
 * Returns the currently deployed Web App URL, with the configured URL as a
 * fallback for editor/test executions where getUrl() can be empty.
 * This prevents QR-login and password-reset links from retaining an old
 * deployment URL after the project has been redeployed.
 */
function getWebAppUrl_() {
  var currentUrl = '';
  try {
    currentUrl = ScriptApp.getService().getUrl() || '';
  } catch (err) {
    currentUrl = '';
  }
  var url = String(currentUrl || WEB_APP_URL || '').trim();
  return url.replace(/\/dev(?=($|\?))/, '/exec');
}

/* ------------------------------ SYSTEM SETUP ----------------------------- */
function setupSystem() {
  var result = { success: false, message: '' };
  try {
    validateConfig_();
    var ss = getSpreadsheet_();
    Object.keys(SCHEMA_).forEach(function(name) {
      var sh = ss.getSheetByName(name);
      if (!sh) sh = ss.insertSheet(name);
      var headers = SCHEMA_[name];
      if (sh.getLastRow() === 0) {
        sh.getRange(1, 1, 1, headers.length).setValues([headers]);
        sh.setFrozenRows(1);
      } else {
        var existing = sh.getRange(1, 1, 1, Math.max(sh.getLastColumn(), 1)).getValues()[0];
        var missing = headers.filter(function(h) { return existing.indexOf(h) < 0; });
        if (missing.length) {
          var merged = existing.filter(String).concat(missing);
          sh.getRange(1, 1, 1, merged.length).setValues([merged]);
          sh.setFrozenRows(1);
        }
      }
    });
    var root = DriveApp.getFolderById(FOLDER_ID);
    var folderNames = ['Products','Categories','Banners','Customers','Payments','Reviews','ChatMessages','Documents','Website','Backup'];
    folderNames.forEach(function(name) { getOrCreateFolder_(root, name); });
    Object.keys(DEFAULT_SETTINGS_).forEach(function(key) {
      if (getSettingValue_(key) === null) upsertSetting_(key, DEFAULT_SETTINGS_[key]);
    });
    migrateLegacySmsOtpArtifacts_();
    var users = readTable_('Users', false);
    var adminExists = users.some(function(u) { return String(u.username).toLowerCase() === 'admin'; });
    if (!adminExists) {
      var now = now_();
      appendRecord_('Users', {
        id: newId_('USR'), username: 'admin', email: '', passwordHash: hashPassword_(ADMIN_PASSWORD),
        name: 'Store Administrator', role: 'Super Admin', permissions: JSON.stringify(['*']), status: 'Active',
        mustChangePassword: true, createdAt: now, updatedAt: now
      });
    }
    clearRuntimeCaches_();
    result.success = true;
    result.message = 'ตั้งค่าระบบสำเร็จ: สร้างตาราง ตรวจสอบ Drive และเตรียมบัญชีผู้ดูแลแล้ว';
    return result;
  } catch (error) {
    result.message = safeError_(error);
    return result;
  }
}

function validateConfig_() {
  if (!SHEET_ID || !FOLDER_ID || !WEB_APP_URL || !ADMIN_PASSWORD) throw new Error('กรุณาตรวจสอบ Configuration ทั้ง 4 ค่า');
  if (String(ADMIN_PASSWORD).length < 4) throw new Error('ADMIN_PASSWORD ต้องมีอย่างน้อย 4 ตัวอักษร');
  getSpreadsheet_().getId();
  DriveApp.getFolderById(FOLDER_ID).getId();
}

/**
 * Run this function manually from the Apps Script editor as the deployment owner.
 * It triggers Google's OAuth consent flow for the DriveApp service and verifies
 * that the configured root folder can be opened. It does not share the folder
 * or expose Drive permissions to web-app visitors.
 */
function authorizeDriveAccess() {
  var report = {
    authorized: false,
    driveScope: false,
    rootFolderReadable: false,
    configuredFolderReadable: false,
    configuredFolderWritable: false,
    cleanupSucceeded: null,
    effectiveUser: '',
    folderId: FOLDER_ID,
    folderName: '',
    checks: []
  };
  var temporaryFolder = null;
  try {
    try { report.effectiveUser = Session.getEffectiveUser().getEmail() || ''; } catch (userError) {}

    // Check A: force the Drive OAuth scope check independently from FOLDER_ID.
    try {
      var driveRoot = DriveApp.getRootFolder();
      report.driveScope = !!driveRoot.getId();
      report.rootFolderReadable = true;
      report.checks.push({step: 'Drive OAuth / root folder', success: true, detail: 'เข้าถึง Drive root ได้'});
    } catch (scopeError) {
      report.checks.push({step: 'Drive OAuth / root folder', success: false, detail: driveErrorDetail_(scopeError)});
      throw new Error('DRIVE_SCOPE_ERROR: ' + driveErrorDetail_(scopeError));
    }

    // Check B: confirm the configured FOLDER_ID exists and is a folder the
    // effective user can read. This catches incorrect IDs and missing access.
    var folder;
    try {
      folder = DriveApp.getFolderById(FOLDER_ID);
      report.folderName = folder.getName();
      report.configuredFolderReadable = true;
      report.checks.push({step: 'Configured folder read', success: true, detail: 'พบโฟลเดอร์ ' + report.folderName});
    } catch (folderError) {
      report.checks.push({step: 'Configured folder read', success: false, detail: driveErrorDetail_(folderError)});
      throw new Error('FOLDER_READ_ERROR: ' + driveErrorDetail_(folderError));
    }

    // Check C: create and trash a temporary child folder to verify write
    // permission. Merely calling getFolderById() only proves read access.
    try {
      temporaryFolder = folder.createFolder('_GAS_DRIVE_PERMISSION_CHECK_' + new Date().getTime());
      report.configuredFolderWritable = !!temporaryFolder.getId();
      report.checks.push({step: 'Configured folder write', success: true, detail: 'สร้างโฟลเดอร์ทดสอบได้'});
      try {
        temporaryFolder.setTrashed(true);
        report.cleanupSucceeded = true;
      } catch (cleanupError) {
        report.cleanupSucceeded = false;
        report.checks.push({step: 'Cleanup test folder', success: false, detail: driveErrorDetail_(cleanupError)});
      }
    } catch (writeError) {
      report.configuredFolderWritable = false;
      report.checks.push({step: 'Configured folder write', success: false, detail: driveErrorDetail_(writeError)});
      throw new Error('FOLDER_WRITE_ERROR: ' + driveErrorDetail_(writeError));
    }

    report.authorized = true;
    var message = report.cleanupSucceeded === false
      ? 'เข้าถึงและเขียนโฟลเดอร์ได้ แต่ลบโฟลเดอร์ทดสอบไม่สำเร็จ กรุณาลบ _GAS_DRIVE_PERMISSION_CHECK_ ที่สร้างไว้ด้วยตนเอง'
      : 'Google Drive พร้อมใช้งาน: ตรวจสิทธิ์อ่านและสร้างโฟลเดอร์ใน FOLDER_ID ผ่านแล้ว';
    Logger.log('DRIVE_DIAGNOSTIC_RESULT=' + JSON.stringify(report));
    return ok_(report, message);
  } catch (error) {
    report.authorized = false;
    report.error = driveErrorDetail_(error);
    report.remediation = driveRemediation_(report.error, report);
    Logger.log('DRIVE_DIAGNOSTIC_RESULT=' + JSON.stringify(report));
    return fail_('ตรวจสอบ Google Drive ไม่ผ่าน: ' + report.error + ' วิธีแก้: ' + report.remediation + ' | รายละเอียดผลตรวจ: ' + JSON.stringify(report));
  }
}

function driveErrorDetail_(error) {
  var message = error && error.message ? String(error.message) : String(error || 'Unknown Drive error');
  return message.replace(/[\r\n]+/g, ' ').substring(0, 500);
}

function driveRemediation_(message, report) {
  var m = String(message || '').toLowerCase();
  if (m.indexOf('drive_scope_error') >= 0 || m.indexOf('authorization is required') >= 0 || m.indexOf('insufficient authentication scopes') >= 0 || m.indexOf('not authorized to call') >= 0 || m.indexOf('required permissions') >= 0) {
    return 'เปิด Apps Script > Project Settings > appsscript.json หากมี oauthScopes กำหนดเอง ให้เพิ่ม https://www.googleapis.com/auth/drive ในรายการเดิมโดยไม่ลบ scope อื่น จากนั้น Save และ Run authorizeDriveAccess() เพื่ออนุญาตใหม่';
  }
  if (m.indexOf('folder_read_error') >= 0 || m.indexOf('not found') >= 0 || m.indexOf('file not found') >= 0 || m.indexOf('invalid argument') >= 0) {
    return 'ตรวจว่า FOLDER_ID เป็น ID ของโฟลเดอร์จริง ไม่ใช่ URL/ID ของไฟล์ และเปิดลิงก์โฟลเดอร์ด้วยบัญชีที่แสดงใน effectiveUser ได้';
  }
  if (m.indexOf('folder_write_error') >= 0 || m.indexOf('access denied') >= 0 || m.indexOf('permission') >= 0) {
    return 'แชร์โฟลเดอร์ FOLDER_ID ให้บัญชี effectiveUser เป็น Editor (หรือบทบาทที่สร้างโฟลเดอร์ได้ใน Shared Drive) แล้ว Run authorizeDriveAccess() ใหม่';
  }
  return 'ตรวจ FOLDER_ID, สิทธิ์บัญชี effectiveUser, OAuth scope ของ Drive และนโยบาย Google Workspace/Shared Drive แล้ว Run authorizeDriveAccess() ใหม่';
}

function getOrCreateFolder_(parent, name) {
  var it = parent.getFoldersByName(name);
  return it.hasNext() ? it.next() : parent.createFolder(name);
}

function clearRuntimeCaches_() {
  var cache = CacheService.getScriptCache();
  ['table_Settings','table_Products','table_Categories','table_Banners','table_Promotions','table_Inventory',
   'table_Orders','table_OrderItems','table_Reviews','product_public_metrics_v1','dashboard','public_settings'].forEach(function(key) {
    try { cache.remove(key); } catch (e) {}
  });
  return true;
}

function safeArray_(value) { return Array.isArray(value) ? value : []; }

function safeJson_(value, fallback) {
  if (value === null || value === undefined || value === '') return fallback;
  try {
    var parsed = JSON.parse(value);
    if (Array.isArray(fallback)) return Array.isArray(parsed) ? parsed : fallback;
    if (fallback && typeof fallback === 'object') return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : fallback;
    return parsed === null || parsed === undefined ? fallback : parsed;
  } catch (error) { return fallback; }
}

function getSpreadsheet_() {
  if (!DB_SPREADSHEET_) DB_SPREADSHEET_ = SpreadsheetApp.openById(SHEET_ID);
  return DB_SPREADSHEET_;
}

function validateTable_(name) {
  if (!Object.prototype.hasOwnProperty.call(SCHEMA_, name)) throw new Error('ไม่พบตารางที่ร้องขอ');
  return getSpreadsheet_().getSheetByName(name);
}

function readTable_(name, useCache) {
  var cache = CacheService.getScriptCache();
  var key = 'table_' + name;
  if (useCache !== false) {
    try {
      var raw = cache.get(key);
      if (raw) {
        var cached = safeArray_(safeJson_(raw, []));
        if (cached.length || raw === '[]') return cached;
      }
    } catch (e) {}
  }
  var sh = validateTable_(name);
  if (!sh || sh.getLastRow() < 2) return [];
  var values = sh.getDataRange().getValues();
  var headers = values[0].map(function(x) { return String(x); });
  var rows = [];
  for (var r = 1; r < values.length; r++) {
    var obj = {};
    for (var c = 0; c < headers.length; c++) obj[headers[c]] = serializable_(values[r][c]);
    rows.push(obj);
  }
  if (useCache !== false) {
    try { var json = JSON.stringify(rows); if (json.length < 95000) cache.put(key, json, CACHE_SECONDS_); } catch (e2) {}
  }
  return rows;
}

/** Read one matching record without materializing the entire sheet in Apps Script. */
function findRecordByExactColumn_(name, columnName, searchValue) {
  var sh = validateTable_(name);
  if (!sh) return null;
  var lastRow = sh.getLastRow();
  if (lastRow < 2) return null;
  var lastCol = sh.getLastColumn();
  var headers = sh.getRange(1, 1, 1, lastCol).getValues()[0].map(String);
  var colIndex = headers.indexOf(columnName);
  if (colIndex < 0) return null;
  var search = String(searchValue === null || searchValue === undefined ? '' : searchValue);
  if (!search) return null;
  var found = sh.getRange(2, colIndex + 1, lastRow - 1, 1)
    .createTextFinder(search).matchEntireCell(true).matchCase(false).findNext();
  if (!found) return null;
  var values = sh.getRange(found.getRow(), 1, 1, lastCol).getValues()[0];
  var record = {};
  for (var i = 0; i < headers.length; i++) record[headers[i]] = serializable_(values[i]);
  return record;
}

function findCustomerForLogin_(username, phoneKey) {
  var uname = String(username || '').trim().toLowerCase();
  var sh = validateTable_('Customers');
  if (!sh) return null;
  var lastRow = sh.getLastRow();
  if (lastRow < 2) return null;
  var lastCol = sh.getLastColumn();
  var headers = sh.getRange(1, 1, 1, lastCol).getValues()[0].map(String);
  var customerRangeFor = function(columnName) {
    var index = headers.indexOf(columnName);
    return index < 0 ? null : sh.getRange(2, index + 1, lastRow - 1, 1);
  };
  var readFoundRow = function(found) {
    if (!found) return null;
    var values = sh.getRange(found.getRow(), 1, 1, lastCol).getValues()[0], row = {};
    for (var i = 0; i < headers.length; i++) row[headers[i]] = serializable_(values[i]);
    return row;
  };
  var findExact = function(range, text) {
    if (!range || !text) return null;
    return range.createTextFinder(String(text)).matchEntireCell(true).matchCase(false).findNext();
  };

  // Email/username are exact-column searches; no full customer table read.
  var hit = null;
  if (uname.indexOf('@') >= 0) hit = findExact(customerRangeFor('email'), uname);
  if (!hit) hit = findExact(customerRangeFor('username'), uname);
  if (hit) {
    var byLogin = readFoundRow(hit);
    return byLogin && byLogin.status === 'Active' ? byLogin : null;
  }
  if (!phoneKey) return null;

  // Fast path for common stored phone formats.
  var phoneRange = customerRangeFor('phone');
  if (!phoneRange) return null;
  var raw = String(username || '').trim();
  var candidates = [raw, phoneKey];
  if (phoneKey.charAt(0) === '+') candidates.push(phoneKey.substring(1));
  if (phoneKey.indexOf('+66') === 0) candidates.push('0' + phoneKey.substring(3));
  var seen = {};
  for (var n = 0; n < candidates.length; n++) {
    var candidate = String(candidates[n] || '').trim();
    if (!candidate || seen[candidate]) continue;
    seen[candidate] = true;
    var phoneHit = findExact(phoneRange, candidate);
    if (phoneHit) {
      var phoneRow = readFoundRow(phoneHit);
      if (normalizePhoneForAuth_(phoneRow.phone) === phoneKey) return phoneRow.status === 'Active' ? phoneRow : null;
    }
  }

  // Legacy fallback supports phone values formatted with spaces/dashes.
  var phones = phoneRange.getDisplayValues();
  var matchRow = -1;
  for (var r = 0; r < phones.length; r++) {
    if (normalizePhoneForAuth_(phones[r][0]) === phoneKey) {
      if (matchRow >= 0) throw new Error('เบอร์โทรศัพท์นี้มีหลายบัญชี กรุณาติดต่อผู้ดูแลระบบ');
      matchRow = r + 2;
    }
  }
  if (matchRow < 0) return null;
  var rowValues = sh.getRange(matchRow, 1, 1, lastCol).getValues()[0], result = {};
  for (var c = 0; c < headers.length; c++) result[headers[c]] = serializable_(rowValues[c]);
  return result.status === 'Active' ? result : null;
}

function serializable_(value) {
  if (value instanceof Date) return value.toISOString();
  if (value === null || value === undefined) return '';
  return value;
}

var DRIVE_IMAGE_FIELDS_BY_TABLE_ = {
  Customers: ['profileImage'],
  Products: ['coverImage', 'images'],
  Categories: ['image'],
  Banners: ['image'],
  Stores: ['logo', 'banner'],
  LiveRooms: ['thumbnail'],
  OrderItems: ['image'],
  Reviews: ['images'],
  ChatMessages: ['attachmentUrl'],
  ReturnRequests: ['evidence']
};

function getDriveAssetTokenMap_() {
  var map = {};
  var rows = readTable_('DriveAssets', false);
  rows.forEach(function(row) {
    if (row && row.id && row.fileId) map[String(row.id)] = String(row.fileId);
  });
  return map;
}

/** Convert internal drive-asset tokens to the requested Googleusercontent URL. */
function normalizeDriveAssetUrlValue_(value, assetMap, strict) {
  if (Array.isArray(value)) {
    var arrayChanged = false;
    var convertedArray = value.map(function(item) {
      var converted = normalizeDriveAssetUrlValue_(item, assetMap, strict);
      if (converted !== item) arrayChanged = true;
      return converted;
    });
    return arrayChanged ? convertedArray : value;
  }
  if (typeof value !== 'string') return value;
  var raw = value.trim();
  var tokenMatch = raw.match(/^drive-asset:\/\/([A-Za-z0-9_-]{20,80})$/i);
  if (tokenMatch) {
    var fileId = assetMap[tokenMatch[1]];
    if (!fileId) {
      if (strict) throw new Error('ไม่พบ File ID ของรูปภาพใน DriveAssets สำหรับ asset reference นี้');
      return value;
    }
    return driveProfileImageUrl_(fileId);
  }
  // Image collections are stored as JSON strings in Google Sheets.
  if ((raw.charAt(0) === '[' || raw.charAt(0) === '{') && raw.indexOf('drive-asset://') >= 0) {
    try {
      var parsed = JSON.parse(raw);
      var convertedJson = normalizeDriveAssetUrlValue_(parsed, assetMap, strict);
      return JSON.stringify(convertedJson);
    } catch (error) {
      if (strict) throw error;
      return value;
    }
  }
  return value;
}

/** Normalize image fields on every normal write so new saves never reintroduce drive-asset://. */
function containsDriveAssetReference_(value) {
  if (Array.isArray(value)) return value.some(containsDriveAssetReference_);
  if (value && typeof value === 'object') return Object.keys(value).some(function(key) { return containsDriveAssetReference_(value[key]); });
  if (typeof value !== 'string') return false;
  if (value.indexOf('drive-asset://') >= 0) return true;
  var raw = value.trim();
  if (raw.charAt(0) === '[' || raw.charAt(0) === '{') {
    try { return containsDriveAssetReference_(JSON.parse(raw)); } catch (ignore) {}
  }
  return false;
}

function normalizeImageRecordForStorage_(tableName, record) {
  if (!record || typeof record !== 'object') return record;
  var fields = DRIVE_IMAGE_FIELDS_BY_TABLE_[tableName] || [];
  if (tableName === 'Settings' && ['logo', 'favicon', 'setFaviconUrl', 'heroImage', 'bankQrImage'].indexOf(String(record.key || '')) >= 0) fields = ['value'];
  var needsMap = fields.some(function(field) { return containsDriveAssetReference_(record[field]); });
  if (!needsMap) return record;
  var assetMap = getDriveAssetTokenMap_();
  var normalized = {};
  Object.keys(record).forEach(function(key) { normalized[key] = record[key]; });
  fields.forEach(function(field) {
    if (Object.prototype.hasOwnProperty.call(normalized, field)) {
      normalized[field] = normalizeDriveAssetUrlValue_(normalized[field], assetMap, true);
    }
  });
  return normalized;
}

/** One-time migration for legacy Drive asset tokens already stored in Sheets. Run from the owner Apps Script editor. */
function migrateLegacyDriveAssetUrlsToGoogleusercontent() {
  try {
    var activeEmail = '';
    var effectiveEmail = '';
    try { activeEmail = String(Session.getActiveUser().getEmail() || '').toLowerCase(); } catch (activeError) {}
    try { effectiveEmail = String(Session.getEffectiveUser().getEmail() || '').toLowerCase(); } catch (effectiveError) {}
    if (!activeEmail || (effectiveEmail && activeEmail !== effectiveEmail)) {
      throw new Error('เพื่อความปลอดภัย กรุณารัน Migration จาก Apps Script Editor ด้วยบัญชีเจ้าของโปรเจกต์เท่านั้น');
    }
    ensureDriveAssetsTable_();
    var assetMap = getDriveAssetTokenMap_();
    var specs = {
      Customers: ['profileImage'],
      Products: ['coverImage', 'images'],
      Categories: ['image'],
      Banners: ['image'],
      Stores: ['logo', 'banner'],
      LiveRooms: ['thumbnail'],
      OrderItems: ['image'],
      Reviews: ['images'],
      ChatMessages: ['attachmentUrl'],
      ReturnRequests: ['evidence']
    };
    var report = { converted: 0, unresolved: 0, bySheet: {}, unresolvedReferences: [] };
    Object.keys(specs).forEach(function(tableName) {
      var sheet = getSpreadsheet_().getSheetByName(tableName);
      if (!sheet || sheet.getLastRow() < 2 || sheet.getLastColumn() < 1) return;
      var values = sheet.getDataRange().getValues();
      var headers = values[0].map(function(value) { return String(value || '').trim(); });
      var indexes = specs[tableName].map(function(field) { return { field: field, index: headers.indexOf(field) }; }).filter(function(item) { return item.index >= 0; });
      if (!indexes.length) return;
      var count = 0;
      for (var r = 1; r < values.length; r++) {
        for (var c = 0; c < indexes.length; c++) {
          var item = indexes[c];
          var before = values[r][item.index];
          if (typeof before !== 'string' || before.indexOf('drive-asset://') < 0) continue;
          var after = normalizeDriveAssetUrlValue_(before, assetMap, false);
          if (after !== before) {
            values[r][item.index] = after;
            count++;
          } else {
            report.unresolved++;
            if (report.unresolvedReferences.length < 30) report.unresolvedReferences.push({ sheet: tableName, row: r + 1, column: item.field, value: String(before).substring(0, 120) });
          }
        }
      }
      if (count) {
        // Write only changed columns/cells to avoid overwriting unrelated formulas or data.
        for (var rr = 1; rr < values.length; rr++) {
          for (var cc = 0; cc < indexes.length; cc++) {
            var colIndex = indexes[cc].index;
            var original = sheet.getRange(rr + 1, colIndex + 1).getValue();
            var replacement = values[rr][colIndex];
            if (replacement !== original) sheet.getRange(rr + 1, colIndex + 1).setValue(replacement);
          }
        }
        report.converted += count;
      }
      report.bySheet[tableName] = count;
    });
    // Settings are key/value records rather than a table of image fields.
    var settings = getSpreadsheet_().getSheetByName('Settings');
    if (settings && settings.getLastRow() >= 2) {
      var sv = settings.getDataRange().getValues();
      var sh = sv[0].map(function(value) { return String(value || '').trim(); });
      var keyIndex = sh.indexOf('key'), valueIndex = sh.indexOf('value');
      if (keyIndex >= 0 && valueIndex >= 0) {
        var settingsCount = 0;
        var imageSettingKeys = ['logo', 'favicon', 'setFaviconUrl', 'heroImage', 'bankQrImage'];
        for (var sr = 1; sr < sv.length; sr++) {
          if (imageSettingKeys.indexOf(String(sv[sr][keyIndex] || '')) < 0) continue;
          var oldValue = sv[sr][valueIndex];
          if (typeof oldValue !== 'string' || oldValue.indexOf('drive-asset://') < 0) continue;
          var newValue = normalizeDriveAssetUrlValue_(oldValue, assetMap, false);
          if (newValue !== oldValue) { settings.getRange(sr + 1, valueIndex + 1).setValue(newValue); settingsCount++; }
          else { report.unresolved++; if (report.unresolvedReferences.length < 30) report.unresolvedReferences.push({ sheet: 'Settings', row: sr + 1, column: 'value', value: String(oldValue).substring(0, 120) }); }
        }
        report.converted += settingsCount;
        report.bySheet.Settings = settingsCount;
      }
    }
    SpreadsheetApp.flush();
    clearRuntimeCaches_();
    Logger.log('DRIVE_ASSET_URL_MIGRATION: ' + JSON.stringify(report));
    return report;
  } catch (error) {
    Logger.log('DRIVE_ASSET_URL_MIGRATION_ERROR: ' + String(error && error.message ? error.message : error));
    throw error;
  }
}


function preservePhoneAsText_(sheet, headers, rowNumber, rowValues) {
  var indexes=[];
  (headers||[]).forEach(function(header,index){if(/^(phone|mobile|telephone)$/i.test(String(header||'').trim()))indexes.push(index);});
  indexes.forEach(function(index){
    var value=rowValues[index];
    if(value!==null&&value!==undefined&&String(value).trim()!=='')rowValues[index]=String(value).trim();
    sheet.getRange(rowNumber,index+1).setNumberFormat('@');
  });
  return rowValues;
}

function appendRecord_(name, record) {
  record = normalizeImageRecordForStorage_(name, record);
  var sh = validateTable_(name);
  var headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0].map(String);
  var row = headers.map(function(h) { return Object.prototype.hasOwnProperty.call(record, h) ? record[h] : ''; });
  var targetRow=sh.getLastRow()+1;
  preservePhoneAsText_(sh,headers,targetRow,row);
  sh.getRange(targetRow,1,1,row.length).setValues([row]);
  invalidateTable_(name);
  return record;
}

function upsertById_(name, record) {
  record = normalizeImageRecordForStorage_(name, record);
  var sh = validateTable_(name);
  var vals = sh.getDataRange().getValues();
  if (!vals.length) throw new Error('กรุณารัน setupSystem() ก่อน');
  var headers = vals[0].map(String);
  var idCol = headers.indexOf('id');
  if (idCol < 0) throw new Error('ตารางไม่มีคอลัมน์ ID');
  var rowIndex = -1;
  for (var i = 1; i < vals.length; i++) if (String(vals[i][idCol]) === String(record.id)) { rowIndex = i + 1; break; }
  var row = headers.map(function(h) { return Object.prototype.hasOwnProperty.call(record, h) ? record[h] : ''; });
  if (rowIndex <= 0) rowIndex=sh.getLastRow()+1;
  preservePhoneAsText_(sh,headers,rowIndex,row);
  sh.getRange(rowIndex,1,1,row.length).setValues([row]);
  invalidateTable_(name);
  return record;
}

function updateRecord_(name, id, changes) {
  changes = normalizeImageRecordForStorage_(name, changes);
  var sh = validateTable_(name);
  var values = sh.getDataRange().getValues();
  if (values.length < 2) throw new Error('ไม่พบข้อมูล');
  var headers = values[0].map(String);
  var idCol = headers.indexOf('id');
  for (var r = 1; r < values.length; r++) {
    if (String(values[r][idCol]) === String(id)) {
      Object.keys(changes).forEach(function(key) {
        var col = headers.indexOf(key);
        if (col >= 0) values[r][col] = changes[key];
      });
      preservePhoneAsText_(sh,headers,r+1,values[r]);
      sh.getRange(r + 1, 1, 1, headers.length).setValues([values[r]]);
      invalidateTable_(name);
      return true;
    }
  }
  throw new Error('ไม่พบข้อมูลที่ต้องการแก้ไข');
}

function deleteRows_(name, predicate) {
  var sh = validateTable_(name);
  var values = sh.getDataRange().getValues();
  if (values.length < 2) return 0;
  var headers = values[0].map(String);
  var remove = [];
  for (var i = 1; i < values.length; i++) {
    var obj = {};
    headers.forEach(function(h, j) { obj[h] = values[i][j]; });
    if (predicate(obj)) remove.push(i + 1);
  }
  remove.reverse().forEach(function(rowNo) { sh.deleteRow(rowNo); });
  if (remove.length) invalidateTable_(name);
  return remove.length;
}

function invalidateTable_(name) {
  try { CacheService.getScriptCache().remove('table_' + name); } catch (e) {}
  try { CacheService.getScriptCache().remove('dashboard'); } catch (e2) {}
}

function upsertSetting_(key, value) {
  if (['logo', 'favicon', 'setFaviconUrl', 'heroImage', 'bankQrImage'].indexOf(String(key)) >= 0 && typeof value === 'string' && value.indexOf('drive-asset://') >= 0) {
    value = normalizeDriveAssetUrlValue_(value, getDriveAssetTokenMap_(), true);
  }
  var rows = readTable_('Settings', false);
  var found = rows.filter(function(r) { return String(r.key) === String(key); })[0];
  if (found) {
    var sh = validateTable_('Settings');
    var values = sh.getDataRange().getValues();
    var headers = values[0].map(String);
    var kcol = headers.indexOf('key');
    for (var i = 1; i < values.length; i++) if (String(values[i][kcol]) === String(key)) {
      values[i][headers.indexOf('value')] = value;
      values[i][headers.indexOf('updatedAt')] = now_();
      sh.getRange(i + 1, 1, 1, headers.length).setValues([values[i]]); break;
    }
  } else appendRecord_('Settings', { key: key, value: value, updatedAt: now_() });
  invalidateTable_('Settings');
}

function getSettingValue_(key) {
  var rows = readTable_('Settings', false);
  for (var i = 0; i < rows.length; i++) if (String(rows[i].key) === String(key)) return rows[i].value;
  return null;
}

function now_() { return new Date().toISOString(); }
function newId_(prefix) { return prefix + '_' + Utilities.getUuid().replace(/-/g, '').toUpperCase(); }
function sha256_(text) {
  var bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, String(text), Utilities.Charset.UTF_8);
  return bytes.map(function(b) { var v = (b < 0 ? b + 256 : b).toString(16); return v.length === 1 ? '0' + v : v; }).join('');
}
function hashPassword_(password) {
  var salt = Utilities.getUuid().replace(/-/g, '');
  var value = salt + ':' + String(password);
  for (var i = 0; i < PASSWORD_ROUNDS_; i++) value = Utilities.base64Encode(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, value, Utilities.Charset.UTF_8));
  return salt + '$' + value;
}
function verifyPassword_(password, stored) {
  var parts = String(stored || '').split('$');
  if (parts.length !== 2) return false;
  var value = parts[0] + ':' + String(password);
  for (var i = 0; i < PASSWORD_ROUNDS_; i++) value = Utilities.base64Encode(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, value, Utilities.Charset.UTF_8));
  return constantTimeEqual_(value, parts[1]);
}
function constantTimeEqual_(a, b) {
  a = String(a); b = String(b);
  var diff = a.length ^ b.length;
  var max = Math.max(a.length, b.length);
  for (var i = 0; i < max; i++) diff |= (a.charCodeAt(i % (a.length || 1)) || 0) ^ (b.charCodeAt(i % (b.length || 1)) || 0);
  return diff === 0;
}
function safeError_(error) {
  var message = error && error.message ? String(error.message) : 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ';
  if (/DriveApp|insufficient authentication scopes|authorization is required|not authorized to call|Access denied|permission/i.test(message)) {
    return 'Google Drive: ' + message.replace(/[\r\n]+/g, ' ').substring(0, 360) + ' | เรียก authorizeDriveAccess() จาก Apps Script Editor และตรวจ effective user, OAuth scope และสิทธิ์ FOLDER_ID';
  }
  return message.substring(0, 360);
}
function ok_(data, message) { return { success: true, data: data === undefined ? null : data, message: message || '' }; }
function fail_(message) { return { success: false, data: null, message: String(message || 'เกิดข้อผิดพลาด') }; }
function parseBool_(v) { return v === true || String(v).toLowerCase() === 'true' || String(v) === '1'; }
function number_(v, fallback) { var n = Number(v); return isFinite(n) ? n : (fallback || 0); }
function text_(v, max) { return String(v === null || v === undefined ? '' : v).trim().substring(0, max || 2000); }
function jsonField_(v, fallback) { return safeJson_(v, fallback); }
function withLock_(fn) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try { return fn(); } finally { lock.releaseLock(); }
}

/* --------------------------- AUTH / PERMISSIONS -------------------------- */
function sessionCacheKey_(tokenHash) { return 'session_' + String(tokenHash || '').substring(0, 54); }

function createSession_(user, accountType) {
  var raw = Utilities.getUuid() + Utilities.getUuid() + Utilities.getUuid();
  var token = raw.replace(/-/g, '') + Utilities.getUuid().replace(/-/g, '');
  var tokenHash = sha256_(token);
  var expires = new Date(Date.now() + SESSION_HOURS_ * 60 * 60 * 1000).toISOString();
  var record = {
    id: newId_('SES'), tokenHash: tokenHash, userId: user.id, username: user.username,
    accountType: accountType, role: user.role || 'Customer', permissions: JSON.stringify(user.permissions || []),
    expiresAt: expires, createdAt: now_(), revokedAt: ''
  };
  appendRecord_('Sessions', record);
  // An unguessable token can be resolved from cache instead of scanning the full Sessions sheet.
  try { CacheService.getScriptCache().put(sessionCacheKey_(tokenHash), JSON.stringify(record), 120); } catch (e) {}
  return { token: token, expiresAt: expires };
}

function findSession_(token, accountType) {
  if (!token) return null;
  var tokenHash = sha256_(token), key = sessionCacheKey_(tokenHash), cache = CacheService.getScriptCache();
  try {
    var cached = cache.get(key);
    if (cached) {
      var item = safeJson_(cached, null);
      if (item && item.tokenHash === tokenHash && item.accountType === accountType && !item.revokedAt && new Date(item.expiresAt).getTime() > Date.now()) return item;
      if (item && (item.revokedAt || new Date(item.expiresAt).getTime() <= Date.now())) cache.remove(key);
    }
  } catch (e) {}
  // Query only the exact token hash instead of scanning every historical session.
  var session = findRecordByExactColumn_('Sessions', 'tokenHash', tokenHash);
  if (session && session.accountType === accountType && !session.revokedAt && new Date(session.expiresAt).getTime() > Date.now()) {
    try { cache.put(key, JSON.stringify(session), 120); } catch (e2) {}
    return session;
  }
  return null;
}

function requireAdmin_(token, permission) {
  var session = findSession_(token, 'admin');
  if (!session) throw new Error('กรุณาเข้าสู่ระบบผู้ดูแลใหม่');
  var user = findRecordByExactColumn_('Users', 'id', session.userId);
  if (!user || user.status !== 'Active') throw new Error('บัญชีผู้ดูแลถูกปิดใช้งาน');
  var perms = safeArray_(safeJson_(user.permissions, []));
  if (user.role !== 'Super Admin' && user.role !== 'Admin' && perms.indexOf('*') < 0 && permission && perms.indexOf(permission) < 0) throw new Error('คุณไม่มีสิทธิ์ดำเนินการนี้');
  return user;
}

function requireCustomer_(token) {
  var session = findSession_(token, 'customer');
  if (!session) throw new Error('กรุณาเข้าสู่ระบบลูกค้า');
  var customer = findRecordByExactColumn_('Customers', 'id', session.userId);
  if (!customer || customer.status !== 'Active') throw new Error('ไม่พบบัญชีลูกค้า');
  return customer;
}

function loginPlatformUser_(username, password, requiredRole) {
  try {
    var uName = text_(username, 80).toLowerCase();
    var cache = CacheService.getScriptCache();
    var key = 'login_' + sha256_(uName);
    var attempts = number_(cache.get(key), 0);
    if (attempts >= 8) throw new Error('เข้าสู่ระบบไม่สำเร็จหลายครั้ง กรุณารอสักครู่');
    var user = findRecordByExactColumn_('Users', 'username', uName);
    if (user && user.status !== 'Active') user = null;
    if (!user || !verifyPassword_(password, user.passwordHash)) {
      cache.put(key, String(attempts + 1), 600);
      throw new Error('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    }
    if (requiredRole) {
      var actualRole = String(user.role || '').toLowerCase();
      if (actualRole !== String(requiredRole).toLowerCase() && actualRole !== 'superadmin') throw new Error('บัญชีนี้ไม่มีสิทธิ์เข้าสู่ระบบเจ้าของระบบ');
    }
    cache.remove(key);
    var session = createSession_(user, 'admin');
    log_('Login', 'Authentication', 'Admin login');
    return ok_({ token: session.token, expiresAt: session.expiresAt, user: publicUser_(user), mustChangePassword: parseBool_(user.mustChangePassword) }, 'เข้าสู่ระบบสำเร็จ');
  } catch (error) { return fail_(safeError_(error)); }
}

function logout(token) {
  try {
    var hash = sha256_(token || '');
    updateSessionRevoked_(hash);
    return ok_(true, 'ออกจากระบบแล้ว');
  } catch (error) { return fail_(safeError_(error)); }
}

function updateSessionRevoked_(hash) {
  var cache = CacheService.getScriptCache(), key = sessionCacheKey_(hash), cached = null;
  try { cached = safeJson_(cache.get(key), null); } catch (e) {}
  if (cached && cached.id) {
    try { updateRecord_('Sessions', cached.id, { revokedAt: now_() }); } catch (e2) {}
    try { cache.remove(key); } catch (e3) {}
    return;
  }
  var sessionRow = findRecordByExactColumn_('Sessions', 'tokenHash', hash);
  if (sessionRow && sessionRow.id) updateRecord_('Sessions', sessionRow.id, { revokedAt: now_() });
  try { cache.remove(key); } catch (e4) {}
  invalidateTable_('Sessions');
}

function checkSession(token) {
  try {
    var s = findSession_(token, 'admin');
    if (!s) return fail_('Session หมดอายุ');
    var u = findRecordByExactColumn_('Users', 'id', s.userId);
    if (!u || u.status !== 'Active') return fail_('บัญชีถูกปิดใช้งาน');
    return ok_({ user: publicUser_(u), mustChangePassword: parseBool_(u.mustChangePassword) });
  } catch (e) { return fail_(safeError_(e)); }
}

// Lightweight endpoints used only to restore the correct portal after a refresh.
// They deliberately do not load orders, sales reports, or other large datasets.
function checkCustomerPortalSession(token) {
  try { var customer = requireCustomer_(token); return ok_({ customer: publicCustomer_(customer), accountType: 'customer' }); }
  catch (e) { return fail_(safeError_(e)); }
}
function checkSellerPortalSession(token) {
  try {
    // Validate the customer session once, then return the store state so the
    // client can render Active/Pending/Suspended without a second round-trip.
    var customer = requireCustomer_(token);
    var store = findRecordByExactColumn_('Stores', 'ownerCustomerId', customer.id);
    return ok_({ customer: publicCustomer_(customer), store: store ? publicStore_(store) : null,
      accountType: 'seller', canAccessSellerCenter: !!(store && store.status === 'Active') });
  } catch (e) { return fail_(safeError_(e)); }
}
function checkOwnerPortalSession(token) {
  try {
    var user = requireAdmin_(token, '');
    var role = String(user.role || '').toLowerCase();
    if (role !== 'super admin' && role !== 'superadmin') throw new Error('บัญชีนี้ไม่มีสิทธิ์เจ้าของระบบ');
    return ok_({ user: publicUser_(user), accountType: 'owner' });
  } catch (e) { return fail_(safeError_(e)); }
}

function publicUser_(u) { return { id: u.id, username: u.username, email: u.email || '', name: u.name, role: u.role, permissions: safeArray_(safeJson_(u.permissions, [])), mustChangePassword: parseBool_(u.mustChangePassword) }; }

function changePassword(token, currentPassword, newPassword) {
  try {
    var user = requireAdmin_(token, '');
    if (String(newPassword || '').length < 8) throw new Error('รหัสผ่านใหม่ต้องมีอย่างน้อย 8 ตัวอักษร');
    if (!parseBool_(user.mustChangePassword) && !verifyPassword_(currentPassword, user.passwordHash)) throw new Error('รหัสผ่านปัจจุบันไม่ถูกต้อง');
    updateRecord_('Users', user.id, { passwordHash: hashPassword_(newPassword), mustChangePassword: false, updatedAt: now_() });
    log_('Change Password', 'Users', 'Changed own password');
    return ok_(true, 'เปลี่ยนรหัสผ่านสำเร็จ');
  } catch (e) { return fail_(safeError_(e)); }
}

function customerRegister(data) {
  return fail_('กรุณาสมัครสมาชิกด้วยอีเมลและยืนยัน Email OTP ก่อนตั้งรหัสผ่าน');
}

function normalizePhoneForAuth_(value) {
  var raw = String(value || '').trim();
  var digits = raw.replace(/\D/g, '');
  if (!digits) return '';
  if (raw.charAt(0) === '+') return '+' + digits;
  if (digits.indexOf('00') === 0) return '+' + digits.substring(2);
  if (digits.indexOf('66') === 0 && digits.length >= 10 && digits.length <= 12) return '+' + digits;
  // Legacy Thai local numbers remain valid for login and are normalized to E.164.
  if (/^0[0-9]{9}$/.test(digits)) return '+66' + digits.substring(1);
  return '';
}

function getEmailOtpHashPepper_() {
  var props = PropertiesService.getScriptProperties();
  var pepper = props.getProperty('EMAIL_OTP_HASH_SECRET');
  if (!pepper) {
    pepper = Utilities.getUuid().replace(/-/g, '') + Utilities.getUuid().replace(/-/g, '');
    props.setProperty('EMAIL_OTP_HASH_SECRET', pepper);
  }
  return pepper;
}

function normalizeRegistrationEmail_(value) {
  var email = String(value || '').trim().toLowerCase();
  if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    throw new Error('กรุณากรอกอีเมลที่ถูกต้อง เช่น name@example.com');
  }
  return email;
}

function ensureEmailOtpChallengesTable_() {
  var ss = getSpreadsheet_(), headers = SCHEMA_.EmailOtpChallenges;
  var sh = ss.getSheetByName('EmailOtpChallenges');
  if (!sh) sh = ss.insertSheet('EmailOtpChallenges');
  if (sh.getLastRow() === 0) {
    sh.getRange(1, 1, 1, headers.length).setValues([headers]);
    sh.setFrozenRows(1);
  } else {
    var current = sh.getRange(1, 1, 1, Math.max(1, sh.getLastColumn())).getValues()[0].map(String);
    var missing = headers.filter(function(h) { return current.indexOf(h) < 0; });
    if (missing.length) sh.getRange(1, 1, 1, current.filter(String).length + missing.length).setValues([current.filter(String).concat(missing)]);
  }
  return sh;
}

function authorizeEmailOtpService() {
  try {
    var remaining = MailApp.getRemainingDailyQuota();
    return ok_({ authorized: true, remainingRecipients: remaining }, 'อนุญาตบริการส่ง Email OTP แล้ว');
  } catch (e) {
    return fail_('ยังไม่ได้อนุญาต MailApp กรุณา Run ฟังก์ชันนี้จาก Apps Script และยืนยันสิทธิ์ส่งอีเมล: ' + safeError_(e));
  }
}

function getEmailOtpServiceStatus() {
  try {
    return ok_({ provider: 'Google Apps Script MailApp', configured: true, remainingRecipients: MailApp.getRemainingDailyQuota() });
  } catch (e) {
    return ok_({ provider: 'Google Apps Script MailApp', configured: false, remainingRecipients: 0 }, 'ยังไม่ได้อนุญาตบริการส่งอีเมล');
  }
}

function reserveEmailOtpSendQuota_(email) {
  var lock = LockService.getScriptLock();
  lock.waitLock(5000);
  try {
    var cache = CacheService.getScriptCache();
    var suffix = sha256_(email).substring(0, 24);
    var coolKey = 'email_otp_cool_' + suffix;
    var hourKey = 'email_otp_hour_' + suffix;
    if (cache.get(coolKey)) throw new Error('กรุณารอ 60 วินาทีก่อนขอรหัส Email OTP อีกครั้ง');
    var sent = number_(cache.get(hourKey), 0);
    if (sent >= 5) throw new Error('ขอรหัส Email OTP เกิน 5 ครั้งต่อชั่วโมง กรุณาลองใหม่ภายหลัง');
    cache.put(coolKey, '1', 60);
    cache.put(hourKey, String(sent + 1), 3600);
    return { coolKey: coolKey, hourKey: hourKey };
  } finally { lock.releaseLock(); }
}

function releaseEmailOtpSendQuota_(quota) {
  if (!quota) return;
  var cache = CacheService.getScriptCache();
  try { cache.remove(quota.coolKey); } catch (e) {}
  try {
    var n = number_(cache.get(quota.hourKey), 0);
    if (n > 0) cache.put(quota.hourKey, String(n - 1), 3600);
  } catch (e2) {}
}

function createEmailRegistrationOtp_() {
  var seed = newId_('EMAILOTP') + Utilities.getUuid();
  var n = parseInt(sha256_(seed).substring(0, 8), 16) % 1000000;
  return ('000000' + n).slice(-6);
}

function sendCustomerEmailOtp_(email, otp) {
  var remaining = MailApp.getRemainingDailyQuota();
  if (remaining < 1) throw new Error('วันนี้ระบบส่งอีเมลครบโควตาแล้ว กรุณาลองใหม่ภายหลัง');
  var settings = getSettings();
  var store = settings && settings.success ? (settings.data || {}) : {};
  var brand = text_(store.storeName || 'Marketplace', 100);
  var subject = 'รหัสยืนยันอีเมลสำหรับสมัครสมาชิก ' + brand;
  var textBody = 'รหัสยืนยันอีเมลของคุณคือ ' + otp + '\nรหัสนี้หมดอายุภายใน 5 นาที และใช้ได้ครั้งเดียว\nห้ามส่งต่อรหัสนี้ให้ผู้อื่น หากคุณไม่ได้เป็นผู้สมัครสมาชิก สามารถละเว้นอีเมลฉบับนี้ได้';
  var safeBrand = brand.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  var htmlBody = '<div style="margin:0;padding:28px;background:#f4f6fa;font-family:Arial,sans-serif;color:#1f2937">' +
    '<div style="max-width:520px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:28px">' +
    '<div style="font-size:12px;font-weight:700;letter-spacing:1px;color:#ee4d2d">' + safeBrand + '</div>' +
    '<h2 style="margin:16px 0 8px;font-size:22px">ยืนยันอีเมลของคุณ</h2>' +
    '<p style="margin:0;color:#64748b;line-height:1.6">ใช้รหัสด้านล่างเพื่อดำเนินการสมัครสมาชิก รหัสมีอายุ 5 นาที</p>' +
    '<div style="margin:24px 0;padding:18px;background:#fff4ef;border-radius:12px;text-align:center;font-size:32px;font-weight:700;letter-spacing:9px;color:#ee4d2d">' + otp + '</div>' +
    '<p style="font-size:13px;color:#64748b;line-height:1.7">รหัสนี้ใช้ได้ครั้งเดียว ห้ามส่งต่อให้ผู้อื่น หากคุณไม่ได้ร้องขอรหัสนี้ ไม่ต้องดำเนินการใด ๆ</p>' +
    '</div></div>';
  try {
    MailApp.sendEmail({ to: email, subject: subject, body: textBody, htmlBody: htmlBody, name: brand });
  } catch (e) {
    throw new Error('ส่ง Email OTP ไม่สำเร็จ กรุณาตรวจสอบโควตาอีเมลและสิทธิ์ MailApp');
  }
  return true;
}

function findCustomerByEmailAnyStatus_(email) {
  var hit = findRecordByExactColumn_('Customers', 'email', email);
  if (hit) return hit;
  hit = findRecordByExactColumn_('Customers', 'username', email);
  if (hit && String(hit.email || '').toLowerCase() === email) return hit;
  return null;
}

function beginCustomerEmailRegistration(email) {
  try {
    ensureEmailOtpChallengesTable_();
    var normalized = normalizeRegistrationEmail_(email);
    var existing = findCustomerByEmailAnyStatus_(normalized);
    if (existing) return fail_(existing.status === 'Active' ? 'อีเมลนี้มีบัญชีอยู่แล้ว กรุณาเข้าสู่ระบบ' : 'อีเมลนี้ผูกกับบัญชีที่ยังไม่สามารถใช้งานได้ กรุณาติดต่อผู้ดูแล');
    var quota = reserveEmailOtpSendQuota_(normalized);
    var challengeId = newId_('EOTP'), otp = createEmailRegistrationOtp_(), now = Date.now();
    try { sendCustomerEmailOtp_(normalized, otp); }
    catch (sendError) { releaseEmailOtpSendQuota_(quota); throw sendError; }
    readTable_('EmailOtpChallenges', false).forEach(function(x) {
      if (String(x.email || '').toLowerCase() === normalized && x.purpose === 'Registration' && (x.status === 'Sent' || x.status === 'Verified')) {
        updateRecord_('EmailOtpChallenges', x.id, { status: 'Superseded', registrationTicketHash: '' });
      }
    });
    var expires = new Date(now + 5 * 60 * 1000).toISOString();
    appendRecord_('EmailOtpChallenges', {
      id: challengeId, email: normalized, purpose: 'Registration',
      codeHash: sha256_('email-registration-otp|' + getEmailOtpHashPepper_() + '|' + challengeId + '|' + normalized + '|' + otp),
      status: 'Sent', attempts: 0, expiresAt: expires, lastSentAt: new Date(now).toISOString(),
      registrationTicketHash: '', registrationTicketExpiresAt: '', verifiedAt: '', consumedAt: '', createdAt: new Date(now).toISOString()
    });
    return ok_({ challengeId: challengeId, email: normalized, maskedEmail: maskEmailForDisplay_(normalized), expiresAt: expires, resendAfter: 60 }, 'ส่งรหัสยืนยันไปยังอีเมลแล้ว');
  } catch (e) { return fail_(safeError_(e)); }
}

function maskEmailForDisplay_(email) {
  var parts = String(email || '').split('@');
  if (parts.length !== 2) return 'อีเมลที่ลงทะเบียน';
  var name = parts[0];
  var masked = name.length <= 2 ? name.charAt(0) + '•' : name.substring(0, 2) + '•'.repeat(Math.min(6, name.length - 2));
  return masked + '@' + parts[1];
}

function resendCustomerEmailRegistrationOtp(challengeId, email) {
  try {
    ensureEmailOtpChallengesTable_();
    var normalized = normalizeRegistrationEmail_(email);
    var challenge = findRecordByExactColumn_('EmailOtpChallenges', 'id', text_(challengeId, 100));
    if (!challenge || String(challenge.email || '').toLowerCase() !== normalized || challenge.purpose !== 'Registration' || ['Sent','Expired','Failed'].indexOf(challenge.status) < 0) throw new Error('คำขอ Email OTP นี้ไม่สามารถใช้ได้ กรุณาเริ่มสมัครใหม่');
    var quota = reserveEmailOtpSendQuota_(normalized), otp = createEmailRegistrationOtp_(), now = Date.now();
    try { sendCustomerEmailOtp_(normalized, otp); }
    catch (sendError) { releaseEmailOtpSendQuota_(quota); throw sendError; }
    var expires = new Date(now + 5 * 60 * 1000).toISOString();
    updateRecord_('EmailOtpChallenges', challenge.id, {
      codeHash: sha256_('email-registration-otp|' + getEmailOtpHashPepper_() + '|' + challenge.id + '|' + normalized + '|' + otp),
      status: 'Sent', attempts: 0, expiresAt: expires, lastSentAt: new Date(now).toISOString(),
      registrationTicketHash: '', registrationTicketExpiresAt: '', verifiedAt: ''
    });
    return ok_({ challengeId: challenge.id, email: normalized, maskedEmail: maskEmailForDisplay_(normalized), expiresAt: expires, resendAfter: 60 }, 'ส่ง Email OTP ใหม่แล้ว');
  } catch (e) { return fail_(safeError_(e)); }
}

function verifyCustomerEmailRegistrationOtp(challengeId, email, otp) {
  try {
    ensureEmailOtpChallengesTable_();
    return withLock_(function() {
      var challenge = findRecordByExactColumn_('EmailOtpChallenges', 'id', text_(challengeId, 100));
      var normalized = normalizeRegistrationEmail_(email), code = String(otp || '').replace(/\D/g, '');
      if (!challenge || String(challenge.email || '').toLowerCase() !== normalized || challenge.purpose !== 'Registration' || challenge.status !== 'Sent') return fail_('รหัส Email OTP ไม่ถูกต้องหรือหมดอายุ กรุณาขอรหัสใหม่');
      if (new Date(challenge.expiresAt).getTime() <= Date.now()) {
        updateRecord_('EmailOtpChallenges', challenge.id, { status: 'Expired' });
        return fail_('รหัส Email OTP หมดอายุแล้ว กรุณาขอรหัสใหม่');
      }
      var attempts = number_(challenge.attempts, 0);
      if (attempts >= 5) { updateRecord_('EmailOtpChallenges', challenge.id, { status: 'Blocked' }); return fail_('กรอกรหัส Email OTP ผิดเกินกำหนด กรุณาขอรหัสใหม่'); }
      var expected = sha256_('email-registration-otp|' + getEmailOtpHashPepper_() + '|' + challenge.id + '|' + normalized + '|' + code);
      if (!/^\d{6}$/.test(code) || !constantTimeEqual_(expected, challenge.codeHash)) {
        attempts++;
        updateRecord_('EmailOtpChallenges', challenge.id, { attempts: attempts, status: attempts >= 5 ? 'Blocked' : 'Sent' });
        return fail_(attempts >= 5 ? 'กรอกรหัส Email OTP ผิดเกินกำหนด กรุณาขอรหัสใหม่' : 'รหัส Email OTP ไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง');
      }
      var ticket = Utilities.getUuid().replace(/-/g, '') + Utilities.getUuid().replace(/-/g, '');
      var ticketExpires = new Date(Date.now() + 10 * 60 * 1000).toISOString();
      updateRecord_('EmailOtpChallenges', challenge.id, {
        status: 'Verified', registrationTicketHash: sha256_('email-registration-ticket|' + getEmailOtpHashPepper_() + '|' + challenge.id + '|' + ticket),
        registrationTicketExpiresAt: ticketExpires, verifiedAt: now_()
      });
      return ok_({ challengeId: challenge.id, registrationTicket: ticket, email: normalized, expiresAt: ticketExpires }, 'ยืนยันอีเมลสำเร็จ');
    });
  } catch (e) { return fail_(safeError_(e)); }
}

function customerCompleteEmailRegistration(challengeId, email, registrationTicket, password) {
  try {
    ensureEmailOtpChallengesTable_();
    return withLock_(function() {
      var id = text_(challengeId, 100), normalized = normalizeRegistrationEmail_(email);
      var ticket = String(registrationTicket || ''), pass = String(password || '');
      if (pass.length < 8 || pass.length > 128) throw new Error('รหัสผ่านต้องมีความยาว 8-128 ตัวอักษร');
      var challenge = findRecordByExactColumn_('EmailOtpChallenges', 'id', id);
      if (!challenge || String(challenge.email || '').toLowerCase() !== normalized || challenge.purpose !== 'Registration' || challenge.status !== 'Verified') throw new Error('ไม่พบการยืนยันอีเมล กรุณายืนยัน Email OTP ใหม่');
      if (!ticket || new Date(challenge.registrationTicketExpiresAt).getTime() <= Date.now()) throw new Error('หมดเวลาตั้งรหัสผ่าน กรุณายืนยัน Email OTP ใหม่');
      var ticketHash = sha256_('email-registration-ticket|' + getEmailOtpHashPepper_() + '|' + id + '|' + ticket);
      if (!constantTimeEqual_(ticketHash, challenge.registrationTicketHash)) throw new Error('ข้อมูลยืนยันไม่ถูกต้อง กรุณาเริ่มสมัครใหม่');
      var existing = findCustomerByEmailAnyStatus_(normalized);
      if (existing) throw new Error('อีเมลนี้มีบัญชีอยู่แล้ว กรุณาเข้าสู่ระบบ');
      var customer = {
        id: newId_('CUS'), username: normalized, passwordHash: hashPassword_(pass), firstname: '', lastname: '',
        phone: '', email: normalized, emailVerified: true, profileImage: '', authProvider: 'password', providerId: '', phoneCountry: '',
        status: 'Active', createdAt: now_(), updatedAt: now_()
      };
      appendRecord_('Customers', customer);
      updateRecord_('EmailOtpChallenges', challenge.id, { status: 'Completed', registrationTicketHash: '', consumedAt: now_() });
      var session = createSession_(customer, 'customer');
      return ok_({ token: session.token, expiresAt: session.expiresAt, customer: publicCustomer_(customer) }, 'สมัครสมาชิกสำเร็จ');
    });
  } catch (e) { return fail_(safeError_(e)); }
}

/** Remove legacy SMS challenge data and Twilio credentials after switching to Email OTP. */
function migrateLegacySmsOtpArtifacts_() {
  var ss = getSpreadsheet_();
  var legacy = ss.getSheetByName('OtpChallenges');
  if (legacy) ss.deleteSheet(legacy);
  var props = PropertiesService.getScriptProperties();
  ['SMS_PROVIDER','TWILIO_ACCOUNT_SID','TWILIO_AUTH_TOKEN','TWILIO_FROM_NUMBER','TWILIO_MESSAGING_SERVICE_SID','OTP_HASH_SECRET'].forEach(function(key) { props.deleteProperty(key); });
  var settings = ss.getSheetByName('Settings');
  if (settings && settings.getLastRow() > 1) {
    var values = settings.getRange(2, 1, settings.getLastRow() - 1, Math.min(1, settings.getLastColumn())).getDisplayValues();
    for (var i = values.length - 1; i >= 0; i--) if (values[i][0] === 'phoneRegistrationAllowedCountries') settings.deleteRow(i + 2);
  }
}

function migrateLegacySmsOtpToEmailOtp() {
  try {
    migrateLegacySmsOtpArtifacts_();
    clearRuntimeCaches_();
    return ok_({ migrated: true }, 'นำระบบ SMS OTP และการตั้งค่า Twilio เดิมออกแล้ว');
  } catch (e) { return fail_(safeError_(e)); }
}

function authenticateCustomerCredentials_(username, password) {
  var uname = text_(username, 160).trim();
  if (!uname) throw new Error('กรุณากรอกเบอร์โทรศัพท์หรืออีเมล');
  var phoneKey = normalizePhoneForAuth_(uname);
  var isEmail = uname.indexOf('@') > 0;
  // Phone login requires E.164 (+country calling code); legacy Thai national format remains supported.
  // Email/username stays available for existing seller accounts and linked accounts.
  if (!phoneKey && !isEmail && !/^[A-Za-z0-9._-]{3,80}$/.test(uname)) {
    throw new Error('กรุณากรอกอีเมล หรือเบอร์โทรศัพท์ของบัญชีเดิม');
  }
  var cache = CacheService.getScriptCache();
  var rateIdentity = phoneKey || ((isEmail ? 'email:' : 'username:') + uname.toLowerCase());
  var key = 'customer_login_' + sha256_(rateIdentity);
  var attempts = number_(cache.get(key), 0);
  if (attempts >= 8) throw new Error('เข้าสู่ระบบไม่สำเร็จหลายครั้ง กรุณารอสักครู่');
  // Targeted TextFinder lookup avoids transferring every customer row on each login.
  var customer = findCustomerForLogin_(uname, phoneKey);
  if (!customer || !verifyPassword_(password, customer.passwordHash)) {
    cache.put(key, String(attempts + 1), 600);
    throw new Error('เบอร์โทรศัพท์ อีเมล ชื่อผู้ใช้ หรือรหัสผ่านไม่ถูกต้อง');
  }
  cache.remove(key);
  return customer;
}

function customerLogin(username, password) {
  try {
    var customer = authenticateCustomerCredentials_(username, password);
    var session = createSession_(customer, 'customer');
    return ok_({ token: session.token, expiresAt: session.expiresAt, customer: publicCustomer_(customer) }, 'เข้าสู่ระบบสำเร็จ');
  } catch (e) { return fail_(safeError_(e)); }
}

/** Verify customer credentials and approved store status before creating a session. */
function sellerLogin(username, password) {
  try {
    var customer = authenticateCustomerCredentials_(username, password);
    var store = findRecordByExactColumn_('Stores', 'ownerCustomerId', customer.id);
    if (!store) throw new Error('บัญชีนี้ยังไม่มีร้านค้า กรุณาสมัครเปิดร้านก่อน');
    if (store.status !== 'Active') throw new Error(store.status === 'Pending' ? 'ร้านค้ากำลังรออนุมัติ ยังไม่สามารถเข้าสู่ Seller Center ได้' : 'ร้านค้าถูกระงับหรือยังไม่เปิดใช้งาน');
    var session = createSession_(customer, 'customer');
    return ok_({ token: session.token, expiresAt: session.expiresAt, customer: publicCustomer_(customer), store: publicStore_(store) }, 'เข้าสู่ระบบร้านค้าสำเร็จ');
  } catch (e) { return fail_(safeError_(e)); }
}

/** Restrict the system-owner portal to the Super Admin account only. */
function systemOwnerLogin(username, password) {
  try {
    var auth = loginPlatformUser_(username, password, 'Super Admin');
    if (!auth || !auth.success) return auth || fail_('เข้าสู่ระบบไม่สำเร็จ');
    return ok_(auth.data, 'เข้าสู่ระบบเจ้าของระบบสำเร็จ');
  } catch (e) { return fail_(safeError_(e)); }
}

function authorizeSocialLoginServices() {
  try {
    // Run once from the Apps Script editor as the deployment owner to grant UrlFetch permission.
    UrlFetchApp.fetch('https://oauth2.googleapis.com/tokeninfo?id_token=authorization-check', { muteHttpExceptions: true });
    return ok_({ authorized: true }, 'เปิดสิทธิ์การเชื่อมต่อบริการยืนยันตัวตนภายนอกแล้ว');
  } catch (e) { return fail_(safeError_(e)); }
}

function getCustomerAuthConfig() {
  try {
    var props = PropertiesService.getScriptProperties();
    var googleClientId = props.getProperty('GOOGLE_CLIENT_ID') || '';
    var facebookAppId = props.getProperty('FACEBOOK_APP_ID') || '';
    return ok_({
      googleEnabled: !!googleClientId,
      googleClientId: googleClientId,
      facebookEnabled: !!facebookAppId && !!props.getProperty('FACEBOOK_APP_SECRET'),
      facebookAppId: facebookAppId
    });
  } catch (e) { return fail_(safeError_(e)); }
}

function customerSocialLogin(provider, credential) {
  try {
    provider = String(provider || '').toLowerCase();
    credential = text_(credential, 10000);
    if (!credential) throw new Error('ไม่พบข้อมูลยืนยันตัวตนจากผู้ให้บริการ');
    var profile;
    if (provider === 'google') profile = verifyGoogleCustomerCredential_(credential);
    else if (provider === 'facebook') profile = verifyFacebookCustomerCredential_(credential);
    else throw new Error('ไม่รองรับผู้ให้บริการเข้าสู่ระบบนี้');
    var customer = socialLoginOrCreateCustomer_(provider, profile);
    var session = createSession_(customer, 'customer');
    return ok_({ token: session.token, expiresAt: session.expiresAt, customer: publicCustomer_(customer) }, 'เข้าสู่ระบบสำเร็จ');
  } catch (e) { return fail_(safeError_(e)); }
}

function verifyGoogleCustomerCredential_(idToken) {
  var props = PropertiesService.getScriptProperties();
  var clientId = props.getProperty('GOOGLE_CLIENT_ID') || '';
  if (!clientId) throw new Error('ยังไม่ได้ตั้งค่า Google Client ID ใน Script Properties');
  if (idToken.length < 100 || idToken.length > 8000) throw new Error('Google credential ไม่ถูกต้อง');
  var endpoint = 'https://oauth2.googleapis.com/tokeninfo?id_token=' + encodeURIComponent(idToken);
  var response = UrlFetchApp.fetch(endpoint, { muteHttpExceptions: true, followRedirects: true });
  if (response.getResponseCode() !== 200) throw new Error('ไม่สามารถยืนยันบัญชี Google ได้ กรุณาลองใหม่');
  var info = safeJson_(response.getContentText(), {});
  var issuer = String(info.iss || '');
  if (String(info.aud || '') !== clientId) throw new Error('Google token ไม่ได้ออกให้กับเว็บไซต์นี้');
  if (issuer !== 'accounts.google.com' && issuer !== 'https://accounts.google.com') throw new Error('Google token มีผู้ออกไม่ถูกต้อง');
  if (number_(info.exp, 0) <= Math.floor(Date.now() / 1000)) throw new Error('Google token หมดอายุแล้ว');
  if (!(info.email_verified === true || String(info.email_verified).toLowerCase() === 'true')) throw new Error('กรุณาใช้บัญชี Google ที่ยืนยันอีเมลแล้ว');
  if (!info.sub || !info.email) throw new Error('Google ไม่ส่งข้อมูลบัญชีที่จำเป็น');
  return {
    providerId: String(info.sub), email: String(info.email).toLowerCase(),
    firstname: text_(info.given_name || info.name || 'Google', 100),
    lastname: text_(info.family_name || '', 100),
    profileImage: text_(info.picture || '', 1000)
  };
}

function verifyFacebookCustomerCredential_(userAccessToken) {
  var props = PropertiesService.getScriptProperties();
  var appId = props.getProperty('FACEBOOK_APP_ID') || '';
  var appSecret = props.getProperty('FACEBOOK_APP_SECRET') || '';
  var version = props.getProperty('FACEBOOK_GRAPH_VERSION') || 'v27.0';
  if (!appId || !appSecret) throw new Error('ยังไม่ได้ตั้งค่า Facebook App ID และ App Secret ใน Script Properties');
  if (!/^v[0-9]+\.0$/.test(version)) version = 'v27.0';
  if (userAccessToken.length < 20 || userAccessToken.length > 5000) throw new Error('Facebook access token ไม่ถูกต้อง');
  var graphBase = 'https://graph.facebook.com/' + version;
  var appAccessToken = appId + '|' + appSecret;
  var debugUrl = graphBase + '/debug_token?input_token=' + encodeURIComponent(userAccessToken) + '&access_token=' + encodeURIComponent(appAccessToken);
  var debugResponse = UrlFetchApp.fetch(debugUrl, { muteHttpExceptions: true });
  if (debugResponse.getResponseCode() !== 200) throw new Error('ไม่สามารถตรวจสอบ Facebook token ได้');
  var debug = safeJson_(debugResponse.getContentText(), {});
  var tokenInfo = debug.data || {};
  if (!tokenInfo.is_valid || String(tokenInfo.app_id || '') !== String(appId)) throw new Error('Facebook token ไม่ถูกต้องหรือไม่ได้ออกให้กับ App นี้');
  if (tokenInfo.expires_at && number_(tokenInfo.expires_at, 0) > 0 && number_(tokenInfo.expires_at, 0) <= Math.floor(Date.now() / 1000)) throw new Error('Facebook session หมดอายุแล้ว');
  var meUrl = graphBase + '/me?fields=id,name,first_name,last_name,email,picture.type(large)&access_token=' + encodeURIComponent(userAccessToken);
  var meResponse = UrlFetchApp.fetch(meUrl, { muteHttpExceptions: true });
  if (meResponse.getResponseCode() !== 200) throw new Error('ไม่สามารถอ่านข้อมูลโปรไฟล์ Facebook ได้');
  var me = safeJson_(meResponse.getContentText(), {});
  if (!me.id || String(me.id) !== String(tokenInfo.user_id || '')) throw new Error('ข้อมูลบัญชี Facebook ไม่ตรงกับ token');
  var picture = me.picture && me.picture.data ? me.picture.data.url : '';
  return {
    providerId: String(me.id), email: String(me.email || '').toLowerCase(),
    firstname: text_(me.first_name || me.name || 'Facebook', 100),
    lastname: text_(me.last_name || '', 100),
    profileImage: text_(picture || '', 1000)
  };
}

function socialLoginOrCreateCustomer_(provider, profile) {
  return withLock_(function() {
  var customers = readTable_('Customers', false);
  var existing = customers.filter(function(c) {
    return String(c.authProvider || '').toLowerCase() === provider && String(c.providerId || '') === String(profile.providerId);
  })[0];
  if (existing) {
    if (existing.status !== 'Active') throw new Error('บัญชีลูกค้านี้ถูกระงับการใช้งาน');
    return existing;
  }
  var email = String(profile.email || '').toLowerCase();
  if (email && customers.some(function(c) { return String(c.email || '').toLowerCase() === email; })) {
    throw new Error('อีเมลนี้มีบัญชีอยู่แล้ว กรุณาเข้าสู่ระบบด้วยวิธีเดิมก่อน เพื่อป้องกันการเชื่อมบัญชีผิดคน');
  }
  var username = provider + '_' + String(profile.providerId).replace(/[^a-zA-Z0-9_]/g, '').substring(0, 70);
  if (customers.some(function(c) { return String(c.username).toLowerCase() === username.toLowerCase(); })) username += '_' + newId_('X').substring(2, 8);
  var customer = {
    id: newId_('CUS'), username: username, passwordHash: '',
    firstname: text_(profile.firstname || provider, 100), lastname: text_(profile.lastname || '', 100),
    phone: '', email: email, emailVerified: !!email, profileImage: text_(profile.profileImage || '', 1000),
    authProvider: provider, providerId: String(profile.providerId), status: 'Active', createdAt: now_(), updatedAt: now_()
  };
  appendRecord_('Customers', customer);
  return customer;
  });
}
function customerCreateQrLogin() {
  try {
    var retentionCutoff = Date.now() - 24 * 60 * 60 * 1000;
    deleteRows_('QrLoginChallenges', function(row) {
      var created = new Date(row.createdAt).getTime();
      return !isFinite(created) || created < retentionCutoff || row.status === 'Consumed';
    });
    var raw = (Utilities.getUuid() + Utilities.getUuid()).replace(/-/g, '').toLowerCase();
    var expiresAt = new Date(Date.now() + 2 * 60 * 1000).toISOString();
    var id = newId_('QRL');
    appendRecord_('QrLoginChallenges', {
      id: id, challengeHash: sha256_(raw), status: 'Pending', approvedCustomerId: '',
      expiresAt: expiresAt, createdAt: now_(), approvedAt: '', consumedAt: ''
    });
    var appUrl = getWebAppUrl_();
    var separator = appUrl.indexOf('?') >= 0 ? '&' : '?';
    return ok_({ challenge: raw, url: appUrl + separator + 'qr=' + encodeURIComponent(raw), expiresAt: expiresAt, expiresInSeconds: 120 });
  } catch (e) { return fail_(safeError_(e)); }
}

function customerApproveQrLogin(customerToken, challenge) {
  try {
    var customer = requireCustomer_(customerToken);
    challenge = text_(challenge, 200);
    if (!challenge) throw new Error('ไม่พบ QR Login Challenge');
    return withLock_(function() {
      var hash = sha256_(challenge);
      var row = readTable_('QrLoginChallenges', false).filter(function(x) { return x.challengeHash === hash; })[0];
      if (!row) throw new Error('QR Code ไม่ถูกต้องหรือหมดอายุ');
      if (new Date(row.expiresAt).getTime() <= Date.now()) {
        updateRecord_('QrLoginChallenges', row.id, { status: 'Expired' });
        throw new Error('QR Code หมดอายุแล้ว กรุณาสร้าง QR ใหม่บนคอมพิวเตอร์');
      }
      if (row.status !== 'Pending') throw new Error('QR Code นี้ถูกใช้งานหรืออนุมัติไปแล้ว');
      updateRecord_('QrLoginChallenges', row.id, { status: 'Approved', approvedCustomerId: customer.id, approvedAt: now_() });
      log_('QR Login Approved', 'Authentication', 'Customer approved a desktop QR login');
      return ok_({ approved: true }, 'อนุมัติการเข้าสู่ระบบบนคอมพิวเตอร์แล้ว');
    });
  } catch (e) { return fail_(safeError_(e)); }
}

function customerGetQrLoginStatus(challenge) {
  try {
    challenge = text_(challenge, 200);
    if (!challenge) throw new Error('ไม่พบ QR Login Challenge');
    return withLock_(function() {
      var hash = sha256_(challenge);
      var row = readTable_('QrLoginChallenges', false).filter(function(x) { return x.challengeHash === hash; })[0];
      if (!row) throw new Error('ไม่พบ QR Login หรือถูกล้างออกจากระบบ');
      if (new Date(row.expiresAt).getTime() <= Date.now() && row.status === 'Pending') {
        updateRecord_('QrLoginChallenges', row.id, { status: 'Expired' });
        return ok_({ status: 'expired' });
      }
      if (row.status === 'Pending') return ok_({ status: 'pending' });
      if (row.status === 'Expired' || row.status === 'Cancelled') return ok_({ status: 'expired' });
      if (row.status === 'Consumed') return ok_({ status: 'used' });
      if (row.status !== 'Approved') return ok_({ status: 'expired' });
      var customer = readTable_('Customers', false).filter(function(c) { return String(c.id) === String(row.approvedCustomerId) && c.status === 'Active'; })[0];
      if (!customer) throw new Error('บัญชีลูกค้าไม่สามารถเข้าสู่ระบบได้');
      var session = createSession_(customer, 'customer');
      updateRecord_('QrLoginChallenges', row.id, { status: 'Consumed', consumedAt: now_() });
      log_('QR Login Completed', 'Authentication', 'Customer desktop QR login');
      return ok_({ status: 'approved', token: session.token, expiresAt: session.expiresAt, customer: publicCustomer_(customer) }, 'เข้าสู่ระบบด้วย QR Code สำเร็จ');
    });
  } catch (e) { return fail_(safeError_(e)); }
}

function customerLogout(token) { return logout(token); }
function publicCustomer_(c) { return { id: c.id, username: c.username, firstname: c.firstname, lastname: c.lastname, phone: c.phone, email: c.email, emailVerified: parseBool_(c.emailVerified), gender: c.gender || '', birthDate: c.birthDate || '', profileImage: c.profileImage, authProvider: c.authProvider || 'password' }; }

/* -------------------------------- SETTINGS ------------------------------- */
function getSettings() {
  try {
    var cache = CacheService.getScriptCache(), raw = cache.get('public_settings');
    if (raw) return ok_(safeJson_(raw, {}));
    var all = {};
    readTable_('Settings', true).forEach(function(r) { all[r.key] = r.value; });
    var safe = {};
    Object.keys(DEFAULT_SETTINGS_).forEach(function(k) { safe[k] = all[k] === undefined ? DEFAULT_SETTINGS_[k] : all[k]; });
    // Backward compatibility: carry the former `favicon` value into the new canonical setting.
    if (!safe.setFaviconUrl && safe.favicon) safe.setFaviconUrl = safe.favicon;
    try { cache.put('public_settings', JSON.stringify(safe), CACHE_SECONDS_); } catch (e) {}
    return ok_(safe);
  } catch (e2) { return fail_(safeError_(e2)); }
}

function getAdminSettings(token) {
  try {
    requireAdmin_(token, 'settings.manage');
    var all = {};
    readTable_('Settings', false).forEach(function(r) { all[r.key] = r.value; });
    Object.keys(DEFAULT_SETTINGS_).forEach(function(k) { if (all[k] === undefined) all[k] = DEFAULT_SETTINGS_[k]; });
    if (!all.setFaviconUrl && all.favicon) all.setFaviconUrl = all.favicon;
    return ok_(all);
  } catch (e) { return fail_(safeError_(e)); }
}

function saveSettings(token, data) {
  try {
    var user = requireAdmin_(token, 'settings.manage');
    data = data || {};
    ['primaryColor','secondaryColor','accentColor'].forEach(function(k) { if (Object.prototype.hasOwnProperty.call(data,k) && data[k] && !/^#[0-9a-fA-F]{6}$/.test(String(data[k]))) throw new Error('รูปแบบสี '+k+' ไม่ถูกต้อง กรุณาใช้ Hex Color เช่น #EE4D2D'); });
    if (Object.prototype.hasOwnProperty.call(data, 'setFaviconUrl') && data.setFaviconUrl && !/^https:\/\//i.test(String(data.setFaviconUrl).trim())) throw new Error('URL ไอคอนเว็บไซต์ต้องขึ้นต้นด้วย https://');
    if (Object.prototype.hasOwnProperty.call(data,'mallStoreIds')) {
      var selectedMallStores=data.mallStoreIds;
      if(typeof selectedMallStores==='string')selectedMallStores=safeJson_(selectedMallStores,[]);
      if(!Array.isArray(selectedMallStores))throw new Error('รายการร้านค้าใน SHOPEE MALL ไม่ถูกต้อง');
      var activeStoreIds=Object.create(null);
      readTable_('Stores',true).forEach(function(store){if(store&&store.status==='Active')activeStoreIds[String(store.id)]=true;});
      var uniqueMallStores=[];
      selectedMallStores.forEach(function(id){var storeId=text_(id,100);if(!storeId)return;if(!activeStoreIds[storeId])throw new Error('พบร้านค้าที่ไม่มีอยู่หรือไม่ได้เปิดใช้งาน กรุณาเลือกใหม่');if(uniqueMallStores.indexOf(storeId)<0)uniqueMallStores.push(storeId);});
      upsertSetting_('mallStoreIds',JSON.stringify(uniqueMallStores));
    }
    var allowed = Object.keys(DEFAULT_SETTINGS_);
    var richSettingKeys={storeDescription:1,returnPolicy:1,privacyPolicy:1,terms:1,footerText:1};
    Object.keys(data).forEach(function(key) {
      if(key==='mallStoreIds')return;
      if (allowed.indexOf(key) >= 0 && key !== 'bankAccountNumber') upsertSetting_(key, richSettingKeys[key]?sanitizeHtml_(data[key]):text_(data[key], 5000));
      else if (key === 'bankAccountNumber') upsertSetting_(key, text_(data[key], 80));
    });
    clearRuntimeCaches_();
    log_('Update Settings', 'Settings', 'Updated ' + Object.keys(data).length + ' setting(s)', user.username);
    return ok_(true, 'บันทึกการตั้งค่าร้านค้าแล้ว');
  } catch (e) { return fail_(safeError_(e)); }
}

/* ----------------------------- PUBLIC CATALOG ---------------------------- */
function getCategories(options) {
  try {
    options = options || {};
    var includeInactive = false; if (options.includeInactive && options.token) { try { requireAdmin_(options.token, 'categories.view'); includeInactive = true; } catch (authError) {} }
    var rows = readTable_('Categories', true).filter(function(x) { return x.status === 'Active' || includeInactive; });
    rows.sort(function(a,b) { return number_(a.order, 0) - number_(b.order, 0); });
    return ok_(rows);
  } catch (e) { return fail_(safeError_(e)); }
}

function productPublicMetrics_(products) {
  var timezone=Session.getScriptTimeZone()||'Asia/Bangkok';
  var now=new Date();
  var currentDateKey=Utilities.formatDate(now,timezone,'yyyy-MM-dd');
  var currentMonthKey=currentDateKey.substring(0,7);
  var dayOfWeek=Math.max(1,number_(Utilities.formatDate(now,timezone,'u'),1));
  var weekStartKey=Utilities.formatDate(new Date(now.getTime()-(dayOfWeek-1)*86400000),timezone,'yyyy-MM-dd');
  var cacheKey='product_public_metrics_v2_'+currentMonthKey+'_'+weekStartKey,cache=CacheService.getScriptCache(),metricMap=null;
  try { var cached=cache.get(cacheKey); if(cached) metricMap=JSON.parse(cached); } catch(cacheReadError) { metricMap=null; }
  if(!metricMap||typeof metricMap!=='object') {
    metricMap={};
    var validOrders={},monthlyOrders={},weeklyOrders={},orders=readTable_('Orders',true);
    orders.forEach(function(o){
      var status=String(o.orderStatus||''),pay=String(o.paymentStatus||''),orderId=String(o.id||'');
      if(!orderId||status==='Cancelled'||status==='Refunded'||!(pay==='Verified'||status==='Completed'))return;
      validOrders[orderId]=true;
      var rawDate=o.createdAt||o.paidAt||'',dateKey='';
      if(rawDate){var parsedDate=new Date(rawDate);if(!isNaN(parsedDate.getTime()))dateKey=Utilities.formatDate(parsedDate,timezone,'yyyy-MM-dd');}
      if(dateKey&&dateKey.substring(0,7)===currentMonthKey)monthlyOrders[orderId]=true;
      if(dateKey&&dateKey>=weekStartKey&&dateKey<=currentDateKey)weeklyOrders[orderId]=true;
    });
    readTable_('OrderItems',true).forEach(function(item){
      var key=String(item.productId||''),orderId=String(item.orderId||''),quantity=Math.max(0,number_(item.quantity,0));
      if(!key||!validOrders[orderId])return;
      if(!metricMap[key])metricMap[key]={soldCount:0,monthlySoldCount:0,weeklySoldCount:0,ratingTotal:0,reviewCount:0};
      metricMap[key].soldCount+=quantity;
      if(monthlyOrders[orderId])metricMap[key].monthlySoldCount+=quantity;
      if(weeklyOrders[orderId])metricMap[key].weeklySoldCount+=quantity;
    });
    readTable_('Reviews',true).forEach(function(review){
      var key=String(review.productId||''),status=String(review.status||'Approved');
      if(!key||['Approved','Active','Published'].indexOf(status)<0)return;
      var rating=number_(review.rating,0);if(rating<=0||rating>5)return;
      if(!metricMap[key])metricMap[key]={soldCount:0,monthlySoldCount:0,weeklySoldCount:0,ratingTotal:0,reviewCount:0};
      metricMap[key].ratingTotal+=rating;metricMap[key].reviewCount++;
    });
    try { var serialized=JSON.stringify(metricMap); if(serialized.length<95000)cache.put(cacheKey,serialized,30); } catch(cacheWriteError) {}
  }
  safeArray_(products).forEach(function(p){
    var m=metricMap[String(p.id)]||{soldCount:0,monthlySoldCount:0,weeklySoldCount:0,ratingTotal:0,reviewCount:0};
    p.soldCount=number_(m.soldCount,0);
    p.monthlySoldCount=number_(m.monthlySoldCount,0);
    p.weeklySoldCount=number_(m.weeklySoldCount,0);
    p.reviewCount=number_(m.reviewCount,0);
    p.ratingAverage=p.reviewCount?Math.round((number_(m.ratingTotal,0)/p.reviewCount)*10)/10:0;
  });
  return metricMap;
}
function quantityPromoForProduct_(product,unitPrice,quantity) {
  var enabled=parseBool_(product&&product.quantityPromoEnabled),minimum=Math.max(2,Math.floor(number_(product&&product.quantityPromoQty,0))),perSet=Math.max(0,number_(product&&product.quantityPromoDiscount,0));
  if(!enabled||minimum<2||perSet<=0)return {enabled:false,minimum:0,discountPerSet:0,sets:0,discount:0,label:''};
  var qty=Math.max(0,Math.floor(number_(quantity,0))),sets=Math.floor(qty/minimum),discount=Math.min(Math.max(0,unitPrice*qty),sets*perSet);
  return {enabled:true,minimum:minimum,discountPerSet:perSet,sets:sets,discount:Math.round(discount*100)/100,label:'ซื้อ '+minimum+' ชิ้น ลด '+moneyForBackend_(perSet)+' / ชุด'};
}
function moneyForBackend_(value) { return '฿'+number_(value,0).toLocaleString('en-US',{maximumFractionDigits:2}); }

function productSearchRelevance_(product,query){
  var q=String(query||'').trim().toLowerCase();
  var name=String(product&&product.name||'').toLowerCase();
  var brand=String(product&&product.brand||'').toLowerCase();
  var sku=String(product&&product.sku||'').toLowerCase();
  var barcode=String(product&&product.barcode||'').toLowerCase();
  var score=0;
  if(q){
    if(name===q)score+=10000;
    else if(name.indexOf(q)===0)score+=8000;
    else if(name.indexOf(q)>=0)score+=6000;
    if(brand===q)score+=4500;
    else if(brand.indexOf(q)===0)score+=3500;
    else if(brand.indexOf(q)>=0)score+=2500;
    if(sku===q)score+=5000;else if(sku.indexOf(q)>=0)score+=3000;
    if(barcode===q)score+=5000;else if(barcode.indexOf(q)>=0)score+=3000;
    var tags=String(product&&product.tags||'').toLowerCase();
    if(tags.indexOf(q)>=0)score+=1500;
  }else{
    if(parseBool_(product&&product.featured))score+=120;
    if(parseBool_(product&&product.bestSeller))score+=80;
  }
  var sold=Math.max(0,number_(product&&product.soldCount,0));
  score+=Math.min(40,Math.log(sold+1)*5);
  return score;
}

function getProducts(options) {
  try {
    ensureTableColumns_('Products',['quantityPromoEnabled','quantityPromoQty','quantityPromoDiscount','mallBadgeEnabled','mallBadgeText','featuredLabel','videoUrl','campaignLabel','campaignImage','promoTag','originProvince','freeShippingMinimum','sizeChart']);
    options = options || {};
    var isAdmin = false;
    if (options.token) { try { requireAdmin_(options.token, 'products.view'); isAdmin = true; } catch (e) {} }
    var searchQuery = text_(options.search, 120).toLowerCase();
    var inventoryForFilter = readTable_('Inventory', true);
    var allProductsForFilter = readTable_('Products', true);
    productPublicMetrics_(allProductsForFilter);
    var categoriesForFilter = readTable_('Categories', true);
    // Build related-data indexes once per request instead of re-reading and filtering
    // entire Sheets for every product in the catalog.
    var variantsForFilter = readTable_('ProductVariants', true);
    var storesForFilter = readTable_('Stores', true);
    var baseInventoryByProduct = Object.create(null);
    var variantInventoryById = Object.create(null);
    var variantsByProduct = Object.create(null);
    var categoryById = Object.create(null);
    var activeStoreById = Object.create(null);
    inventoryForFilter.forEach(function(item) {
      if (item.variantId) variantInventoryById[String(item.variantId)] = item;
      else baseInventoryByProduct[String(item.productId)] = item;
    });
    variantsForFilter.forEach(function(variant) {
      if (variant.status !== 'Active') return;
      var key = String(variant.productId || '');
      if (!variantsByProduct[key]) variantsByProduct[key] = [];
      variantsByProduct[key].push(variant);
    });
    categoriesForFilter.forEach(function(category) { categoryById[String(category.id)] = category; });
    storesForFilter.forEach(function(store) {
      if (store.status === 'Active') activeStoreById[String(store.id)] = true;
    });
    var selectedCategoryIds = safeArray_(options.categoryIds).map(function(v){return String(v);});
    var selectedCategoryNames = safeArray_(options.categoryNames).map(function(v){return String(v).trim().toLowerCase();});
    var selectedBrands = safeArray_(options.brands).map(function(v){return String(v).trim().toLowerCase();});
    var selectedOrigins = safeArray_(options.origins).map(function(v){return String(v).trim();});
    var selectedSellerTypes = safeArray_(options.sellerTypes).map(function(v){return String(v);});
    var selectedStoreIds = safeArray_(options.storeIds).map(function(v){return String(v);}).filter(Boolean);
    var selectedPromotions = safeArray_(options.promotions).map(function(v){return String(v);});
    var minimumRating = Math.max(0, Math.min(5, number_(options.minRating, 0)));
    var rows = allProductsForFilter.filter(function(p) {
      var productKey = String(p.id || '');
      var invForProduct = baseInventoryByProduct[productKey];
      var childVariants = variantsByProduct[productKey] || [];
      var computedStock = childVariants.length ? childVariants.reduce(function(sum, variant) {
        var vi = variantInventoryById[String(variant.id)];
        return sum + (vi ? Math.max(0, number_(vi.quantity, 0) - number_(vi.reserved, 0)) : number_(variant.stock, 0));
      }, 0) : (invForProduct ? Math.max(0, number_(invForProduct.quantity, 0) - number_(invForProduct.reserved, 0)) : number_(p.stock, 0));
      if (!isAdmin && p.status !== 'Active') return false;
      if (!isAdmin && p.sellerId && !activeStoreById[String(p.sellerId)]) return false;
      if (options.categoryId && String(p.categoryId) !== String(options.categoryId)) return false;
      if (selectedCategoryIds.length && selectedCategoryIds.indexOf(String(p.categoryId || '')) < 0) return false;
      if (selectedCategoryNames.length) {
        var productCategory = categoryById[String(p.categoryId)] || {};
        if (selectedCategoryNames.indexOf(String(productCategory.name || '').trim().toLowerCase()) < 0) return false;
      }
      if (selectedBrands.length && selectedBrands.indexOf(String(p.brand || '').trim().toLowerCase()) < 0) return false;
      if (minimumRating > 0 && number_(p.ratingAverage, 0) < minimumRating) return false;
      if (selectedOrigins.length) {
        var originText = String(p.originProvince || '').trim();
        var originIsForeign = /ต่างประเทศ|นำเข้า|import|china|จีน|ญี่ปุ่น|เกาหลี|usa|อเมริกา/i.test(originText);
        var southNames = /กระบี่|ชุมพร|ตรัง|นครศรีธรรมราช|นราธิวาส|ปัตตานี|พังงา|พัทลุง|ภูเก็ต|ยะลา|ระนอง|สงขลา|สตูล|สุราษฎร์ธานี/;
        var metroNames = /กรุงเทพ|กทม|นนทบุรี|ปทุมธานี|สมุทรปราการ|สมุทรสาคร|นครปฐม/;
        var originMatch = selectedOrigins.some(function(v){
          if (v === 'ต่างประเทศ') return originIsForeign;
          if (v === 'ภายในประเทศ') return !!originText && !originIsForeign;
          if (v === 'ภาคใต้') return southNames.test(originText);
          if (v === 'กรุงเทพและปริมณฑล') return metroNames.test(originText);
          return originText.toLowerCase() === v.toLowerCase();
        });
        if (!originMatch) return false;
      }
      if (selectedSellerTypes.length) {
        var productTags = String(p.tags || '').toLowerCase();
        var sellerTypeMatch = selectedSellerTypes.some(function(v){
          if (v === 'mall') return parseBool_(p.mallBadgeEnabled);
          if (v === 'recommended') return parseBool_(p.featured);
          if (v === 'fulfilled') return /fulfilled by shopee|fulfilled_by_shopee|fbs/i.test(productTags);
          return false;
        });
        if (!sellerTypeMatch) return false;
      }
      if (selectedPromotions.length) {
        var currentPrice = number_(p.salePrice, 0) > 0 ? number_(p.salePrice, 0) : number_(p.price, 0);
        var originalPrice = number_(p.price, 0);
        var promoTagText = String(p.promoTag || '').toLowerCase();
        var promotionMatch = selectedPromotions.some(function(v){
          if (v === 'free_shipping') return number_(p.freeShippingMinimum, 0) > 0 || /ส่งฟรี|free.?shipping/.test(promoTagText);
          if (v === 'spaylater') return /spaylater|ผ่อน 0%/.test(promoTagText);
          if (v === 'discount') return currentPrice > 0 && originalPrice > currentPrice;
          if (v === 'wholesale') return parseBool_(p.quantityPromoEnabled);
          return false;
        });
        if (!promotionMatch) return false;
      }
      if (options.storeId && String(p.sellerId || '') !== String(options.storeId)) return false;
      if (selectedStoreIds.length && selectedStoreIds.indexOf(String(p.sellerId || '')) < 0) return false;
      if (options.featured && !parseBool_(p.featured)) return false;
      if (options.bestSeller && !parseBool_(p.bestSeller)) return false;
      if (options.available && computedStock <= 0) return false;
      var q = searchQuery;
      if (q && [p.name,p.sku,p.barcode,p.brand,p.tags].join(' ').toLowerCase().indexOf(q) < 0) return false;
      var price = number_(p.salePrice, 0) > 0 ? number_(p.salePrice, 0) : number_(p.price, 0);
      if (options.minPrice !== undefined && options.minPrice !== '' && price < number_(options.minPrice, 0)) return false;
      if (options.maxPrice !== undefined && options.maxPrice !== '' && price > number_(options.maxPrice, 0)) return false;
      return true;
    });
    var sort = options.sort || (searchQuery?'relevance':'newest');
    rows.sort(function(a,b) {
      if (sort === 'price_asc') return effectivePrice_(a) - effectivePrice_(b);
      if (sort === 'price_desc') return effectivePrice_(b) - effectivePrice_(a);
      if (sort === 'name') return String(a.name).localeCompare(String(b.name));
      if (sort === 'best_seller') return (number_(b.soldCount,0)-number_(a.soldCount,0)) || (Number(parseBool_(b.bestSeller))-Number(parseBool_(a.bestSeller))) || (new Date(b.createdAt).getTime()-new Date(a.createdAt).getTime());
      if (sort === 'relevance') return (productSearchRelevance_(b,searchQuery)-productSearchRelevance_(a,searchQuery)) || (new Date(b.createdAt).getTime()-new Date(a.createdAt).getTime());
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    var total = rows.length, page = Math.max(1, number_(options.page, 1)), pageSize = Math.min(100, Math.max(1, number_(options.pageSize, 24)));
    var inventoryRows = readTable_('Inventory', true);
    rows = rows.slice((page - 1) * pageSize, page * pageSize).map(function(p) { return productWithStock_(p, inventoryRows, isAdmin); });
    return ok_({ items: rows, total: total, page: page, pageSize: pageSize, pages: Math.ceil(total / pageSize) });
  } catch (e) { return fail_(safeError_(e)); }
}

function effectivePrice_(p) { return number_(p.salePrice, 0) > 0 ? number_(p.salePrice, 0) : number_(p.price, 0); }
function productWithStock_(p, inventoryRows, isAdmin) {
  var out = isAdmin ? JSON.parse(JSON.stringify(p)) : publicProduct_(p);
  var inv = safeArray_(inventoryRows).filter(function(x) { return x.productId === p.id && !x.variantId; })[0];
  var child=readTable_('ProductVariants',true).filter(function(v){return v.productId===p.id&&v.status==='Active';});
  out.hasVariants=child.length>0;
  if(child.length)out.stock=child.reduce(function(sum,v){var vi=safeArray_(inventoryRows).filter(function(z){return z.productId===p.id&&z.variantId===v.id;})[0];return sum+(vi?Math.max(0,number_(vi.quantity,0)-number_(vi.reserved,0)):number_(v.stock,0));},0);
  else if (inv) out.stock = Math.max(0, number_(inv.quantity, 0) - number_(inv.reserved, 0)); 
  if (p.sellerId) { var store = readTable_('Stores',true).filter(function(x){return x.id===p.sellerId && x.status==='Active';})[0]; if (store) { out.storeName=store.shopName; out.storeId=store.id; out.storeLogo=store.logo||''; out.storeAddress=store.address||''; } }
  var deal = activeFlashDealForProduct_(p.id); if (deal) { out.salePrice=number_(deal.dealPrice,0); out.flashDealId=deal.id; out.flashDealEnd=deal.endAt; }
  return out;
}
function publicProduct_(p) {
  var out = {};
  Object.keys(p).forEach(function(k) { if (k !== 'costPrice') out[k] = p[k]; });
  out.images = safeArray_(safeJson_(p.images, []));
  out.featured = parseBool_(p.featured); out.bestSeller = parseBool_(p.bestSeller);
  out.quantityPromoEnabled = parseBool_(p.quantityPromoEnabled); out.mallBadgeEnabled = parseBool_(p.mallBadgeEnabled); out.sizeChart = String(p.sizeChart || '');
  return out;
}

function getProductById(id, options) {
  try {
    ensureTableColumns_('Products',['quantityPromoEnabled','quantityPromoQty','quantityPromoDiscount','mallBadgeEnabled','mallBadgeText','featuredLabel','videoUrl','campaignLabel','campaignImage','promoTag','originProvince','freeShippingMinimum','sizeChart']);
    options = options || {};
    var isAdmin = false;
    if (options.token) { try { requireAdmin_(options.token, 'products.view'); isAdmin = true; } catch (authError) {} }
    var product = readTable_('Products', true).filter(function(p) { return String(p.id) === String(id); })[0];
    if (!product || (product.status !== 'Active' && !isAdmin)) throw new Error('ไม่พบสินค้า');
    if(!isAdmin&&product.sellerId&&!readTable_('Stores',true).some(function(st){return st.id===product.sellerId&&st.status==='Active';})) throw new Error('ไม่พบสินค้า');
    var variants = readTable_('ProductVariants', true).filter(function(v) { return String(v.productId) === String(id) && (v.status === 'Active' || isAdmin); });
    var inventoryRows = readTable_('Inventory', true);
    var productOut=productWithStock_(product, inventoryRows, isAdmin);productPublicMetrics_([productOut]);
    return ok_({ product: productOut, variants: variants.map(function(v) { var out = isAdmin ? v : publicVariant_(v); var inv = inventoryRows.filter(function(x) { return x.productId === product.id && x.variantId === v.id; })[0]; if (inv) out.stock = Math.max(0, number_(inv.quantity, 0) - number_(inv.reserved, 0)); return out; }) });
  } catch (e) { return fail_(safeError_(e)); }
}
function publicVariant_(v) { return { id:v.id, productId:v.productId, sku:v.sku, variantName:v.variantName, attributes:safeJson_(v.attributes,{}), price:v.price, salePrice:v.salePrice, stock:v.stock, status:v.status }; }

function ensureProductReportsSheet_(){
  var ss=getSpreadsheet_(),name='ProductReports',headers=SCHEMA_.ProductReports,sh=ss.getSheetByName(name);
  if(!sh){sh=ss.insertSheet(name);sh.getRange(1,1,1,headers.length).setValues([headers]);sh.setFrozenRows(1);return sh;}
  var last=Math.max(1,sh.getLastColumn()),existing=sh.getRange(1,1,1,last).getValues()[0].map(String),missing=headers.filter(function(h){return existing.indexOf(h)<0;});
  if(missing.length){sh.getRange(1,last+1,1,missing.length).setValues([missing]);sh.setFrozenRows(1);}return sh;
}
function reportProduct(customerToken,productId,reason,detail){
  try{
    var customer=requireCustomer_(customerToken),id=text_(productId,100),why=text_(reason,60),allowed=['misleading','counterfeit','prohibited','copyright','other'];
    if(allowed.indexOf(why)<0)throw new Error('กรุณาเลือกเหตุผลการรายงานที่ถูกต้อง');
    var product=readTable_('Products',false).filter(function(p){return p.id===id&&p.status==='Active';})[0];if(!product)throw new Error('ไม่พบสินค้าที่ต้องการรายงาน');
    ensureProductReportsSheet_();var recent=readTable_('ProductReports',false).filter(function(r){return r.customerId===customer.id&&r.productId===id&&new Date(r.createdAt).getTime()>Date.now()-24*60*60*1000;});
    if(recent.length)throw new Error('คุณได้รายงานสินค้านี้ไปแล้ว กรุณารอการตรวจสอบ');
    var row={id:newId_('RPT'),productId:id,customerId:customer.id,reason:why,detail:text_(detail,1000),status:'Pending',createdAt:now_()};appendRecord_('ProductReports',row);log_('Report Product','Products',product.name+' / '+why,customer.username);return ok_({id:row.id,status:row.status},'ส่งรายงานสินค้าแล้ว');
  }catch(e){return fail_(safeError_(e));}
}

function getProductVariants(productId, options) {
  try { options = options || {}; var isAdmin = false; if (options.token) { try { requireAdmin_(options.token, 'products.view'); isAdmin = true; } catch (authError) {} } var rows = readTable_('ProductVariants', true).filter(function(v) { return String(v.productId) === String(productId) && (v.status === 'Active' || isAdmin); }); return ok_(rows.map(function(v) { return isAdmin ? v : publicVariant_(v); })); }
  catch (e) { return fail_(safeError_(e)); }
}

/* --------------------------- PRODUCT / CATEGORY CRUD --------------------- */
function saveProduct(token, data) {
  try {
    ensureTableColumns_('Products',['quantityPromoEnabled','quantityPromoQty','quantityPromoDiscount','mallBadgeEnabled','mallBadgeText','featuredLabel','videoUrl','campaignLabel','campaignImage','promoTag','originProvince','freeShippingMinimum','sizeChart']);
    var user = requireAdmin_(token, 'products.manage');
    data = data || {};
    var now = now_(), id = text_(data.id, 100) || newId_('PRD');
    var old = readTable_('Products', false).filter(function(p) { return p.id === id; })[0];
    var categoryId = text_(data.categoryId,100);
    if (categoryId && !readTable_('Categories', false).some(function(c) { return String(c.id) === categoryId; })) throw new Error('ไม่พบหมวดหมู่สินค้าที่เลือก กรุณาเลือกหมวดหมู่จากรายการ');
    var sku = text_(data.sku,80) || ('SKU-' + Utilities.getUuid().replace(/-/g,'').substring(0,10).toUpperCase());
    var product = {
      id:id, sku:sku, barcode:text_(data.barcode,80), name:text_(data.name,200), slug:text_(data.slug || slug_(data.name),220),
      categoryId:text_(data.categoryId,100), brand:text_(data.brand,120), summary:text_(data.summary,500), description:sanitizeHtml_(data.description || ''),
      coverImage:text_(data.coverImage,1000), images:JSON.stringify(data.images === undefined ? safeArray_(safeJson_(old ? old.images : '[]', [])) : safeArray_(data.images)), price:Math.max(0,number_(data.price,0)), salePrice:Math.max(0,number_(data.salePrice,0)),
      costPrice:Math.max(0,number_(data.costPrice,0)), stock:Math.max(0,number_(data.stock,0)), unit:text_(data.unit || 'ชิ้น',30), weight:Math.max(0,number_(data.weight,0)),
      featured:parseBool_(data.featured), featuredLabel:text_(data.featuredLabel===undefined?(old&&old.featuredLabel!==undefined?old.featuredLabel:'ร้านแนะนำ'):data.featuredLabel,40), bestSeller:parseBool_(data.bestSeller), sellerId:text_(data.sellerId || (old ? old.sellerId : ''),100), tags:JSON.stringify(safeArray_(data.tags || safeJson_(old ? old.tags : '[]',[]))), status:text_(data.status || 'Active',30), quantityPromoEnabled:parseBool_(data.quantityPromoEnabled), quantityPromoQty:parseBool_(data.quantityPromoEnabled)?Math.max(2,Math.floor(number_(data.quantityPromoQty,2))):0, quantityPromoDiscount:parseBool_(data.quantityPromoEnabled)?Math.max(0,number_(data.quantityPromoDiscount,0)):0, mallBadgeEnabled:data.mallBadgeEnabled===undefined?(old?parseBool_(old.mallBadgeEnabled):false):parseBool_(data.mallBadgeEnabled), mallBadgeText:text_(data.mallBadgeText===undefined?(old?old.mallBadgeText:'Mall'):data.mallBadgeText,24)||'Mall', videoUrl:text_(data.videoUrl===undefined?(old?old.videoUrl:''):data.videoUrl,1000), campaignLabel:text_(data.campaignLabel===undefined?(old?old.campaignLabel:''):data.campaignLabel,60), campaignImage:text_(data.campaignImage===undefined?(old?old.campaignImage:''):data.campaignImage,1000), promoTag:text_(data.promoTag===undefined?(old?old.promoTag:''):data.promoTag,120), originProvince:text_(data.originProvince===undefined?(old?old.originProvince:''):data.originProvince,100), freeShippingMinimum:Math.max(0,number_(data.freeShippingMinimum===undefined?(old?old.freeShippingMinimum:0):data.freeShippingMinimum,0)), sizeChart:text_(data.sizeChart===undefined?(old?old.sizeChart:''):data.sizeChart,8000), createdAt:old ? old.createdAt : now, updatedAt:now
    };
    product.videoUrl=validateProductVideoReference_(product.videoUrl,'');

    if (!product.name || !product.sku) throw new Error('กรุณาระบุชื่อสินค้าและ SKU');
    if(product.quantityPromoEnabled&&(product.quantityPromoQty<2||product.quantityPromoDiscount<=0||product.quantityPromoDiscount>=(number_(product.salePrice,0)>0?number_(product.salePrice,0):product.price)*product.quantityPromoQty))throw new Error('โปรโมชั่นจำนวนชิ้นต้องกำหนดจำนวนอย่างน้อย 2 ชิ้น และส่วนลดต้องมากกว่า 0 แต่ต่ำกว่ามูลค่าสินค้าในชุด');
    var duplicate = readTable_('Products', false).some(function(p) { return p.id !== id && String(p.sku).toLowerCase() === product.sku.toLowerCase(); }) || readTable_('ProductVariants',false).some(function(v) { return String(v.sku).toLowerCase() === product.sku.toLowerCase(); });
    if (duplicate) throw new Error('SKU นี้มีอยู่แล้วในสินค้า/ตัวเลือกสินค้า');
    upsertById_('Products', product);
    ensureInventory_(id, '', product.stock, 0);
    clearRuntimeCaches_(); log_(old ? 'Update Product' : 'Create Product', 'Products', product.name, user.username);
    return ok_(product, old ? 'แก้ไขสินค้าแล้ว' : 'เพิ่มสินค้าแล้ว');
  } catch (e) { return fail_(safeError_(e)); }
}

function deleteProduct(token, id) {
  try {
    var user = requireAdmin_(token, 'products.manage');
    var referenced = readTable_('OrderItems', false).some(function(x) { return String(x.productId) === String(id); }) || readTable_('InventoryMovements',false).some(function(x){return String(x.productId)===String(id);});
    if (referenced) {
      updateRecord_('Products', id, { status:'Archived', updatedAt:now_() });
      readTable_('ProductVariants',false).filter(function(v){return String(v.productId)===String(id);}).forEach(function(v){updateRecord_('ProductVariants',v.id,{status:'Archived',updatedAt:now_()});});
      log_('Archive Product', 'Products', id + ' (order / inventory history preserved)', user.username);
      return ok_(true, 'สินค้ามีประวัติคำสั่งซื้อหรือการเคลื่อนไหวสต็อก จึงเก็บสินค้าและตัวเลือกไว้ในคลังเพื่อรักษาประวัติย้อนหลัง');
    }
    deleteRows_('ProductVariants', function(x) { return String(x.productId) === String(id); });
    deleteRows_('Inventory', function(x) { return String(x.productId) === String(id); });
    deleteRows_('Products', function(x) { return String(x.id) === String(id); });
    log_('Delete Product', 'Products', id, user.username);
    return ok_(true, 'ลบสินค้าและตัวเลือกที่ยังไม่มีประวัติคำสั่งซื้อแล้ว');
  } catch (e) { return fail_(safeError_(e)); }
}

function saveCategory(token, data) {
  try {
    var user = requireAdmin_(token, 'categories.manage'); data = data || {};
    var now = now_(), id = text_(data.id,100) || newId_('CAT');
    var old = readTable_('Categories', false).filter(function(x) { return x.id === id; })[0];
    var row = { id:id, name:text_(data.name,160), slug:text_(data.slug || slug_(data.name),180), description:sanitizeHtml_(data.description||''), image:text_(data.image,1000), parentId:text_(data.parentId,100), order:number_(data.order,0), status:text_(data.status || 'Active',30), createdAt:old ? old.createdAt : now, updatedAt:now };
    if (!row.name) throw new Error('กรุณาระบุชื่อหมวดหมู่');
    if (row.parentId === id) throw new Error('หมวดหมู่ไม่สามารถเป็นหมวดหมู่หลักของตัวเองได้');
    if (row.parentId) {
      var parentCategory = readTable_('Categories', false).filter(function(c) { return String(c.id) === row.parentId; })[0];
      if (!parentCategory) throw new Error('ไม่พบหมวดหมู่หลักที่เลือก');
      var cursor = parentCategory, visited = {};
      while (cursor && cursor.parentId) { if (String(cursor.parentId) === id) throw new Error('ไม่สามารถกำหนดหมวดหมู่ย่อยให้เป็นบรรพบุรุษของตัวเองได้'); if (visited[cursor.parentId]) break; visited[cursor.parentId] = true; cursor = readTable_('Categories', false).filter(function(c) { return String(c.id) === String(cursor.parentId); })[0]; }
    }
    upsertById_('Categories', row); clearRuntimeCaches_(); log_(old ? 'Update Category' : 'Create Category','Categories',row.name,user.username);
    return ok_(row, 'บันทึกหมวดหมู่แล้ว');
  } catch (e) { return fail_(safeError_(e)); }
}
function deleteCategory(token, id) {
  try {
    var user = requireAdmin_(token,'categories.manage');
    var used = readTable_('Products',false).some(function(p) { return String(p.categoryId) === String(id); });
    var children = readTable_('Categories',false).some(function(c) { return String(c.parentId) === String(id); });
    if (used || children) throw new Error('หมวดหมู่นี้มีสินค้า/หมวดหมู่ย่อยอ้างอิงอยู่ กรุณาย้ายข้อมูลก่อนลบ');
    deleteRows_('Categories',function(x) { return String(x.id) === String(id); });
    log_('Delete Category','Categories',id,user.username); return ok_(true,'ลบหมวดหมู่แล้ว');
  } catch (e) { return fail_(safeError_(e)); }
}

function saveProductVariant(token, data) {
  try {
    var user = requireAdmin_(token,'products.manage'); data = data || {};
    var now = now_(), id = text_(data.id,100) || newId_('VAR');
    if (!data.productId) throw new Error('กรุณาเลือกสินค้า');
    var product = readTable_('Products',false).filter(function(p) { return p.id === data.productId; })[0];
    if (!product) throw new Error('ไม่พบสินค้าแม่');
    var old = readTable_('ProductVariants',false).filter(function(x) { return x.id === id; })[0];
    var variantSku = text_(data.sku,80) || ('VAR-' + Utilities.getUuid().replace(/-/g,'').substring(0,10).toUpperCase());
    var row = { id:id, productId:text_(data.productId,100), sku:variantSku, variantName:text_(data.variantName,160), attributes:JSON.stringify(data.attributes || {}), price:Math.max(0,number_(data.price,0)), salePrice:Math.max(0,number_(data.salePrice,0)), stock:Math.max(0,number_(data.stock,0)), status:text_(data.status || 'Active',30), createdAt:old ? old.createdAt : now, updatedAt:now };
    if (!row.variantName) throw new Error('กรุณาระบุชื่อของตัวเลือก');
    var duplicateVariantSku = readTable_('ProductVariants',false).some(function(v) { return String(v.id)!==String(id) && String(v.sku).toLowerCase()===row.sku.toLowerCase(); }) || readTable_('Products',false).some(function(p) { return String(p.sku).toLowerCase()===row.sku.toLowerCase(); });
    if (duplicateVariantSku) throw new Error('SKU นี้มีอยู่แล้วในสินค้า/ตัวเลือกสินค้า');
    upsertById_('ProductVariants',row); ensureInventory_(row.productId,id,row.stock,0); log_('Save Variant','Products',row.variantName,user.username); return ok_(row,'บันทึกตัวเลือกสินค้าแล้ว');
  } catch (e) { return fail_(safeError_(e)); }
}
function deleteProductVariant(token,id) {
  try { var user=requireAdmin_(token,'products.manage'); var used=readTable_('OrderItems',false).some(function(x){return x.variantId===id;}); if(used) throw new Error('ตัวเลือกนี้ถูกใช้ในคำสั่งซื้อแล้ว'); deleteRows_('ProductVariants',function(x){return x.id===id;}); deleteRows_('Inventory',function(x){return x.variantId===id;}); log_('Delete Variant','Products',id,user.username); return ok_(true,'ลบตัวเลือกแล้ว'); }
  catch(e){return fail_(safeError_(e));}
}
function sanitizeHtml_(html) {
  // Rich-text whitelist sanitizer: keep only safe formatting tags and a tiny CSS allowlist.
  var value=String(html||'').replace(/<!--[\s\S]*?-->/g,'');
  value=value.replace(/<\s*(script|style|iframe|object|embed|form|svg|math|video|audio|button|input|textarea|select)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi,'');
  value=value.replace(/<\s*(script|style|iframe|object|embed|form|svg|math|video|audio|button|input|textarea|select)\b[^>]*>/gi,'');
  var allowed={p:1,br:1,hr:1,b:1,strong:1,i:1,em:1,u:1,s:1,strike:1,del:1,sub:1,sup:1,code:1,pre:1,ul:1,ol:1,li:1,h1:1,h2:1,h3:1,h4:1,h5:1,h6:1,blockquote:1,a:1,img:1,span:1,div:1,font:1};
  function safeColor_(v){v=String(v||'').trim();return /^(#[0-9a-f]{3,8}|rgba?\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}(\s*,\s*(0|1|0?\.\d+))?\s*\)|[a-z]{3,20})$/i.test(v)?v:'';}
  value=value.replace(/<\/?([a-z0-9]+)\b([^>]*)>/gi,function(match,rawTag,attrs){
    var tag=String(rawTag).toLowerCase(),closing=/^<\s*\//.test(match);
    if(!allowed[tag])return '';
    if(tag==='font'){
      if(closing)return '</span>';
      var fontColorMatch=attrs.match(/color\s*=\s*(["'])(.*?)\1/i),fontStyleMatch=attrs.match(/style\s*=\s*(["'])(.*?)\1/i),fontColor=fontColorMatch?safeColor_(fontColorMatch[2]):'';
      if(!fontColor&&fontStyleMatch){var legacyColor=fontStyleMatch[2].match(/(?:^|;)\s*color\s*:\s*([^;]+)(?:;|$)/i);fontColor=legacyColor?safeColor_(legacyColor[1]):'';}
      return fontColor?'<span style="color:'+fontColor+'">':'<span>';
    }
    if(closing)return (tag==='br'||tag==='hr'||tag==='img')?'':'</'+tag+'>';
    if(tag==='a'){
      var hrefMatch=attrs.match(/href\s*=\s*(["'])(.*?)\1/i),href=hrefMatch?hrefMatch[2].trim():'';
      if(!/^(https?:\/\/|mailto:|tel:|\/|#)/i.test(href))return '';
      return '<a href="'+href.replace(/["<>]/g,'')+'" target="_blank" rel="noopener noreferrer">';
    }
    if(tag==='img'){
      var srcMatch=attrs.match(/src\s*=\s*(["'])(.*?)\1/i),altMatch=attrs.match(/alt\s*=\s*(["'])(.*?)\1/i);
      var src=srcMatch?srcMatch[2].trim():'',alt=altMatch?altMatch[2].replace(/[<>"']/g,''):'';
      if(!/^(https?:\/\/|\/)/i.test(src))return '';
      return '<img src="'+src.replace(/["<>]/g,'')+'" alt="'+alt+'" loading="lazy">';
    }
    var styleMatch=attrs.match(/style\s*=\s*(["'])(.*?)\1/i),style=styleMatch?styleMatch[2]:'';
    var alignMatch=style.match(/(?:^|;)\s*text-align\s*:\s*(left|center|right|justify)\s*(?:;|$)/i);
    var colorMatch=style.match(/(?:^|;)\s*color\s*:\s*([^;]+)\s*(?:;|$)/i);
    var bgMatch=style.match(/(?:^|;)\s*background-color\s*:\s*([^;]+)\s*(?:;|$)/i);
    var safeStyles=[];
    if(alignMatch&&['p','div','h1','h2','h3','h4','h5','h6','blockquote'].indexOf(tag)>=0)safeStyles.push('text-align:'+alignMatch[1].toLowerCase());
    var safeTextColor=colorMatch?safeColor_(colorMatch[1]):'',safeBgColor=bgMatch?safeColor_(bgMatch[1]):'';
    if(safeTextColor)safeStyles.push('color:'+safeTextColor);if(safeBgColor)safeStyles.push('background-color:'+safeBgColor);
    return '<'+tag+(safeStyles.length?' style="'+safeStyles.join(';')+'"':'')+'>';
  });
  return value.substring(0,20000);
}
function slug_(value) { return text_(value,200).toLowerCase().replace(/[^a-z0-9ก-๙]+/g,'-').replace(/^-|-$/g,''); }

/* ---------------------------------- CART --------------------------------- */
function cartRow_(sessionId, customerId) {
  var rows = readTable_('Carts',false);
  var bySession = rows.filter(function(c) { return String(c.sessionId) === String(sessionId); })[0];
  if (bySession) return bySession;
  return customerId ? (rows.filter(function(c) { return String(c.customerId) === String(customerId); })[0] || null) : null;
}
function saveCart_(sessionId, customerId, items) {
  var old = cartRow_(sessionId, customerId);
  var row = { id:old ? old.id : newId_('CRT'), customerId:customerId || (old ? old.customerId : ''), sessionId:sessionId, items:JSON.stringify(items), updatedAt:now_() };
  upsertById_('Carts',row); return row;
}
function cartDetails_(items) {
  ensureTableColumns_('Products',['quantityPromoEnabled','quantityPromoQty','quantityPromoDiscount','mallBadgeEnabled','mallBadgeText','featuredLabel','videoUrl','campaignLabel','campaignImage','promoTag','originProvince','freeShippingMinimum','sizeChart']);
  var products = readTable_('Products',true), variants = readTable_('ProductVariants',true), result = [], subtotal = 0, grossSubtotal = 0, quantityPromoDiscountTotal = 0;
  safeArray_(items).forEach(function(item) {
    var p = products.filter(function(x) { return x.id === item.productId && x.status === 'Active'; })[0];
    if (!p) return;
    if(p.sellerId&&!readTable_('Stores',true).some(function(st){return st.id===p.sellerId&&st.status==='Active';})) return;
    var activeVariants=variants.filter(function(x){return x.productId===p.id&&x.status==='Active';});
    var v = item.variantId ? activeVariants.filter(function(x) { return x.id === item.variantId; })[0] : null;
    if ((item.variantId && !v) || (activeVariants.length && !item.variantId)) return;
    var deal = !v ? activeFlashDealForProduct_(p.id) : null;
    var price = deal ? number_(deal.dealPrice,0) : (v ? effectivePrice_(v) : effectivePrice_(p));
    var stock = v ? availableStock_(p.id,v.id) : availableStock_(p.id,'');
    var qty = Math.max(1,Math.floor(number_(item.quantity,1)));
    var grossLine = price * qty, promo=quantityPromoForProduct_(p,price,qty), line=Math.max(0,Math.round((grossLine-promo.discount)*100)/100); grossSubtotal += grossLine; quantityPromoDiscountTotal += promo.discount; subtotal += line;
    var store = p.sellerId ? readTable_('Stores',true).filter(function(x){return x.id===p.sellerId;})[0] : null;
    result.push({ productId:p.id,variantId:v ? v.id : '',name:p.name,sku:v ? v.sku : p.sku,image:v && v.image ? v.image : p.coverImage,variantName:v ? v.variantName : '',unitPrice:price,quantity:qty,stock:stock,subtotal:line,grossSubtotal:grossLine,quantityPromoEnabled:promo.enabled,quantityPromoQty:promo.minimum,quantityPromoSets:promo.sets,quantityPromoDiscount:promo.discount,quantityPromoText:promo.label,sellerId:p.sellerId||'PLATFORM',storeName:store?store.shopName:'ร้านค้าหลัก',flashDealId:deal?deal.id:'' });
  });
  return { items:result, subtotal:subtotal, grossSubtotal:grossSubtotal, quantityPromoDiscount:Math.round(quantityPromoDiscountTotal*100)/100, count:result.reduce(function(sum,x){return sum+x.quantity;},0) };
}
function getCart(sessionId, customerToken) {
  try {
    var customer = customerToken ? requireCustomer_(customerToken) : null;
    var sid = text_(sessionId,120); if (!sid) throw new Error('ไม่พบรหัสตะกร้า');
    var row = cartRow_(sid,customer ? customer.id : '');
    var items = row ? safeArray_(safeJson_(row.items,[])) : [];
    return ok_(cartDetails_(items));
  } catch(e) { return fail_(safeError_(e)); }
}
function addToCart(sessionId, productId, variantId, quantity, customerToken) {
  try {
    var customer = customerToken ? requireCustomer_(customerToken) : null;
    var p = readTable_('Products',false).filter(function(x){return x.id===productId && x.status==='Active';})[0];
    if(!p) throw new Error('ไม่พบสินค้าหรือสินค้าปิดขาย');
    if(p.sellerId&&!readTable_('Stores',false).some(function(st){return st.id===p.sellerId&&st.status==='Active';})) throw new Error('ร้านค้านี้ยังไม่เปิดให้สั่งซื้อ');
    var activeVariants=readTable_('ProductVariants',false).filter(function(x){return x.productId===productId&&x.status==='Active';});
    var v = variantId ? activeVariants.filter(function(x){return x.id===variantId;})[0] : null;
    if(variantId && !v) throw new Error('ไม่พบตัวเลือกสินค้า');
    if(activeVariants.length&&!variantId) throw new Error('กรุณาเลือกตัวเลือกสินค้าก่อนเพิ่มลงตะกร้า');
    var qty = Math.max(1,Math.floor(number_(quantity,1)));
    var stock = availableStock_(productId,variantId || ''); if(stock < qty) throw new Error('สินค้าในสต็อกไม่เพียงพอ');
    var sid = text_(sessionId,120); if(!sid) throw new Error('ไม่พบ Session ตะกร้า');
    var row = cartRow_(sid,customer ? customer.id : ''); var items = row ? safeArray_(safeJson_(row.items,[])) : [];
    var found = items.filter(function(x){return x.productId===productId && String(x.variantId||'')===String(variantId||'');})[0];
    if(found) found.quantity = Math.min(stock,number_(found.quantity,0)+qty); else items.push({productId:productId,variantId:variantId || '',quantity:qty});
    saveCart_(sid,customer ? customer.id : '',items); return ok_(cartDetails_(items),'เพิ่มสินค้าลงตะกร้าแล้ว');
  } catch(e) { return fail_(safeError_(e)); }
}
function updateCartItem(sessionId, productId, variantId, quantity, customerToken) {
  try {
    var customer = customerToken ? requireCustomer_(customerToken) : null; var sid=text_(sessionId,120);
    var row=cartRow_(sid,customer ? customer.id : ''); if(!row) throw new Error('ไม่พบตะกร้า');
    var items=safeArray_(safeJson_(row.items,[])); var qty=Math.floor(number_(quantity,1));
    items=items.filter(function(x){return !(x.productId===productId && String(x.variantId||'')===String(variantId||''));});
    if(qty>0){var stock=availableStock_(productId,variantId||'');if(qty>stock)throw new Error('จำนวนสินค้าเกินสต็อก');items.push({productId:productId,variantId:variantId||'',quantity:qty});}
    saveCart_(sid,customer ? customer.id : '',items); return ok_(cartDetails_(items));
  } catch(e){return fail_(safeError_(e));}
}
function removeCartItem(sessionId,productId,variantId,customerToken){return updateCartItem(sessionId,productId,variantId,0,customerToken);}
function clearCart(sessionId,customerToken){try{var c=customerToken?requireCustomer_(customerToken):null;var sid=text_(sessionId,120);var row=cartRow_(sid,c?c.id:'');if(row)updateRecord_('Carts',row.id,{items:'[]',updatedAt:now_()});return ok_(true,'ล้างตะกร้าแล้ว');}catch(e){return fail_(safeError_(e));}}
function mergeGuestCart(sessionId,customerToken){
  try{return withLock_(function(){
    var customer=requireCustomer_(customerToken),sid=text_(sessionId,120);if(!sid)throw new Error('ไม่พบ Session ตะกร้า');
    var carts=readTable_('Carts',false),guest=carts.filter(function(x){return String(x.sessionId)===sid;})[0]||null;
    var member=carts.filter(function(x){return String(x.customerId)===String(customer.id);})[0]||null;
    var merged=[],index={};
    function addRows(rows){safeArray_(rows).forEach(function(item){var key=String(item.productId)+'|'+String(item.variantId||''),qty=Math.max(1,Math.floor(number_(item.quantity,1)));if(index[key])index[key].quantity+=qty;else{var copy={productId:item.productId,variantId:item.variantId||'',quantity:qty};index[key]=copy;merged.push(copy);}});}
    if(member&&(!guest||member.id!==guest.id))addRows(safeJson_(member.items,[]));
    if(guest)addRows(safeJson_(guest.items,[]));
    merged=merged.map(function(item){item.quantity=Math.min(item.quantity,availableStock_(item.productId,item.variantId));return item;}).filter(function(item){return item.quantity>0;});
    if(guest)saveCart_(sid,customer.id,merged);
    else if(member)updateRecord_('Carts',member.id,{sessionId:sid,items:JSON.stringify(merged),updatedAt:now_()});
    if(member&&guest&&member.id!==guest.id)deleteRows_('Carts',function(x){return x.id===member.id;});
    return ok_(cartDetails_(merged),'รวมตะกร้าสินค้าแล้ว');
  });}catch(e){return fail_(safeError_(e));}
}

/* ------------------------------- CHECKOUT -------------------------------- */
function validateCheckout(data) {
  try {
    data=data||{}; var c=data.customerToken?requireCustomer_(data.customerToken):null;
    var row=cartRow_(text_(data.sessionId,120),c?c.id:''); var items=row?safeArray_(safeJson_(row.items,[])):[];
    var details=cartDetails_(items); if(!details.items.length) throw new Error('ไม่มีสินค้าในตะกร้า');
    details.items.forEach(function(x){if(x.quantity>x.stock)throw new Error('สินค้า '+x.name+' มีจำนวนไม่เพียงพอ');});
    var coupon=calculateCoupon_(data.couponCode,details.subtotal,c?c.id:'',details.items);
    var shipping=shippingFee_(data.shippingMethod,details.subtotal,details.items);
    var taxRate=number_(getSettingValue_('taxRate'),0); var tax=Math.round((details.subtotal-coupon.discount)*taxRate)/100;
    return ok_({items:details.items,subtotal:details.subtotal,grossSubtotal:details.grossSubtotal,quantityPromoDiscount:details.quantityPromoDiscount,discount:coupon.discount,shippingFee:shipping,tax:tax,grandTotal:Math.max(0,details.subtotal-coupon.discount+shipping+tax),coupon:coupon.code,couponId:coupon.couponId||''});
  } catch(e){return fail_(safeError_(e));}
}
function calculateOrderTotal(data) { return validateCheckout(data); }
function calculateCoupon_(code,subtotal,customerId,items) {
  var clean=text_(code,60).toUpperCase(); if(!clean) return {code:'',discount:0};
  var coupon=readTable_('Coupons',false).filter(function(x){return String(x.code).toUpperCase()===clean && x.status==='Active';})[0];
  if(!coupon) throw new Error('ไม่พบคูปองหรือคูปองถูกปิดใช้งาน');
  var now=Date.now(); if(coupon.startDate && new Date(coupon.startDate).getTime()>now) throw new Error('คูปองยังไม่เริ่มใช้งาน');
  if(coupon.endDate && new Date(coupon.endDate).getTime()<now) throw new Error('คูปองหมดอายุแล้ว');
  var eligibleSubtotal=subtotal; if(coupon.sellerId){var eligibleItems=safeArray_(items);if(!eligibleItems.length)throw new Error('กรุณาตรวจสอบคูปองร้านค้าจากรายการสินค้าในตะกร้า');eligibleSubtotal=eligibleItems.filter(function(i){return String(i.sellerId||'')===String(coupon.sellerId);}).reduce(function(sum,i){return sum+number_(i.subtotal,0);},0);if(eligibleSubtotal<=0)throw new Error('คูปองนี้ใช้ได้เฉพาะสินค้าของร้านที่กำหนด');}
  if(number_(coupon.minimumOrder,0)>eligibleSubtotal) throw new Error('ยอดซื้อสินค้าของร้านไม่ถึงขั้นต่ำของคูปอง');
  if(number_(coupon.usageLimit,0)>0 && number_(coupon.usedCount,0)>=number_(coupon.usageLimit,0)) throw new Error('คูปองถูกใช้ครบจำนวนแล้ว');
  if(customerId && number_(coupon.usagePerCustomer,0)>0) {
    var used=readTable_('Orders',false).filter(function(o){return o.customerId===customerId && String(o.note||'').indexOf('[COUPON:'+clean+']')>=0 && o.orderStatus!=='Cancelled';}).length;
    if(used>=number_(coupon.usagePerCustomer,0)) throw new Error('คุณใช้คูปองนี้ครบจำนวนแล้ว');
  }
  var discount=coupon.discountType==='percent'?eligibleSubtotal*number_(coupon.discountValue,0)/100:number_(coupon.discountValue,0);
  if(number_(coupon.maximumDiscount,0)>0) discount=Math.min(discount,number_(coupon.maximumDiscount,0));
  return {code:clean,discount:Math.max(0,Math.min(eligibleSubtotal,Math.round(discount*100)/100)),couponId:coupon.id};
}
function shippingFee_(methodId,subtotal,items) {
  var methods=readTable_('ShippingMethods',false).filter(function(x){return x.status==='Active';});
  var method=methodId?methods.filter(function(x){return x.id===methodId;})[0]:null;
  if(methodId && !method) throw new Error('ไม่พบวิธีจัดส่ง');
  if(method) return number_(method.freeMinimum,0)>0 && subtotal>=number_(method.freeMinimum,0)?0:number_(method.fee,0);
  var free=number_(getSettingValue_('freeShippingMinimum'),0); if(free>0 && subtotal>=free) return 0;
  return number_(getSettingValue_('defaultShippingFee'),0);
}

function createOrder(data) {
  try {
    ensureTableColumns_('Products',['quantityPromoEnabled','quantityPromoQty','quantityPromoDiscount','mallBadgeEnabled','mallBadgeText','featuredLabel','videoUrl','campaignLabel','campaignImage','promoTag','originProvince','freeShippingMinimum','sizeChart']);
    ensureTableColumns_('Orders',['grossSubtotal','quantityPromoDiscount']);
    ensureTableColumns_('OrderItems',['quantityPromoDiscount']);
    data=data||{};
    return withLock_(function(){
      var customer=data.customerToken?requireCustomer_(data.customerToken):null;
      var enabledMethods=safeArray_(safeJson_(getSettingValue_('paymentMethods'),['bank_transfer','qr_payment','cod']));
      var requestedMethod=text_(data.paymentMethod || 'bank_transfer',40); if(enabledMethods.indexOf(requestedMethod)<0)throw new Error('วิธีชำระเงินนี้ยังไม่เปิดใช้งาน');
      var sid=text_(data.sessionId,120); if(!sid) throw new Error('ไม่พบตะกร้าสินค้า');
      if(!customer && String(getSettingValue_('allowGuestCheckout'))==='false') throw new Error('ร้านค้านี้กำหนดให้เข้าสู่ระบบก่อนสั่งซื้อ');
      var idem=text_(data.idempotencyKey,120);
      if(idem){var duplicate=readTable_('Orders',false).filter(function(o){return o.idempotencyKey===idem;})[0];if(duplicate){var existingOrder=JSON.parse(JSON.stringify(duplicate));delete existingOrder.guestAccessToken;delete existingOrder.idempotencyKey;return ok_({order:existingOrder,alreadyCreated:true},'คำสั่งซื้อนี้ถูกสร้างแล้ว');}}
      var cart=cartRow_(sid,customer?customer.id:''); if(!cart) throw new Error('ไม่พบตะกร้าสินค้า');
      var rawItems=safeArray_(safeJson_(cart.items,[])); var details=cartDetails_(rawItems); if(!details.items.length)throw new Error('ไม่มีสินค้าในตะกร้า');
      details.items.forEach(function(item){if(item.quantity>availableStock_(item.productId,item.variantId))throw new Error('สินค้า '+item.name+' มีสต็อกไม่เพียงพอ');});
      var quote=validateCheckout({sessionId:sid,customerToken:data.customerToken,couponCode:data.couponCode,shippingMethod:data.shippingMethod});
      if(!quote.success)throw new Error(quote.message);
      var q=quote.data; var address=data.shippingAddress||{};
      if(!text_(address.recipient || data.customerName,120) || !text_(address.phone || data.phone,40) || !text_(address.address,300)) throw new Error('กรุณากรอกชื่อผู้รับ เบอร์โทร และที่อยู่จัดส่ง');
      // Validate seller accounts and Flash Deal quotas before writing any order rows.
      var sellerIds={},dealDemand={};
      q.items.forEach(function(item){
        var sidSeller=item.sellerId||'PLATFORM'; sellerIds[sidSeller]=true;
        if(item.flashDealId) dealDemand[item.flashDealId]=(dealDemand[item.flashDealId]||0)+number_(item.quantity,0);
      });
      Object.keys(sellerIds).forEach(function(sidSeller){
        if(sidSeller!=='PLATFORM'&&!readTable_('Stores',false).some(function(st){return st.id===sidSeller&&st.status==='Active';})) throw new Error('ร้านค้าของสินค้ารายการหนึ่งไม่พร้อมรับคำสั่งซื้อ');
      });
      Object.keys(dealDemand).forEach(function(dealId){
        var deal=readTable_('FlashDeals',false).filter(function(d){return d.id===dealId&&d.status==='Active';})[0];
        if(!deal) throw new Error('Flash Deal หมดเวลาหรือปิดใช้งานแล้ว กรุณาตรวจสอบตะกร้า');
        var nowTs=Date.now();
        if((deal.startAt&&new Date(deal.startAt).getTime()>nowTs)||(deal.endAt&&new Date(deal.endAt).getTime()<nowTs)) throw new Error('Flash Deal หมดเวลาหรือยังไม่เริ่ม กรุณาตรวจสอบตะกร้า');
        if(number_(deal.quota,0)>0&&number_(deal.soldCount,0)+dealDemand[dealId]>number_(deal.quota,0)) throw new Error('สินค้า Flash Deal มีจำนวนสิทธิ์ไม่เพียงพอ');
      });
      var now=now_(),orderId=newId_('ORD'), guestAccessToken=customer?'':text_(data.guestAccessToken,120), orderNo='ORD-'+Utilities.formatDate(new Date(),Session.getScriptTimeZone(),'yyyyMMdd-HHmmss')+'-'+Math.floor(Math.random()*900+100);
      if(!customer&&guestAccessToken.length<32)throw new Error('ไม่พบรหัสยืนยันสำหรับคำสั่งซื้อ Guest กรุณาลองส่งคำสั่งซื้ออีกครั้ง');
      var customerName=text_(data.customerName || address.recipient || (customer?customer.firstname+' '+customer.lastname:''),180);
      var phone=text_(data.phone || address.phone || (customer?customer.phone:''),40), email=text_(data.email || (customer?customer.email:''),160);
      var order={id:orderId,orderNumber:orderNo,customerId:customer?customer.id:'',customerName:customerName,phone:phone,email:email,shippingAddress:JSON.stringify(address),subtotal:q.subtotal,discount:q.discount,grossSubtotal:number_(q.grossSubtotal,q.subtotal+number_(q.quantityPromoDiscount,0)),quantityPromoDiscount:number_(q.quantityPromoDiscount,0),shippingFee:q.shippingFee,tax:q.tax,grandTotal:q.grandTotal,paymentMethod:text_(data.paymentMethod || 'bank_transfer',40),paymentStatus:'Unpaid',orderStatus:'Awaiting Payment',shippingStatus:'Pending',trackingNumber:'',note:text_(data.note,1000)+(q.coupon?' [COUPON:'+q.coupon+']':''),idempotencyKey:idem,guestAccessToken:guestAccessToken,createdAt:now,updatedAt:now,paidAt:'',completedAt:''};
      appendRecord_('Orders',order);
      var sellerGroups={},sellerOrderBySeller={};
      q.items.forEach(function(item){var sidSeller=item.sellerId||'PLATFORM';if(!sellerGroups[sidSeller])sellerGroups[sidSeller]={id:newId_('SORD'),sellerId:sidSeller,items:[],subtotal:0,discountAmount:0};sellerGroups[sidSeller].items.push(item);sellerGroups[sidSeller].subtotal+=number_(item.subtotal,0);});
      var groupKeys=Object.keys(sellerGroups),allocatedShipping=0,allocatedDiscount=0;
      var usedCoupon=q.couponId?readTable_('Coupons',false).filter(function(c){return c.id===q.couponId;})[0]:null;
      groupKeys.forEach(function(sellerId,index){
        var group=sellerGroups[sellerId],store=sellerId==='PLATFORM'?null:readTable_('Stores',false).filter(function(st){return st.id===sellerId&&st.status==='Active';})[0];
        if(sellerId!=='PLATFORM'&&!store)throw new Error('ร้านค้าของสินค้ารายการหนึ่งไม่พร้อมรับคำสั่งซื้อ');
        if(usedCoupon&&usedCoupon.sellerId){group.discountAmount=sellerId===usedCoupon.sellerId?number_(q.discount,0):0;}
        else {group.discountAmount=index===groupKeys.length-1?Math.max(0,number_(q.discount,0)-allocatedDiscount):Math.round(number_(q.discount,0)*group.subtotal/Math.max(1,q.subtotal)*100)/100;allocatedDiscount+=group.discountAmount;}
        var rate=store&&store.commissionRate!==''?number_(store.commissionRate,number_(getSettingValue_('marketplaceCommissionRate'),5)):number_(getSettingValue_('marketplaceCommissionRate'),5);
        var commission=Math.round(Math.max(0,group.subtotal-group.discountAmount)*rate)/100;
        var ship=index===groupKeys.length-1?Math.max(0,q.shippingFee-allocatedShipping):Math.round(q.shippingFee*group.subtotal/Math.max(1,q.subtotal)*100)/100;allocatedShipping+=ship;
        var sellerOrder={id:group.id,parentOrderId:orderId,orderNumber:orderNo+'-'+(index+1),sellerId:sellerId,subtotal:group.subtotal,discountAmount:group.discountAmount,commissionRate:rate,commissionAmount:commission,netAmount:Math.max(0,group.subtotal-group.discountAmount-commission),shippingFee:ship,shippingAddress:JSON.stringify(address),status:order.paymentMethod==='cod'?'Processing':'Awaiting Payment',carrier:'',trackingNumber:'',shippedAt:'',deliveredAt:'',createdAt:now,updatedAt:now};
        appendRecord_('SellerOrders',sellerOrder);sellerOrderBySeller[sellerId]=group.id;
        group.items.forEach(function(item){
          appendRecord_('OrderItems',{id:newId_('ITEM'),orderId:orderId,productId:item.productId,variantId:item.variantId,productName:item.name,sku:item.sku,image:item.image,unitPrice:item.unitPrice,quantity:item.quantity,subtotal:item.subtotal,quantityPromoDiscount:number_(item.quantityPromoDiscount,0),sellerId:sellerId,sellerOrderId:group.id});
          if(item.flashDealId){var deal=readTable_('FlashDeals',false).filter(function(d){return d.id===item.flashDealId;})[0];if(deal)updateRecord_('FlashDeals',deal.id,{soldCount:number_(deal.soldCount,0)+item.quantity,updatedAt:now_()});}
          reserveStock_(item.productId,item.variantId,item.quantity,orderId,customer?customer.username:'Guest');
        });
      });
      appendRecord_('Payments',{id:newId_('PAY'),orderId:orderId,paymentMethod:order.paymentMethod,amount:order.grandTotal,reference:'',proofFileId:'',proofUrl:'',paymentDate:'',status:'Unpaid',verifiedBy:'',verifiedAt:'',note:'',createdAt:now});
      appendRecord_('Shipping',{id:newId_('SHP'),orderId:orderId,carrier:'',method:text_(data.shippingMethod,100),trackingNumber:'',shippingFee:q.shippingFee,status:'Pending',shippedAt:'',deliveredAt:'',createdAt:now});
      if(q.coupon){var coupon=readTable_('Coupons',false).filter(function(c){return String(c.code).toUpperCase()===q.coupon;})[0];if(coupon){updateRecord_('Coupons',coupon.id,{usedCount:number_(coupon.usedCount,0)+1});if(customer){var collected=readTable_('CollectedVouchers',false).filter(function(v){return v.customerId===customer.id&&v.couponId===coupon.id&&!v.usedAt;})[0];if(collected)updateRecord_('CollectedVouchers',collected.id,{usedAt:now_()});}}}
      updateRecord_('Carts',cart.id,{items:'[]',updatedAt:now});
      log_('Create Order','Orders',orderNo,customer?customer.username:'Guest');
      clearRuntimeCaches_(); var publicOrder=JSON.parse(JSON.stringify(order));delete publicOrder.guestAccessToken;delete publicOrder.idempotencyKey;return ok_({order:publicOrder,items:q.items},'สร้างคำสั่งซื้อสำเร็จ');
    });
  } catch(e){return fail_(safeError_(e));}
}

/* ------------------------------- INVENTORY ------------------------------- */
function ensureInventory_(productId,variantId,quantity,minimum) {
  var rows=readTable_('Inventory',false); var item=rows.filter(function(x){return x.productId===productId && String(x.variantId||'')===String(variantId||'');})[0];
  if(!item) appendRecord_('Inventory',{id:newId_('INV'),productId:productId,variantId:variantId||'',quantity:Math.max(0,number_(quantity,0)),reserved:0,minimumStock:number_(minimum,0),updatedAt:now_()});
}
function inventoryRow_(productId,variantId) { return readTable_('Inventory',false).filter(function(x){return x.productId===productId && String(x.variantId||'')===String(variantId||'');})[0] || null; }
function availableStock_(productId,variantId) { var r=inventoryRow_(productId,variantId); if(!r){var p=readTable_('Products',true).filter(function(x){return x.id===productId;})[0];return p?number_(p.stock,0):0;} return Math.max(0,number_(r.quantity,0)-number_(r.reserved,0)); }
function reserveStock_(productId,variantId,qty,orderId,by) {
  var row=inventoryRow_(productId,variantId); if(!row){var base=variantId?readTable_('ProductVariants',false).filter(function(v){return v.id===variantId&&v.productId===productId;})[0]:readTable_('Products',false).filter(function(p){return p.id===productId;})[0];ensureInventory_(productId,variantId,base?number_(base.stock,0):0,0);row=inventoryRow_(productId,variantId);}
  if(availableStock_(productId,variantId)<qty) throw new Error('สต็อกสินค้าเปลี่ยนแปลง กรุณาลองใหม่');
  updateRecord_('Inventory',row.id,{reserved:number_(row.reserved,0)+qty,updatedAt:now_()});
  appendRecord_('InventoryMovements',{id:newId_('MOV'),productId:productId,variantId:variantId||'',type:'Reservation',quantity:qty,referenceId:orderId,reason:'Reserve stock for order',createdBy:by,createdAt:now_()});
}
function settleOrderStock_(orderId,returnStock) {
  var items=readTable_('OrderItems',false),movements=readTable_('InventoryMovements',false);
  var order=readTable_('Orders',false).filter(function(o){return o.id===orderId;})[0]||{};
  items=items.filter(function(x){return x.orderId===orderId;});
  items.forEach(function(item){
    var row=inventoryRow_(item.productId,item.variantId);if(!row)return;
    var qty=number_(item.quantity,0),quantity=number_(row.quantity,0),reserved=number_(row.reserved,0);
    var same=movements.filter(function(m){return m.referenceId===orderId&&m.productId===item.productId&&String(m.variantId||'')===String(item.variantId||'');});
    var wasReserved=same.some(function(m){return m.type==='Reservation';});
    var wasSold=same.some(function(m){return m.type==='Sale';});
    var wasReturned=same.some(function(m){return m.type==='Return'||m.type==='Cancellation';});
    if(returnStock){
      if(wasReturned)return;
      if(wasSold || order.paymentStatus==='Verified'){
        updateRecord_('Inventory',row.id,{quantity:quantity+qty,updatedAt:now_()});
        appendRecord_('InventoryMovements',{id:newId_('MOV'),productId:item.productId,variantId:item.variantId||'',type:'Return',quantity:qty,referenceId:orderId,reason:'Return stock for paid order',createdBy:'System',createdAt:now_()});
      } else if(wasReserved){
        updateRecord_('Inventory',row.id,{reserved:Math.max(0,reserved-qty),updatedAt:now_()});
        appendRecord_('InventoryMovements',{id:newId_('MOV'),productId:item.productId,variantId:item.variantId||'',type:'Cancellation',quantity:qty,referenceId:orderId,reason:'Release reserved stock for cancelled order',createdBy:'System',createdAt:now_()});
      }
    } else {
      if(wasSold) return;
      if(wasReturned) throw new Error('ไม่สามารถตัดสต็อกซ้ำหลังคืนหรือยกเลิกสต็อกแล้ว');
      if(quantity<qty)throw new Error('สต็อกไม่เพียงพอสำหรับยืนยันคำสั่งซื้อ');
      updateRecord_('Inventory',row.id,{quantity:quantity-qty,reserved:wasReserved?Math.max(0,reserved-qty):reserved,updatedAt:now_()});
      appendRecord_('InventoryMovements',{id:newId_('MOV'),productId:item.productId,variantId:item.variantId||'',type:'Sale',quantity:qty,referenceId:orderId,reason:'Order payment confirmed',createdBy:'System',createdAt:now_()});
    }
  });
}
function getInventory(token) {
  try { requireAdmin_(token,'inventory.view'); var rows=readTable_('Inventory',false),products=readTable_('Products',false),variants=readTable_('ProductVariants',false); rows=rows.map(function(r){var p=products.filter(function(x){return x.id===r.productId;})[0]||{};var v=variants.filter(function(x){return x.id===r.variantId;})[0]||{};r.productName=p.name||'';r.sku=v.sku||p.sku||'';r.available=Math.max(0,number_(r.quantity,0)-number_(r.reserved,0));return r;}); return ok_(rows); }
  catch(e){return fail_(safeError_(e));}
}
function updateStock(token,data){return adjustStock(token,data);}
function adjustStock(token,data){
  try{return withLock_(function(){var user=requireAdmin_(token,'inventory.manage');data=data||{};var productId=text_(data.productId,100),variantId=text_(data.variantId,100),delta=number_(data.quantity,0);if(!productId||!delta)throw new Error('กรุณาระบุสินค้าและจำนวนที่ปรับ');var product=readTable_('Products',false).filter(function(p){return String(p.id)===productId;})[0];if(!product)throw new Error('ไม่พบสินค้าในระบบ');var productVariants=readTable_('ProductVariants',false).filter(function(v){return String(v.productId)===productId&&v.status==='Active';});if(variantId){var chosenVariant=productVariants.filter(function(v){return String(v.id)===variantId;})[0];if(!chosenVariant)throw new Error('ตัวเลือกสินค้าที่เลือกไม่สัมพันธ์กับสินค้านี้');}else if(productVariants.length){throw new Error('สินค้านี้แยกสต็อกตาม Variant กรุณาเลือกตัวเลือกสินค้าก่อนปรับสต็อก');}var row=inventoryRow_(productId,variantId);if(!row){var base=variantId?productVariants.filter(function(v){return String(v.id)===variantId;})[0]:product;ensureInventory_(productId,variantId,base?number_(base.stock,0):0,0);row=inventoryRow_(productId,variantId);}var next=number_(row.quantity,0)+delta;if(next<number_(row.reserved,0))throw new Error('จำนวนใหม่ต่ำกว่าสต็อกที่จองไว้');updateRecord_('Inventory',row.id,{quantity:next,updatedAt:now_()});appendRecord_('InventoryMovements',{id:newId_('MOV'),productId:productId,variantId:variantId,type:'Adjustment',quantity:delta,referenceId:text_(data.referenceId,100),reason:text_(data.reason,500),createdBy:user.username,createdAt:now_()});log_('Adjust Stock','Inventory',productId+' '+(variantId?'Variant '+variantId+' ':' ')+delta,user.username);return ok_(true,'ปรับสต็อกแล้ว');});}catch(e){return fail_(safeError_(e));}
}
function getStockMovements(token,filters){try{requireAdmin_(token,'inventory.view');var rows=readTable_('InventoryMovements',false);filters=filters||{};if(filters.productId)rows=rows.filter(function(x){return x.productId===filters.productId;});rows.sort(function(a,b){return new Date(b.createdAt)-new Date(a.createdAt);});return ok_(rows.slice(0,500));}catch(e){return fail_(safeError_(e));}}

/* ---------------------------------- ORDERS ------------------------------- */
function getOrders(token,filters){
  try{requireAdmin_(token,'orders.view');filters=filters||{};var rows=readTable_('Orders',false);if(filters.status)rows=rows.filter(function(x){return x.orderStatus===filters.status;});if(filters.search){var q=text_(filters.search,100).toLowerCase();rows=rows.filter(function(x){return [x.orderNumber,x.customerName,x.phone,x.email].join(' ').toLowerCase().indexOf(q)>=0;});}rows.sort(function(a,b){return new Date(b.createdAt)-new Date(a.createdAt);});return ok_(rows.slice(0,500));}catch(e){return fail_(safeError_(e));}
}
function getOrderById(token,id){
  try{var user=requireAdmin_(token,'orders.view');var order=readTable_('Orders',false).filter(function(x){return x.id===id||x.orderNumber===id;})[0];if(!order)throw new Error('ไม่พบคำสั่งซื้อ');var items=readTable_('OrderItems',false).filter(function(x){return x.orderId===order.id;});var payment=readTable_('Payments',false).filter(function(x){return x.orderId===order.id;});var shipping=readTable_('Shipping',false).filter(function(x){return x.orderId===order.id;});return ok_({order:order,items:items,payments:payment,shipping:shipping});}catch(e){return fail_(safeError_(e));}
}
function getCustomerOrders(customerToken){
  try{var c=requireCustomer_(customerToken);var allItems=readTable_('OrderItems',false),allSubs=readTable_('SellerOrders',false),stores=readTable_('Stores',false);var rows=readTable_('Orders',false).filter(function(x){return x.customerId===c.id;});rows.sort(function(a,b){return new Date(b.createdAt)-new Date(a.createdAt);});return ok_(rows.map(function(o){o.items=allItems.filter(function(i){return i.orderId===o.id;});o.sellerOrders=allSubs.filter(function(z){return z.parentOrderId===o.id;}).map(function(z){var st=stores.filter(function(v){return v.id===z.sellerId;})[0]||{};z.shopName=st.shopName||'ร้านค้าหลัก';z.items=o.items.filter(function(i){return i.sellerOrderId===z.id;});return z;});return o;}));}catch(e){return fail_(safeError_(e));}
}
function updateOrderStatus(token,id,status,note){
  try{return withLock_(function(){
    var user=requireAdmin_(token,'orders.manage');
    var order=readTable_('Orders',false).filter(function(x){return x.id===id;})[0];
    if(!order)throw new Error('ไม่พบคำสั่งซื้อ');
    var allowed=['Pending','Awaiting Payment','Paid','Processing','Packed','Shipped','Delivered','Completed','Cancelled','Refunded'];
    if(allowed.indexOf(status)<0)throw new Error('สถานะไม่ถูกต้อง');
    if(status==='Paid')throw new Error('กรุณายืนยันการชำระเงินผ่านเมนู Payments');
    if(order.orderStatus==='Cancelled'||order.orderStatus==='Refunded'){
      if(status===order.orderStatus)return ok_(true,'สถานะนี้ถูกบันทึกไว้แล้ว');
      if(!(order.orderStatus==='Cancelled'&&status==='Refunded'&&order.paymentStatus==='Verified'))throw new Error('คำสั่งซื้อที่ยกเลิกหรือคืนเงินแล้วไม่สามารถเปลี่ยนกลับไปดำเนินการได้');
    }
    if(status==='Cancelled'){
      if(['Shipped','Delivered','Completed'].indexOf(order.orderStatus)>=0)throw new Error('ไม่สามารถยกเลิกคำสั่งซื้อที่จัดส่งแล้วหรือเสร็จสมบูรณ์');
      return cancelOrderInternal_(order,user.username,note||'Cancelled by admin');
    }
    if(status==='Refunded'){
      if(order.paymentStatus!=='Verified')throw new Error('สามารถบันทึกคืนเงินได้หลังยืนยันการชำระเงินแล้วเท่านั้น');
      if(order.orderStatus!=='Cancelled')settleOrderStock_(id,true);
      var paidRows=readTable_('Payments',false).filter(function(p){return p.orderId===id;});
      paidRows.forEach(function(p){updateRecord_('Payments',p.id,{status:'Refunded',verifiedBy:user.username,verifiedAt:now_(),note:text_(note||'Refund confirmed by admin',500)});});
      updateRecord_('Orders',id,{orderStatus:'Refunded',paymentStatus:'Refunded',note:text_((order.note?order.note+' | ':'')+String(note||''),1000),updatedAt:now_()});
      log_('Update Order Status','Orders',order.orderNumber+' => Refunded',user.username);
      clearRuntimeCaches_();
      return ok_(true,'บันทึกสถานะคืนเงินแล้ว');
    }
    if(['Processing','Packed','Shipped','Delivered','Completed'].indexOf(status)>=0 && order.paymentMethod!=='cod' && order.paymentStatus!=='Verified'){
      throw new Error('ต้องยืนยันการชำระเงินก่อนดำเนินการจัดส่ง');
    }
    var transitions={
      'Pending':['Awaiting Payment','Processing'],
      'Awaiting Payment':['Processing'],
      'Processing':['Packed'],
      'Packed':['Shipped'],
      'Shipped':['Delivered'],
      'Delivered':['Completed'],
      'Completed':[]
    };
    if(order.orderStatus!==status && transitions[order.orderStatus] && transitions[order.orderStatus].indexOf(status)<0){
      throw new Error('ไม่สามารถเปลี่ยนสถานะจาก '+order.orderStatus+' ไป '+status+' ได้');
    }
    var changes={orderStatus:status,note:text_((order.note?order.note+' | ':'')+String(note||''),1000),updatedAt:now_()};
    if(status==='Completed')changes.completedAt=now_();
    updateRecord_('Orders',id,changes);
    if(status==='Completed'&&order.paymentMethod==='cod'&&order.paymentStatus!=='Verified'){
      updateRecord_('Orders',id,{paymentStatus:'Verified',paidAt:now_()});
      var pays=readTable_('Payments',false).filter(function(p){return p.orderId===id;})[0];
      if(pays)updateRecord_('Payments',pays.id,{status:'Verified',verifiedBy:user.username,verifiedAt:now_()});
      settleOrderStock_(id,false);
    }
    if(status==='Completed'){ readTable_('SellerOrders',false).filter(function(x){return x.parentOrderId===id;}).forEach(function(x){updateRecord_('SellerOrders',x.id,{status:'Completed',updatedAt:now_()});});createSellerPayoutsForOrder_(id);if(order.customerId)awardCoinsForOrder_(order);}
    log_('Update Order Status','Orders',order.orderNumber+' => '+status,user.username);
    clearRuntimeCaches_();
    return ok_(true,'เปลี่ยนสถานะคำสั่งซื้อแล้ว');
  });}catch(e){return fail_(safeError_(e));}
}
function cancelOrderInternal_(order,by,reason){
  if(order.orderStatus==='Cancelled')return ok_(true,'คำสั่งซื้อนี้ถูกยกเลิกแล้ว');
  if(order.orderStatus==='Refunded')throw new Error('คำสั่งซื้อคืนเงินแล้ว');
  var paid=order.paymentStatus==='Verified';
  settleOrderStock_(order.id,true);
  // Release coupon usage and restore a collected voucher when the order is cancelled.
  var couponMatch=String(order.note||'').match(/\[COUPON:([^\]]+)\]/i);
  if(couponMatch){
    var couponCode=String(couponMatch[1]).toUpperCase();
    var usedCoupon=readTable_('Coupons',false).filter(function(c){return String(c.code||'').toUpperCase()===couponCode;})[0];
    if(usedCoupon)updateRecord_('Coupons',usedCoupon.id,{usedCount:Math.max(0,number_(usedCoupon.usedCount,0)-1)});
    if(order.customerId&&usedCoupon){
      var collected=readTable_('CollectedVouchers',false).filter(function(v){return v.customerId===order.customerId&&v.couponId===usedCoupon.id&&v.usedAt;})[0];
      if(collected)updateRecord_('CollectedVouchers',collected.id,{usedAt:''});
    }
  }
  updateRecord_('Orders',order.id,{orderStatus:'Cancelled',shippingStatus:'Cancelled',updatedAt:now_(),note:text_((order.note||'')+' | '+reason,1000)});
  readTable_('SellerOrders',false).filter(function(x){return x.parentOrderId===order.id;}).forEach(function(x){updateRecord_('SellerOrders',x.id,{status:'Cancelled',updatedAt:now_()});});
  var pays=readTable_('Payments',false).filter(function(p){return p.orderId===order.id;});
  pays.forEach(function(p){if(!paid)updateRecord_('Payments',p.id,{status:'Unpaid',note:'Order cancelled'});else updateRecord_('Payments',p.id,{note:'Order cancelled; refund must be processed manually'});});
  log_('Cancel Order','Orders',order.orderNumber+' '+reason,by);
  clearRuntimeCaches_();
  return ok_(true,'ยกเลิกคำสั่งซื้อแล้ว');
}
function cancelOrder(token,id,reason){
  try{return withLock_(function(){var user;var order=readTable_('Orders',false).filter(function(x){return x.id===id;})[0];if(!order)throw new Error('ไม่พบคำสั่งซื้อ');if(token){var s=findSession_(token,'customer');if(s){var c=requireCustomer_(token);if(order.customerId!==c.id)throw new Error('ไม่สามารถยกเลิกคำสั่งซื้อของผู้อื่น');user=c;}else user=requireAdmin_(token,'orders.manage');}else throw new Error('กรุณาเข้าสู่ระบบ');if(['Shipped','Delivered','Completed','Cancelled','Refunded'].indexOf(order.orderStatus)>=0)throw new Error('สถานะปัจจุบันไม่สามารถยกเลิกได้');return cancelOrderInternal_(order,user.username,reason||'Cancelled');});}catch(e){return fail_(safeError_(e));}
}

/* -------------------------------- PAYMENTS ------------------------------- */
function getPayments(token){try{requireAdmin_(token,'payments.view');var rows=readTable_('Payments',false),orders=readTable_('Orders',false);rows.forEach(function(p){var o=orders.filter(function(x){return x.id===p.orderId;})[0]||{};p.orderNumber=o.orderNumber||'';p.customerName=o.customerName||'';p.proofFileUrl=p.proofFileId?'https://drive.google.com/file/d/'+p.proofFileId+'/view':'';});rows.sort(function(a,b){return new Date(b.createdAt)-new Date(a.createdAt);});return ok_(rows);}catch(e){return fail_(safeError_(e));}}
function getPaymentProof(token,fileId){try{requireAdmin_(token,'payments.view');var file=DriveApp.getFileById(fileId);if(!isFileInSystemFolder_(file,'Payments'))throw new Error('ไฟล์นี้ไม่ใช่หลักฐานการชำระเงินของร้าน');if(file.getSize()>3*1024*1024)throw new Error('ไฟล์ใหญ่เกินกว่าจะแสดงตัวอย่างในระบบ กรุณาเปิดผ่าน Google Drive');var blob=file.getBlob();return ok_({name:file.getName(),mimeType:blob.getContentType(),data:'data:'+blob.getContentType()+';base64,'+Utilities.base64Encode(blob.getBytes())});}catch(e){return fail_(safeError_(e));}}
function submitPayment(customerToken,orderId,data){
  try{
    data=data||{};var c=null,order=null,account='guest',actor='';
    var session=findSession_(customerToken,'customer');
    if(session){c=requireCustomer_(customerToken);account='customer';actor=c.id;order=readTable_('Orders',false).filter(function(x){return x.id===orderId&&x.customerId===c.id;})[0];}
    else{order=readTable_('Orders',false).filter(function(x){return x.id===orderId&&!x.customerId&&x.guestAccessToken===customerToken;})[0];actor=order?'Guest:'+order.orderNumber:'';}
    if(!order)throw new Error('ไม่พบคำสั่งซื้อหรือไม่มีสิทธิ์ส่งหลักฐาน');
    if(order.orderStatus==='Cancelled'||order.orderStatus==='Refunded')throw new Error('คำสั่งซื้อถูกยกเลิกหรือคืนเงินแล้ว');
    if(order.paymentStatus==='Verified')throw new Error('คำสั่งซื้อนี้ได้รับการยืนยันการชำระเงินแล้ว');
    if(['bank_transfer','qr_payment'].indexOf(order.paymentMethod)<0)throw new Error('วิธีชำระเงินนี้ไม่รองรับการแนบหลักฐาน');
    var fileId=text_(data.proofFileId,200);if(!fileId)throw new Error('กรุณาแนบหลักฐานการชำระเงิน');
    var proof=DriveApp.getFileById(fileId);
    if(!isFileInSystemFolder_(proof,'Payments'))throw new Error('ไม่พบไฟล์หลักฐานในโฟลเดอร์ Payments ของระบบ');
    var expected='EcommercePaymentProof|'+orderId+'|'+account+'|'+actor;
    if(proof.getDescription()!==expected)throw new Error('ไฟล์หลักฐานไม่ได้ถูกอัปโหลดสำหรับคำสั่งซื้อนี้');
    if(proof.getMimeType().indexOf('image/')!==0)throw new Error('หลักฐานต้องเป็นไฟล์รูปภาพ');
    var p=readTable_('Payments',false).filter(function(x){return x.orderId===orderId;})[0];if(!p)throw new Error('ไม่พบรายการชำระเงิน');
    if(p.status==='Verified'||p.status==='Refunded')throw new Error('รายการชำระเงินนี้ปิดการตรวจสอบแล้ว');
    updateRecord_('Payments',p.id,{reference:text_(data.reference,100),proofFileId:fileId,proofUrl:'',paymentDate:text_(data.paymentDate,60),status:'Pending Verification',note:text_(data.note,500)});
    updateRecord_('Orders',orderId,{paymentStatus:'Pending Verification',updatedAt:now_()});
    return ok_(true,'ส่งหลักฐานการชำระเงินแล้ว รอร้านค้าตรวจสอบ');
  }catch(e){return fail_(safeError_(e));}
}
function verifyPayment(token,paymentId,note){
  try{return withLock_(function(){var user=requireAdmin_(token,'payments.verify');var p=readTable_('Payments',false).filter(function(x){return x.id===paymentId;})[0];if(!p)throw new Error('ไม่พบรายการชำระเงิน');if(p.status==='Verified')return ok_(true,'รายการนี้ได้รับการยืนยันแล้ว');var o=readTable_('Orders',false).filter(function(x){return x.id===p.orderId;})[0];if(o && (o.orderStatus==='Cancelled'||o.orderStatus==='Refunded'))throw new Error('คำสั่งซื้อถูกยกเลิกหรือคืนเงินแล้ว');updateRecord_('Payments',paymentId,{status:'Verified',verifiedBy:user.username,verifiedAt:now_(),note:text_(note,500)});if(o){updateRecord_('Orders',o.id,{paymentStatus:'Verified',orderStatus:'Processing',paidAt:now_(),updatedAt:now_()});settleOrderStock_(o.id,false);readTable_('SellerOrders',false).filter(function(x){return x.parentOrderId===o.id&&x.status==='Awaiting Payment';}).forEach(function(x){updateRecord_('SellerOrders',x.id,{status:'Processing',updatedAt:now_()});});if(o.customerId)notify_('customer',o.customerId,'ยืนยันการชำระเงินแล้ว','คำสั่งซื้อ '+o.orderNumber+' กำลังเตรียมจัดส่ง','order',o.id);}log_('Verify Payment','Payments',p.orderId,user.username);clearRuntimeCaches_();return ok_(true,'ยืนยันการชำระเงินแล้ว');});}catch(e){return fail_(safeError_(e));}
}
function rejectPayment(token,paymentId,reason){try{return withLock_(function(){var user=requireAdmin_(token,'payments.verify');var p=readTable_('Payments',false).filter(function(x){return x.id===paymentId;})[0];if(!p)throw new Error('ไม่พบรายการชำระเงิน');if(p.status==='Verified'||p.status==='Refunded')throw new Error('ไม่สามารถปฏิเสธรายการที่ยืนยันหรือคืนเงินแล้ว');var o=readTable_('Orders',false).filter(function(x){return x.id===p.orderId;})[0];if(!o||o.orderStatus==='Cancelled'||o.orderStatus==='Refunded')throw new Error('คำสั่งซื้อไม่อยู่ในสถานะที่ตรวจสอบการชำระเงินได้');updateRecord_('Payments',paymentId,{status:'Rejected',verifiedBy:user.username,verifiedAt:now_(),note:text_(reason,500)});updateRecord_('Orders',p.orderId,{paymentStatus:'Rejected',updatedAt:now_()});log_('Reject Payment','Payments',reason,user.username);return ok_(true,'ปฏิเสธหลักฐานแล้ว');});}catch(e){return fail_(safeError_(e));}}

/* -------------------------------- SHIPPING ------------------------------- */
function getShippingMethods(options){try{options=options||{};var isAdmin=false;if(options.token){try{requireAdmin_(options.token,'shipping.view');isAdmin=true;}catch(authError){}}var rows=readTable_('ShippingMethods',true).filter(function(x){return x.status==='Active'||isAdmin;});return ok_(rows);}catch(e){return fail_(safeError_(e));}}
function saveShippingMethod(token,data){try{var user=requireAdmin_(token,'shipping.manage');data=data||{};var id=text_(data.id,100)||newId_('SHM'),old=readTable_('ShippingMethods',false).filter(function(x){return x.id===id;})[0],now=now_();var row={id:id,name:text_(data.name,120),method:text_(data.method||'standard',50),fee:Math.max(0,number_(data.fee,0)),freeMinimum:Math.max(0,number_(data.freeMinimum,0)),maxWeight:number_(data.maxWeight,0),status:text_(data.status||'Active',30),createdAt:old?old.createdAt:now,updatedAt:now};if(!row.name)throw new Error('กรุณาระบุชื่อวิธีจัดส่ง');upsertById_('ShippingMethods',row);log_('Save Shipping Method','Shipping',row.name,user.username);return ok_(row,'บันทึกวิธีจัดส่งแล้ว');}catch(e){return fail_(safeError_(e));}}
function deleteShippingMethod(token,id){try{var user=requireAdmin_(token,'shipping.manage');deleteRows_('ShippingMethods',function(x){return x.id===id;});log_('Delete Shipping Method','Shipping',id,user.username);return ok_(true,'ลบวิธีจัดส่งแล้ว');}catch(e){return fail_(safeError_(e));}}
function updateShipping(token,data){try{var user=requireAdmin_(token,'shipping.manage');data=data||{};var order=readTable_('Orders',false).filter(function(x){return x.id===data.orderId;})[0];if(!order)throw new Error('ไม่พบคำสั่งซื้อ');var sh=readTable_('Shipping',false).filter(function(x){return x.orderId===order.id;})[0];if(!sh)throw new Error('ไม่พบรายการจัดส่ง');var tracking=text_(data.trackingNumber,120),carrier=text_(data.carrier,100),status=text_(data.status||'Shipped',50);updateRecord_('Shipping',sh.id,{carrier:carrier,trackingNumber:tracking,status:status,shippedAt:status==='Shipped'?now_():sh.shippedAt,deliveredAt:status==='Delivered'?now_():sh.deliveredAt});updateRecord_('Orders',order.id,{trackingNumber:tracking,shippingStatus:status,orderStatus:status==='Shipped'?'Shipped':(status==='Delivered'?'Delivered':order.orderStatus),updatedAt:now_()});log_('Update Shipping','Shipping',order.orderNumber+' '+tracking,user.username);return ok_(true,'บันทึกข้อมูลจัดส่งแล้ว');}catch(e){return fail_(safeError_(e));}}
function getTrackingInfo(orderNumber){try{var o=readTable_('Orders',false).filter(function(x){return x.orderNumber===orderNumber;})[0];if(!o)throw new Error('ไม่พบคำสั่งซื้อ');var s=readTable_('Shipping',false).filter(function(x){return x.orderId===o.id;})[0]||{},stores=readTable_('Stores',true),subs=readTable_('SellerOrders',true).filter(function(x){return x.parentOrderId===o.id;}).map(function(x){var st=stores.filter(function(z){return z.id===x.sellerId;})[0]||{};return {orderNumber:x.orderNumber,shopName:st.shopName||'ร้านค้าหลัก',status:x.status,carrier:x.carrier||'',trackingNumber:x.trackingNumber||'',shippedAt:x.shippedAt||'',deliveredAt:x.deliveredAt||''};});return ok_({orderNumber:o.orderNumber,status:o.shippingStatus,carrier:s.carrier||'',trackingNumber:s.trackingNumber||o.trackingNumber||'',shippedAt:s.shippedAt||'',deliveredAt:s.deliveredAt||'',sellerShipments:subs});}catch(e){return fail_(safeError_(e));}}

/* ------------------------------- PROMOTIONS ------------------------------ */
function getPromotions(token){try{if(token)requireAdmin_(token,'promotions.view');var rows=readTable_('Promotions',true);if(!token)rows=rows.filter(function(x){return x.status==='Active'&&(!x.startDate||new Date(x.startDate).getTime()<=Date.now())&&(!x.endDate||new Date(x.endDate).getTime()>=Date.now());});return ok_(rows);}catch(e){return fail_(safeError_(e));}}
function savePromotion(token,data){try{requireAdmin_(token,'promotions.manage');data=data||{};var products=readTable_('Products',false),categories=readTable_('Categories',false);function parseIds(value){if(Array.isArray(value))return value.map(String);var raw=text_(value,5000);try{var parsed=JSON.parse(raw);if(Array.isArray(parsed))return parsed.map(String);}catch(parseError){}return raw.split(',').map(function(x){return x.trim();}).filter(Boolean);}var pids=parseIds(data.productIds),cids=parseIds(data.categoryIds);var missingProduct=pids.filter(function(id){return !products.some(function(p){return String(p.id)===id;});}),missingCategory=cids.filter(function(id){return !categories.some(function(c){return String(c.id)===id;});});if(missingProduct.length)throw new Error('มีสินค้าที่เลือกไม่อยู่ในระบบ กรุณาเลือกสินค้าใหม่');if(missingCategory.length)throw new Error('มีหมวดหมู่ที่เลือกไม่อยู่ในระบบ กรุณาเลือกหมวดหมู่ใหม่');if(['percent','amount'].indexOf(String(data.type||'percent'))<0)throw new Error('ประเภทโปรโมชั่นไม่ถูกต้อง');return saveSimpleEntity_(token,'Promotions',data,'promotions.manage',['name','type','value','startDate','endDate','productIds','categoryIds','status','createdAt'],'PRM');}catch(e){return fail_(safeError_(e));}}
function deletePromotion(token,id){return deleteSimpleEntity_(token,'Promotions',id,'promotions.manage');}
function getCoupons(token){try{requireAdmin_(token,'coupons.view');return ok_(readTable_('Coupons',false));}catch(e){return fail_(safeError_(e));}}
function validateCoupon(code,subtotal,customerToken){try{var c=customerToken?requireCustomer_(customerToken):null;return ok_(calculateCoupon_(code,number_(subtotal,0),c?c.id:'',[]));}catch(e){return fail_(safeError_(e));}}
function saveCoupon(token,data){
  try{var user=requireAdmin_(token,'coupons.manage');data=data||{};var id=text_(data.id,100)||newId_('CPN'),old=readTable_('Coupons',false).filter(function(x){return x.id===id;})[0];var couponSellerId=text_(data.sellerId || (old?old.sellerId:''),100);if(couponSellerId&&!readTable_('Stores',false).some(function(st){return String(st.id)===couponSellerId;}))throw new Error('ไม่พบร้านค้าที่เลือกสำหรับคูปอง');var row={id:id,code:text_(data.code,60).toUpperCase(),title:text_(data.title||data.code,140),discountType:text_(data.discountType||'amount',30),discountValue:Math.max(0,number_(data.discountValue,0)),minimumOrder:Math.max(0,number_(data.minimumOrder,0)),maximumDiscount:Math.max(0,number_(data.maximumDiscount,0)),usageLimit:Math.max(0,number_(data.usageLimit,0)),usagePerCustomer:Math.max(0,number_(data.usagePerCustomer,0)),usedCount:old?number_(old.usedCount,0):0,startDate:text_(data.startDate,60),endDate:text_(data.endDate,60),sellerId:couponSellerId,status:text_(data.status||'Active',30),createdAt:old?old.createdAt:now_()};if(!row.code)throw new Error('กรุณาระบุ Coupon Code');var dup=readTable_('Coupons',false).some(function(x){return x.id!==id&&String(x.code).toUpperCase()===row.code;});if(dup)throw new Error('รหัสคูปองซ้ำ');upsertById_('Coupons',row);log_('Save Coupon','Coupons',row.code,user.username);return ok_(row,'บันทึกคูปองแล้ว');}catch(e){return fail_(safeError_(e));}
}
function deleteCoupon(token,id){return deleteSimpleEntity_(token,'Coupons',id,'coupons.manage');}

function saveSimpleEntity_(token,table,data,permission,fields,prefix){
  try{var user=requireAdmin_(token,permission);data=data||{};var id=text_(data.id,100)||newId_(prefix),old=readTable_(table,false).filter(function(x){return x.id===id;})[0],row={id:id};fields.forEach(function(k){var value=Object.prototype.hasOwnProperty.call(data,k)?data[k]:(old?old[k]:'');row[k]=(table==='Banners'&&k==='description')?sanitizeHtml_(value):value;});if(fields.indexOf('createdAt')>=0&&!row.createdAt)row.createdAt=now_();if(fields.indexOf('updatedAt')>=0)row.updatedAt=now_();upsertById_(table,row);log_('Save '+table,table,id,user.username);return ok_(row,'บันทึกข้อมูลแล้ว');}catch(e){return fail_(safeError_(e));}
}
function deleteSimpleEntity_(token,table,id,permission){try{var user=requireAdmin_(token,permission);deleteRows_(table,function(x){return x.id===id;});log_('Delete '+table,table,id,user.username);return ok_(true,'ลบข้อมูลแล้ว');}catch(e){return fail_(safeError_(e));}}

/* ---------------------------------- BANNERS ------------------------------ */

function getBannerStoreOptions(token) {
  try {
    requireAdmin_(token,'settings.manage');
    var rows=readTable_('Stores',true).filter(function(store){return store&&store.status==='Active';});
    rows.sort(function(a,b){return String(a.shopName||'').localeCompare(String(b.shopName||''),'th');});
    return ok_(rows.map(function(store){return {id:String(store.id||''),shopName:String(store.shopName||store.name||'')};}));
  } catch(e) { return fail_(safeError_(e)); }
}

function getBanners(options){try{options=options||{};var isAdmin=false;if(options.token){try{requireAdmin_(options.token,'banners.view');isAdmin=true;}catch(authError){}}var rows=readTable_('Banners',true).filter(function(x){if(isAdmin)return true;var n=Date.now();return x.status==='Active'&&(!x.startDate||new Date(x.startDate).getTime()<=n)&&(!x.endDate||new Date(x.endDate).getTime()>=n);});rows.sort(function(a,b){return number_(a.order,0)-number_(b.order,0);});return ok_(rows);}catch(e){return fail_(safeError_(e));}}
function saveBanner(token,data){
  try {
    requireAdmin_(token,'banners.manage');
    data=data||{};
    ensureTableColumns_('Banners',['destinationType','destinationStoreId','showDestination','openInNewTab']);
    var destinationType=text_(data.destinationType||'url',20);
    if(['url','products','store','none'].indexOf(destinationType)<0)throw new Error('ประเภทปลายทางไม่ถูกต้อง');
    if(destinationType==='store'){
      var destinationStoreId=text_(data.destinationStoreId,100);
      var destinationStore=readTable_('Stores',true).filter(function(store){return String(store.id)===destinationStoreId&&store.status==='Active';})[0];
      if(!destinationStore)throw new Error('กรุณาเลือกร้านค้าที่เปิดใช้งานเป็นปลายทาง');
    }
    data.destinationType=destinationType;
    data.destinationStoreId=text_(data.destinationStoreId,100);
    data.showDestination=parseBool_(data.showDestination);
    data.openInNewTab=parseBool_(data.openInNewTab);
    return saveSimpleEntity_(token,'Banners',data,'banners.manage',['title','description','image','url','buttonText','position','startDate','endDate','order','status','createdAt','updatedAt','destinationType','destinationStoreId','showDestination','openInNewTab'],'BAN');
  } catch(e) { return fail_(safeError_(e)); }
}
function deleteBanner(token,id){return deleteSimpleEntity_(token,'Banners',id,'banners.manage');}

/* --------------------------------- CUSTOMERS ----------------------------- */
function getCustomers(token,filters){try{requireAdmin_(token,'customers.view');filters=filters||{};var rows=readTable_('Customers',false).map(function(c){return publicCustomer_(c);});if(filters.search){var q=text_(filters.search,100).toLowerCase();rows=rows.filter(function(x){return [x.username,x.firstname,x.lastname,x.phone,x.email].join(' ').toLowerCase().indexOf(q)>=0;});}return ok_(rows);}catch(e){return fail_(safeError_(e));}}
function getCustomerById(token,id){try{requireAdmin_(token,'customers.view');var c=readTable_('Customers',false).filter(function(x){return x.id===id;})[0];if(!c)throw new Error('ไม่พบลูกค้า');return ok_(publicCustomer_(c));}catch(e){return fail_(safeError_(e));}}
function saveCustomer(token,data){try{var user=requireAdmin_(token,'customers.manage');data=data||{};var id=text_(data.id,100)||newId_('CUS'),old=readTable_('Customers',false).filter(function(x){return x.id===id;})[0];var row={id:id,username:text_(data.username||data.email,100).toLowerCase(),passwordHash:old?old.passwordHash:hashPassword_(Utilities.getUuid()),firstname:text_(data.firstname,100),lastname:text_(data.lastname,100),phone:text_(data.phone,40),email:text_(data.email,160).toLowerCase(),profileImage:text_(data.profileImage,1000),status:text_(data.status||'Active',30),createdAt:old?old.createdAt:now_(),updatedAt:now_()};if(!row.email)throw new Error('กรุณาระบุอีเมล');upsertById_('Customers',row);log_('Save Customer','Customers',row.email,user.username);return ok_(publicCustomer_(row),'บันทึกข้อมูลลูกค้าแล้ว');}catch(e){return fail_(safeError_(e));}}
function deleteCustomer(token,id){try{var user=requireAdmin_(token,'customers.manage');var used=readTable_('Orders',false).some(function(o){return o.customerId===id;});if(used)updateRecord_('Customers',id,{status:'Disabled',updatedAt:now_()});else deleteRows_('Customers',function(c){return c.id===id;});log_('Delete Customer','Customers',id,user.username);return ok_(true,used?'ปิดใช้งานบัญชีลูกค้าแล้ว':'ลบลูกค้าแล้ว');}catch(e){return fail_(safeError_(e));}}

/* ------------------------------- ADDRESSES ------------------------------- */
function getAddresses(customerToken){try{var c=requireCustomer_(customerToken);return ok_(readTable_('Addresses',false).filter(function(a){return a.customerId===c.id;}));}catch(e){return fail_(safeError_(e));}}
function saveAddress(customerToken,data){try{var c=requireCustomer_(customerToken);data=data||{};var id=text_(data.id,100)||newId_('ADR'),row={id:id,customerId:c.id,recipient:text_(data.recipient,120),phone:text_(data.phone,40),address:text_(data.address,300),subdistrict:text_(data.subdistrict,100),district:text_(data.district,100),province:text_(data.province,100),postalCode:text_(data.postalCode,20),country:text_(data.country||'Thailand',80),isDefault:parseBool_(data.isDefault),createdAt:now_()};if(!row.recipient||!row.phone||!row.address)throw new Error('กรุณากรอกผู้รับ เบอร์โทร และที่อยู่');if(row.isDefault)readTable_('Addresses',false).filter(function(a){return a.customerId===c.id;}).forEach(function(a){updateRecord_('Addresses',a.id,{isDefault:false});});var old=readTable_('Addresses',false).filter(function(a){return a.id===id&&a.customerId===c.id;})[0];if(old)updateRecord_('Addresses',id,row);else appendRecord_('Addresses',row);return ok_(row,'บันทึกที่อยู่แล้ว');}catch(e){return fail_(safeError_(e));}}
function deleteAddress(customerToken,id){try{var c=requireCustomer_(customerToken);deleteRows_('Addresses',function(a){return a.id===id&&a.customerId===c.id;});return ok_(true,'ลบที่อยู่แล้ว');}catch(e){return fail_(safeError_(e));}}

/* -------------------------------- FAVORITES ------------------------------ */
function getFavorites(customerToken){try{var c=requireCustomer_(customerToken);var ids=readTable_('Favorites',false).filter(function(x){return x.customerId===c.id;}).map(function(x){return x.productId;});return ok_(readTable_('Products',true).filter(function(p){return ids.indexOf(p.id)>=0&&p.status==='Active';}).map(publicProduct_));}catch(e){return fail_(safeError_(e));}}
function addFavorite(customerToken,productId){try{var c=requireCustomer_(customerToken);var p=readTable_('Products',false).filter(function(x){return x.id===productId&&x.status==='Active';})[0];if(!p)throw new Error('ไม่พบสินค้า');var exists=readTable_('Favorites',false).some(function(x){return x.customerId===c.id&&x.productId===productId;});if(!exists)appendRecord_('Favorites',{id:newId_('FAV'),customerId:c.id,productId:productId,createdAt:now_()});return ok_(true,'เพิ่มรายการโปรดแล้ว');}catch(e){return fail_(safeError_(e));}}
function removeFavorite(customerToken,productId){try{var c=requireCustomer_(customerToken);deleteRows_('Favorites',function(x){return x.customerId===c.id&&x.productId===productId;});return ok_(true,'นำออกจากรายการโปรดแล้ว');}catch(e){return fail_(safeError_(e));}}

/* --------------------------------- REVIEWS -------------------------------- */
function getReviews(productId,token){try{var isAdmin=!!token;if(isAdmin)requireAdmin_(token,'reviews.view');var rows=readTable_('Reviews',true).filter(function(x){return (!productId||x.productId===productId)&&(isAdmin||x.status==='Published');});if(!isAdmin){var orders=readTable_('Orders',false),verified=orders.filter(function(o){return o.paymentStatus==='Verified'&&o.orderStatus!=='Cancelled'&&o.orderStatus!=='Refunded';}).map(function(o){return o.id;}),prefs=[],customers=[];try{if(getSpreadsheet_().getSheetByName('CustomerPreferences'))prefs=readTable_('CustomerPreferences',true);customers=readTable_('Customers',true);}catch(privacyReadError){}rows=rows.map(function(x){var pref=prefs.filter(function(p){return p.customerId===x.customerId;})[0]||{},customer=customers.filter(function(c){return c.id===x.customerId;})[0]||{},showName=parseBool_(pref.profileReviewVisibility);var displayName=showName?[customer.firstname,customer.lastname].filter(Boolean).join(' ').trim():'ผู้ซื้อสินค้า';return {id:x.id,productId:x.productId,rating:x.rating,review:x.review,images:safeArray_(safeJson_(x.images,[])),createdAt:x.createdAt,verifiedPurchase:verified.indexOf(x.orderId)>=0,customerName:displayName||'ผู้ซื้อสินค้า'};});}return ok_(rows);}catch(e){return fail_(safeError_(e));}}
function saveReview(customerToken,data){try{var c=requireCustomer_(customerToken);data=data||{};var allOrders=readTable_('Orders',false),allItems=readTable_('OrderItems',false),purchase=allOrders.filter(function(o){return o.customerId===c.id&&o.paymentStatus==='Verified'&&o.orderStatus!=='Cancelled'&&o.orderStatus!=='Refunded';}).filter(function(o){return allItems.some(function(i){return i.orderId===o.id&&i.productId===data.productId;});})[0];if(!purchase)throw new Error('รีวิวได้เฉพาะสินค้าที่ซื้อและยืนยันการชำระเงินแล้ว');var rating=Math.min(5,Math.max(1,Math.floor(number_(data.rating,5))));var row={id:newId_('REV'),productId:text_(data.productId,100),customerId:c.id,orderId:purchase.id,rating:rating,review:text_(data.review,2000),images:JSON.stringify(safeArray_(data.images)),status:'Pending',createdAt:now_()};appendRecord_('Reviews',row);return ok_(row,'ส่งรีวิวแล้ว รอผู้ดูแลตรวจสอบ');}catch(e){return fail_(safeError_(e));}}
function updateReviewStatus(token,id,status){try{var user=requireAdmin_(token,'reviews.manage');if(['Published','Hidden','Rejected'].indexOf(status)<0)throw new Error('สถานะไม่ถูกต้อง');updateRecord_('Reviews',id,{status:status});log_('Review Status','Reviews',id+' => '+status,user.username);clearRuntimeCaches_();return ok_(true,'ปรับสถานะรีวิวแล้ว');}catch(e){return fail_(safeError_(e));}}

/* ---------------------------------- UPLOAD -------------------------------- */
function isFileInSystemFolder_(file,folderName){
  var root=DriveApp.getFolderById(FOLDER_ID),folders=root.getFoldersByName(folderName);
  if(!folders.hasNext())return false;
  var folder=folders.next(),targetId=folder.getId(),parents=file.getParents();
  while(parents.hasNext())if(parents.next().getId()===targetId)return true;
  return false;
}
function decodeUrlEncodedUploadPayload_(encoded) {
  var result = {};
  String(encoded || '').split('&').forEach(function(part) {
    if (!part) return;
    var pos = part.indexOf('=');
    var key = pos >= 0 ? part.substring(0, pos) : part;
    var value = pos >= 0 ? part.substring(pos + 1) : '';
    try { key = decodeURIComponent(key.replace(/\+/g, ' ')); } catch (e) {}
    try { value = decodeURIComponent(value.replace(/\+/g, ' ')); } catch (e) {}
    result[key] = value;
  });
  if (result.filename && !result.name) result.name = result.filename;
  if (result.base64) result.data = result.base64;
  return result;
}

/**
 * Apps Script compatible upload transport.
 * The browser serializes metadata + Base64 using URLSearchParams and sends
 * the resulting plain string through google.script.run (no FormData/multipart).
 */
function uploadFileFromUrlEncoded(token, encodedPayload) {
  try {
    var payload = decodeUrlEncodedUploadPayload_(encodedPayload);
    if (!payload.base64) throw new Error('ไม่พบข้อมูล Base64 ของไฟล์');
    return uploadFile(token, payload);
  } catch (error) {
    return fail_(safeError_(error));
  }
}

function folderNameSafe_(value) { return text_(value || '', 60); }

function ensureDriveAssetsTable_(){
  var ss=getSpreadsheet_(),sh=ss.getSheetByName('DriveAssets'),headers=SCHEMA_.DriveAssets;
  if(!sh){sh=ss.insertSheet('DriveAssets');sh.getRange(1,1,1,headers.length).setValues([headers]);sh.setFrozenRows(1);return sh;}
  var existing=sh.getLastColumn()?sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0]:[];
  var missing=headers.filter(function(h){return existing.indexOf(h)<0;});
  if(missing.length){var merged=existing.filter(String).concat(missing);sh.getRange(1,1,1,merged.length).setValues([merged]);sh.setFrozenRows(1);}
  return sh;
}

function driveProfileImageUrl_(fileId) {
  var id = String(fileId || '').trim();
  if (!/^[A-Za-z0-9_-]{10,100}$/.test(id)) throw new Error('รหัสไฟล์รูปโปรไฟล์ไม่ถูกต้อง');
  return 'https://lh3.googleusercontent.com/d/' + id;
}

/** Add required columns to legacy Sheets without overwriting existing data. */
function ensureTableColumns_(name, requiredColumns) {
  var sh = validateTable_(name);
  if (!sh) throw new Error('ไม่พบชีต ' + name);
  var lastCol = sh.getLastColumn();
  if (lastCol < 1) {
    var schemaHeaders = SCHEMA_[name] || ['id'];
    sh.getRange(1, 1, 1, schemaHeaders.length).setValues([schemaHeaders]);
    sh.setFrozenRows(1);
    lastCol = schemaHeaders.length;
  }
  var headers = sh.getRange(1, 1, 1, lastCol).getValues()[0].map(function(value) {
    return String(value || '').trim();
  });
  var missing = safeArray_(requiredColumns).filter(function(column) {
    return headers.indexOf(column) < 0;
  });
  if (missing.length) {
    sh.getRange(1, lastCol + 1, 1, missing.length).setValues([missing]);
    SpreadsheetApp.flush();
    invalidateTable_(name);
  }
  return sh;
}

/** Save and read back the requested Googleusercontent profile URL. */
function persistCustomerProfileImage_(customerId, fileId) {
  var url = driveProfileImageUrl_(fileId);
  ensureTableColumns_('Customers', ['id', 'profileImage', 'updatedAt']);
  updateRecord_('Customers', customerId, { profileImage: url, updatedAt: now_() });
  SpreadsheetApp.flush();
  var saved = findRecordByExactColumn_('Customers', 'id', customerId);
  if (!saved || String(saved.profileImage || '').trim() !== url) {
    throw new Error('สร้างรูปใน Drive แล้ว แต่ตรวจยืนยัน URL ใน Customers.profileImage ไม่สำเร็จ');
  }
  return url;
}

function validateProductVideoReference_(value,sellerId){
  var ref=String(value||'').trim();if(!ref)return '';
  if(/^https:\/\//i.test(ref))return ref;
  var match=ref.match(/^drive-private:\/\/([A-Za-z0-9_-]{10,100})$/i);
  if(!match)throw new Error('URL วิดีโอต้องเป็น https:// หรือไฟล์วิดีโอที่อัปโหลดผ่านระบบ');
  var file=DriveApp.getFileById(match[1]);
  if(!file||file.isTrashed()||!isFileInSystemFolder_(file,'Products'))throw new Error('ไม่พบไฟล์วิดีโอในโฟลเดอร์ Products');
  var mime=String(file.getMimeType()||'').toLowerCase();
  if(['video/mp4','video/webm','video/quicktime'].indexOf(mime)<0)throw new Error('ชนิดไฟล์วิดีโอไม่รองรับ');
  var description=String(file.getDescription()||'');
  if(description.indexOf('EcommerceProductVideo|')!==0)throw new Error('ไฟล์นี้ไม่ใช่วิดีโอสินค้าที่อัปโหลดผ่านระบบ');
  if(sellerId&&description!=='EcommerceProductVideo|seller|'+String(sellerId))throw new Error('ผู้ขายไม่มีสิทธิ์ใช้ไฟล์วิดีโอนี้');
  if(file.getSize()>MAX_PRODUCT_VIDEO_BYTES_)throw new Error('วิดีโอมีขนาดเกิน 10 MB');
  return ref;
}

function uploadFile(token,payload){
  try{
    payload=payload||{};var account='admin',actor='';
    var chatThread=null;
    if(payload.accountType==='customer'){
      var c=requireCustomer_(token);actor=c.id;account='customer';
      if(String(payload.folder||'')==='ChatMessages'){chatThread=readTable_('ChatThreads',false).filter(function(t){return t.id===String(payload.threadId||'')&&t.customerId===c.id&&t.status!=='Closed';})[0];if(!chatThread)throw new Error('ไม่มีสิทธิ์แนบรูปในห้องแชตนี้');}
    }else if(payload.accountType==='seller'){
      var seller=requireSeller_(token);actor=seller.store.id;account='seller';
      if(String(payload.folder||'')==='ChatMessages'){chatThread=readTable_('ChatThreads',false).filter(function(t){return t.id===String(payload.threadId||'')&&t.sellerId===seller.store.id&&t.status!=='Closed';})[0];if(!chatThread)throw new Error('ไม่มีสิทธิ์แนบรูปในห้องแชตนี้');}
    }else if(payload.accountType==='guest'){
      var guestOrder=readTable_('Orders',false).filter(function(o){return o.id===payload.orderId&&!o.customerId&&o.guestAccessToken===token;})[0];
      if(!guestOrder)throw new Error('ไม่มีสิทธิ์อัปโหลดหลักฐานสำหรับคำสั่งซื้อนี้');
      if(guestOrder.orderStatus==='Cancelled'||guestOrder.orderStatus==='Refunded'||guestOrder.paymentStatus==='Verified'||['bank_transfer','qr_payment'].indexOf(guestOrder.paymentMethod)<0)throw new Error('คำสั่งซื้อนี้ไม่สามารถส่งหลักฐานได้');
      actor='Guest:'+guestOrder.orderNumber;account='guest';
    }else{
      var u=requireAdmin_(token,'files.upload');actor=u.username;
    }
    var data=String(payload.base64||payload.data||'');var base=data.indexOf(',')>=0?data.substring(data.indexOf(',')+1):data;
    var bytes=Utilities.base64Decode(base);
    var mime=text_(payload.mimeType||'application/octet-stream',120).toLowerCase();
    var name=text_(payload.filename||payload.name||'upload',180).replace(/[\\/:*?"<>|]/g,'_');
    var folderName=text_(payload.folder||'Products',60);
    var isImage=mime.indexOf('image/')===0;
    var isProductVideoUpload=String(payload.purpose||'')==='product-video';
    var isFaviconUpload=String(payload.purpose||'')==='favicon';
    if(bytes.length>(isProductVideoUpload?MAX_PRODUCT_VIDEO_BYTES_:MAX_UPLOAD_BYTES_))throw new Error(isProductVideoUpload?'วิดีโอต้องมีขนาดไม่เกิน 10 MB':'ไฟล์มีขนาดเกิน 5 MB');
    if(isProductVideoUpload){
      if((account!=='admin'&&account!=='seller')||folderName!=='Products')throw new Error('อัปโหลดวิดีโอได้เฉพาะผู้ดูแลระบบหรือเจ้าของร้านในหมวด Products');
      if(['video/mp4','video/webm','video/quicktime'].indexOf(mime)<0)throw new Error('รองรับวิดีโอ MP4, WebM และ MOV เท่านั้น');
    }
    if(isFaviconUpload){
      if(account!=='admin'||folderName!=='Website'||!isImage)throw new Error('ไอคอนเว็บไซต์อัปโหลดได้เฉพาะผู้ดูแลระบบในหมวด Website');
      var supportedFaviconMime=['image/png','image/jpeg','image/gif','image/bmp'];
      if(supportedFaviconMime.indexOf(mime)<0)throw new Error('Favicon รองรับ PNG, JPG, GIF หรือ BMP กรุณาแปลงรูปเป็น PNG แล้วอัปโหลดอีกครั้ง');
      try{
        var faviconBlob=Utilities.newBlob(bytes,mime,name).getAs('image/png');
        bytes=faviconBlob.getBytes();
        mime='image/png';
        name='favicon_'+Utilities.getUuid().replace(/-/g,'').substring(0,12)+'.png';
      }catch(faviconConvertError){
        throw new Error('แปลงรูป Favicon เป็น PNG ไม่สำเร็จ กรุณาใช้ไฟล์ PNG ขนาดสี่เหลี่ยม');
      }
    }
    if((account==='customer'||account==='guest') && (account==='guest' ? folderName!=='Payments' : (['Payments','Reviews','ChatMessages'].indexOf(folderName)<0 && !(folderName==='Customers'&&payload.purpose==='profile')))) throw new Error('บัญชีนี้ไม่มีสิทธิ์อัปโหลดในโฟลเดอร์ที่เลือก');
    if(account==='seller'&&['Products','Banners','ChatMessages'].indexOf(folderName)<0)throw new Error('ผู้ขายอัปโหลดได้เฉพาะรูปสินค้า รูปหน้าร้าน และรูปแชต');
    if(account==='seller'&&!isImage&&!isProductVideoUpload)throw new Error('ผู้ขายอัปโหลดได้เฉพาะไฟล์รูปภาพและวิดีโอสินค้า');
    if(account==='customer'&&folderName==='Payments'){
      var customerOrder=readTable_('Orders',false).filter(function(o){return o.id===payload.orderId&&o.customerId===actor;})[0];
      if(!customerOrder||customerOrder.orderStatus==='Cancelled'||customerOrder.orderStatus==='Refunded'||customerOrder.paymentStatus==='Verified'||['bank_transfer','qr_payment'].indexOf(customerOrder.paymentMethod)<0)throw new Error('ไม่มีสิทธิ์ส่งหลักฐานสำหรับคำสั่งซื้อนี้');
    }
    if((account==='customer'||account==='guest')&&!isImage)throw new Error('กรุณาอัปโหลดไฟล์รูปภาพ');
    if(!isImage&&!isProductVideoUpload&&(folderName!=='Documents'||account!=='admin'))throw new Error('อนุญาตให้อัปโหลดเฉพาะไฟล์รูปภาพในหมวดนี้');
    var isProfileImage=payload.purpose==='profile'&&folderName==='Customers'&&isImage;
    if(account==='customer'&&folderName==='Customers'&&!isProfileImage)throw new Error('ลูกค้าสามารถอัปโหลดในโฟลเดอร์ Customers ได้เฉพาะรูปโปรไฟล์ของตนเอง');
    var publicFolders=['Products','Categories','Banners','Website'];
    var isPublicSiteImage=payload.visibility==='public'&&(account==='admin'||account==='seller')&&publicFolders.indexOf(folderName)>=0&&isImage;
    if(payload.visibility==='public'&&isImage&&!isPublicSiteImage&&!isProfileImage)throw new Error('โฟลเดอร์นี้ไม่ได้รับอนุญาตให้แสดงเป็นรูปภาพของเว็บไซต์');
    if(isProfileImage&&account!=='customer'&&account!=='admin')throw new Error('บัญชีนี้ไม่มีสิทธิ์จัดการรูปโปรไฟล์');

    var isChatImage=folderName==='ChatMessages'&&!!chatThread&&isImage;
    var displayable=isPublicSiteImage||isProfileImage;
    if(displayable||isChatImage)ensureDriveAssetsTable_();
    // Drive assets are private by default and served through the asset registry.
    // The only exception is the explicitly configured public Website Favicon,
    // because browser tabs fetch it directly from its URL outside this app.
    var root=DriveApp.getFolderById(FOLDER_ID);var folder=getOrCreateFolder_(root,folderName);
    var blob=Utilities.newBlob(bytes,mime,name);var file=folder.createFile(blob);
    var faviconPublicLink=false;
    if(isFaviconUpload){
      // A browser tab requests its favicon directly and cannot call the private
      // Apps Script image-data API. Make ONLY this branding icon public by link.
      try{
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK,DriveApp.Permission.VIEW);
        faviconPublicLink=file.getSharingAccess()===DriveApp.Access.ANYONE_WITH_LINK||file.getSharingAccess()===DriveApp.Access.ANYONE;
        if(!faviconPublicLink)throw new Error('Google Drive ไม่ยืนยันสิทธิ์ Anyone with the link');
      }catch(faviconShareError){
        try{file.setTrashed(true);}catch(ignoreTrashFavicon){}
        throw new Error('อัปโหลด Favicon ไม่สำเร็จ เพราะ Google Drive ไม่อนุญาตให้เปิดอ่านรูปไอคอนแบบ Anyone with the link กรุณาตรวจนโยบายการแชร์ของ Drive: '+String(faviconShareError.message||faviconShareError).substring(0,140));
      }
    }
    if(folderName==='Payments'&&(account==='customer'||account==='guest'))file.setDescription('EcommercePaymentProof|'+text_(payload.orderId,100)+'|'+account+'|'+actor);
    if(isProfileImage)file.setDescription('EcommerceCustomerProfile|'+actor);
    if(isPublicSiteImage)file.setDescription('EcommerceSiteImage|'+folderName+'|'+account+'|'+actor+(isFaviconUpload?'|favicon':''));
    if(isProductVideoUpload)file.setDescription('EcommerceProductVideo|'+account+'|'+actor);

    var assetToken='';
    if(displayable||isChatImage){
      assetToken=Utilities.getUuid().replace(/-/g,'')+Utilities.getUuid().replace(/-/g,'').substring(0,8);
      appendRecord_('DriveAssets',{id:assetToken,fileId:file.getId(),mimeType:mime,folder:folderName,access:isPublicSiteImage?'public':(isChatImage?'chat':'owner'),ownerType:account,ownerId:actor,purpose:isChatImage?'chat:'+chatThread.id:(isProfileImage?'profile':text_(payload.purpose||'site-image',60)),status:'Active',createdAt:now_()});
    }
    var url=isProductVideoUpload?'drive-private://'+file.getId():(isChatImage?'drive-asset://'+assetToken:((isProfileImage||isPublicSiteImage)?driveProfileImageUrl_(file.getId()):'https://drive.google.com/file/d/'+file.getId()+'/view'));
    var profileImageSaved = false;
    // Persist customer profile URL immediately after Drive upload. This avoids
    // relying on a separate modal Save click to write Customers.profileImage.
    if (isProfileImage && account === 'customer') {
      url = persistCustomerProfileImage_(actor, file.getId());
      profileImageSaved = true;
    }
    var auditWarning='';try{log_('Upload','Drive',folderName+'/'+name,actor);}catch(logError){auditWarning='บันทึกไฟล์สำเร็จ แต่บันทึก Audit Log ไม่สำเร็จ: '+String(logError.message||logError).substring(0,160);}
    var successMessage = displayable ? 'อัปโหลดไฟล์สำเร็จและเก็บต้นฉบับเป็นส่วนตัวใน Google Drive' : 'บันทึกไฟล์เป็นส่วนตัวใน Google Drive สำเร็จ';
    if (profileImageSaved) successMessage = 'อัปโหลดรูปโปรไฟล์และบันทึก URL ลง Customers.profileImage ใน Google Sheets แล้ว';
    if (isFaviconUpload) successMessage = 'อัปโหลด Favicon สำเร็จ ไฟล์ไอคอนนี้เปิดอ่านแบบ Anyone with the link เพื่อให้ Browser Tab ของผู้เข้าชมโหลดได้ ส่วนไฟล์อื่นยังเป็นส่วนตัว';
    if (isProductVideoUpload) successMessage = 'อัปโหลดวิดีโอสินค้าสำเร็จและเก็บไฟล์เป็นส่วนตัวใน Google Drive';
    return ok_({fileId:file.getId(),assetToken:assetToken,name:file.getName(),filename:file.getName(),url:url,profileUrl:isProfileImage?driveProfileImageUrl_(file.getId()):'',profileImageSaved:profileImageSaved,profileImageColumn:profileImageSaved?'Customers.profileImage':'',mimeType:mime,size:bytes.length,public:isPublicSiteImage,displayable:displayable,driveVisibility:faviconPublicLink?'PUBLIC_LINK':'PRIVATE',sharingStatus:faviconPublicLink?'ANYONE_WITH_LINK':'PRIVATE',privateVideo:isProductVideoUpload,warning:auditWarning},successMessage);
  }catch(e){return fail_(safeError_(e));}
}

function extractDriveIdFromAssetValue_(value){
  var s=String(value||'').trim();if(!s)return '';
  var m=s.match(/^drive-asset:\/\/([A-Za-z0-9_-]{20,80})$/i);if(m)return m[1];
  m=s.match(/^drive-private:\/\/([A-Za-z0-9_-]{10,})$/i);if(m)return m[1];
  m=s.match(/lh\d*\.googleusercontent\.com\/d\/([A-Za-z0-9_-]{10,})/i);if(m)return m[1];
  m=s.match(/drive\.google\.com\/file\/d\/([A-Za-z0-9_-]{10,})/i);if(m)return m[1];
  m=s.match(/[?&]id=([A-Za-z0-9_-]{10,})/i);if(m)return m[1];
  return '';
}

function legacyPublicImageIsReferenced_(fileId,folderName){
  var target=String(fileId||'');
  function matches(v){return extractDriveIdFromAssetValue_(v)===target;}
  if(folderName==='Products'){
    return readTable_('Products',true).some(function(p){if(matches(p.coverImage)||matches(p.campaignImage))return true;return safeArray_(safeJson_(p.images,[])).some(matches);});
  }
  if(folderName==='Categories')return readTable_('Categories',true).some(function(r){return matches(r.image);});
  if(folderName==='Banners'){
    if(readTable_('Banners',true).some(function(r){return matches(r.image);}))return true;
    if(readTable_('Stores',true).some(function(r){return matches(r.logo)||matches(r.banner);}))return true;
    return readTable_('LiveRooms',true).some(function(r){return matches(r.thumbnail);});
  }
  if(folderName==='Website'){
    var keys=['logo','favicon','setFaviconUrl','heroImage','bankQrImage'];
    return keys.some(function(k){return matches(getSettingValue_(k));});
  }
  if(folderName==='Reviews'){
    return readTable_('Reviews',true).some(function(r){return r.status==='Published'&&safeArray_(safeJson_(r.images,[])).some(matches);});
  }
  return false;
}

function getDriveImageDataBatch(token,assetTokens){
  try{
    var ids=safeArray_(assetTokens).map(function(x){return text_(x,100);}).filter(Boolean).slice(0,3);
    var assets=readTable_('DriveAssets',true);
    var customer=null,adminCustomer=null,sellerContext=null;
    if(token){try{customer=requireCustomer_(token);}catch(ignoreCustomer){}try{adminCustomer=requireAdmin_(token,'customers.view');}catch(ignoreAdmin){}try{sellerContext=requireSeller_(token);}catch(ignoreSeller){}}
    var output=[],totalBytes=0;
    ids.forEach(function(key){
      try{
        var asset=assets.filter(function(a){return (a.id===key||a.fileId===key)&&a.status==='Active';})[0];
        var fileId=asset?asset.fileId:key;
        if(!/^[A-Za-z0-9_-]{10,100}$/.test(fileId))throw new Error('รหัสรูปภาพไม่ถูกต้อง');
        var file=DriveApp.getFileById(fileId);if(file.isTrashed())throw new Error('ไม่พบรูปภาพ');
        var mime=String(file.getMimeType()||'').toLowerCase();if(mime.indexOf('image/')!==0)throw new Error('อนุญาตเฉพาะไฟล์รูปภาพ');
        var allowed=false,folderName=asset?asset.folder:'';
        var publicFolders=['Products','Categories','Banners','Website'];
        if(asset){
          if(asset.access==='public'&&publicFolders.indexOf(folderName)>=0&&isFileInSystemFolder_(file,folderName))allowed=true;
          else if(asset.access==='owner'&&folderName==='Customers'&&isFileInSystemFolder_(file,'Customers')){
            if(customer&&asset.ownerType==='customer'&&asset.ownerId===customer.id)allowed=true;
            if(adminCustomer)allowed=true;
          }else if(asset.access==='chat'&&folderName==='ChatMessages'&&isFileInSystemFolder_(file,'ChatMessages')){
            var chatThreadId=String(asset.purpose||'').indexOf('chat:')===0?String(asset.purpose).substring(5):'';
            var chatThread=chatThreadId?readTable_('ChatThreads',true).filter(function(t){return t.id===chatThreadId;})[0]:null;
            if(chatThread&&customer&&chatThread.customerId===customer.id&&((asset.ownerType==='customer'&&asset.ownerId===customer.id)||(asset.ownerType==='seller'&&asset.ownerId===chatThread.sellerId)))allowed=true;
            if(chatThread&&sellerContext&&chatThread.sellerId===sellerContext.store.id&&((asset.ownerType==='seller'&&asset.ownerId===sellerContext.store.id)||(asset.ownerType==='customer'&&asset.ownerId===chatThread.customerId)))allowed=true;
            if(chatThread&&adminCustomer)allowed=true;
          }
        }else{
          // Backward compatibility for legacy URLs: allow only files referenced
          // by public catalogue/settings records, never arbitrary Drive IDs.
          for(var i=0;i<publicFolders.length;i++){if(isFileInSystemFolder_(file,publicFolders[i])&&legacyPublicImageIsReferenced_(fileId,publicFolders[i])){allowed=true;break;}}
          if(!allowed&&isFileInSystemFolder_(file,'Customers')){
            var desc=String(file.getDescription()||'');
            if(customer&&desc==='EcommerceCustomerProfile|'+customer.id)allowed=true;
            if(!allowed&&customer){allowed=readTable_('Customers',true).some(function(c){return c.id===customer.id&&extractDriveIdFromAssetValue_(c.profileImage)===fileId;});}
            if(adminCustomer)allowed=true;
          }
        }
        if(!allowed)throw new Error('ไม่มีสิทธิ์ดูรูปภาพนี้');
        var isCurrentFavicon=folderName==='Website'&&extractDriveIdFromAssetValue_(getSettingValue_('setFaviconUrl')||getSettingValue_('favicon'))===fileId;
        var size=file.getSize();if(size>MAX_UPLOAD_BYTES_)throw new Error('รูปภาพมีขนาดเกินกำหนด 5 MB');
        if(totalBytes+size>9*1024*1024)throw new Error('ชุดรูปภาพมีขนาดรวมมากเกินไป กรุณาโหลดใหม่อีกครั้ง');
        totalBytes+=size;
        var imageBlob=file.getBlob();
        if(isCurrentFavicon&&mime!=='image/png'){
          try{imageBlob=imageBlob.getAs('image/png');mime='image/png';}
          catch(faviconConvertReadError){/* Keep the original MIME; the browser will try a client-side PNG conversion. */}
        }
        var imageBytes=imageBlob.getBytes();
        var b64=Utilities.base64Encode(imageBytes);
        output.push({key:key,success:true,mimeType:mime,base64:b64,size:imageBytes.length});
      }catch(itemError){output.push({key:key,success:false,message:String(itemError&&itemError.message?itemError.message:'ไม่สามารถเปิดรูปภาพได้').substring(0,180)});}
    });
    return ok_(output,'โหลดรูปภาพแล้ว');
  }catch(e){return fail_(safeError_(e));}
}

function getProductVideoData(token,productId){
  try{
    var product=readTable_('Products',true).filter(function(p){return String(p.id)===String(productId);})[0];
    if(!product)throw new Error('ไม่พบสินค้า');
    var allowedInactive=false;
    if(token){
      try{requireAdmin_(token,'products.view');allowedInactive=true;}catch(ignoreAdminVideo){}
      if(!allowedInactive){
        try{var seller=requireSeller_(token);if(String(product.sellerId||'')===String(seller.store.id))allowedInactive=true;}catch(ignoreSellerVideo){}
      }
    }
    if(product.status!=='Active'&&!allowedInactive)throw new Error('สินค้านี้ยังไม่เปิดให้เข้าชม');
    if(product.sellerId&&!readTable_('Stores',true).some(function(st){return st.id===product.sellerId&&st.status==='Active';})&&!allowedInactive)throw new Error('ร้านค้านี้ยังไม่เปิดให้บริการ');
    var match=String(product.videoUrl||'').match(/^drive-private:\/\/([A-Za-z0-9_-]{10,100})$/i);
    if(!match)throw new Error('สินค้านี้ไม่มีวิดีโอที่อัปโหลดไว้ในระบบ');
    var file=DriveApp.getFileById(match[1]);
    if(!file||file.isTrashed()||!isFileInSystemFolder_(file,'Products'))throw new Error('ไม่พบไฟล์วิดีโอสินค้า');
    if(String(file.getDescription()||'').indexOf('EcommerceProductVideo|')!==0)throw new Error('ไฟล์วิดีโอไม่ผ่านการตรวจสอบ');
    var mime=String(file.getMimeType()||'').toLowerCase();
    if(['video/mp4','video/webm','video/quicktime'].indexOf(mime)<0)throw new Error('ชนิดไฟล์วิดีโอไม่รองรับ');
    var size=file.getSize();if(size>MAX_PRODUCT_VIDEO_BYTES_)throw new Error('วิดีโอมีขนาดเกิน 10 MB');
    var blob=file.getBlob(),bytes=blob.getBytes();
    return ok_({mimeType:mime,base64:Utilities.base64Encode(bytes),filename:file.getName(),size:bytes.length},'โหลดวิดีโอสินค้าแล้ว');
  }catch(e){return fail_(safeError_(e));}
}
/**
 * One-time privacy migration for the app's Drive tree.
 * This removes broad link/public access from the root folder, known app folders,
 * nested folders and files. It does not delete files. Run manually after reviewing
 * that the configured FOLDER_ID is dedicated to this Marketplace.
 */
function secureExistingMarketplaceFiles() {
  var report = { foldersProcessed: 0, foldersSecured: 0, filesProcessed: 0, filesSecured: 0, failures: [], complete: false };
  var maxFailures = 100;
  function recordFailure(type, name, error) {
    if (report.failures.length < maxFailures) report.failures.push({ type: type, name: String(name || '').substring(0, 160), error: String(error && error.message ? error.message : error).substring(0, 180) });
  }
  function secureFolderTree(folder) {
    report.foldersProcessed++;
    try { folder.setSharing(DriveApp.Access.PRIVATE, DriveApp.Permission.NONE); report.foldersSecured++; }
    catch (folderError) { recordFailure('folder', folder.getName(), folderError); }
    var files = folder.getFiles();
    while (files.hasNext()) {
      var file = files.next(); report.filesProcessed++;
      try { file.setSharing(DriveApp.Access.PRIVATE, DriveApp.Permission.NONE); report.filesSecured++; }
      catch (fileError) { recordFailure('file', folder.getName() + '/' + file.getName(), fileError); }
    }
    var children = folder.getFolders();
    while (children.hasNext()) secureFolderTree(children.next());
  }
  try {
    var root = DriveApp.getFolderById(FOLDER_ID);
    secureFolderTree(root);
    report.complete = report.failures.length === 0;
    Logger.log('DRIVE_PRIVACY_MIGRATION=' + JSON.stringify(report));
    return report;
  } catch (error) {
    recordFailure('root', FOLDER_ID, error);
    Logger.log('DRIVE_PRIVACY_MIGRATION=' + JSON.stringify(report));
    throw new Error('ปรับสิทธิ์ Drive ไม่ครบ: ' + safeError_(error) + ' | รายงาน: ' + JSON.stringify(report));
  }
}

function deleteFile(token,fileId){try{var user=requireAdmin_(token,'files.manage');var file=DriveApp.getFileById(fileId);var parents=file.getParents(),found=false,allowed={};var root=DriveApp.getFolderById(FOLDER_ID),folders=root.getFolders();allowed[FOLDER_ID]=true;while(folders.hasNext())allowed[folders.next().getId()]=true;while(parents.hasNext()){if(allowed[parents.next().getId()])found=true;}if(!found)throw new Error('ไฟล์นี้ไม่ได้อยู่ในโฟลเดอร์ของระบบ');file.setTrashed(true);log_('Delete File','Drive',fileId,user.username);return ok_(true,'ลบไฟล์แล้ว');}catch(e){return fail_(safeError_(e));}}

/* ----------------------------------- USERS -------------------------------- */
function getUsers(token){try{requireAdmin_(token,'users.view');return ok_(readTable_('Users',false).map(function(u){return publicUser_(u);}));}catch(e){return fail_(safeError_(e));}}
function saveUser(token,data){try{var actor=requireAdmin_(token,'users.manage');data=data||{};var id=text_(data.id,100)||newId_('USR'),old=readTable_('Users',false).filter(function(x){return x.id===id;})[0];var username=text_(data.username,80).toLowerCase();if(!username)throw new Error('กรุณาระบุ Username');if(actor.role!=='Super Admin'&&['Super Admin','Admin'].indexOf(String(data.role))>=0)throw new Error('เฉพาะ Super Admin เท่านั้นที่กำหนดบทบาท Admin หรือ Super Admin ได้');if(!old&&!data.password)throw new Error('กรุณากำหนดรหัสผ่านเริ่มต้นสำหรับผู้ใช้ใหม่');var duplicate=readTable_('Users',false).some(function(x){return x.id!==id&&String(x.username).toLowerCase()===username;});if(duplicate)throw new Error('Username นี้ถูกใช้แล้ว');var row={id:id,username:username,email:text_(data.email,160).toLowerCase(),passwordHash:old?old.passwordHash:hashPassword_(text_(data.password||Utilities.getUuid(),100)),name:text_(data.name,120),role:text_(data.role||'Editor',50),permissions:JSON.stringify(safeArray_(data.permissions)),status:text_(data.status||'Active',30),mustChangePassword:old?old.mustChangePassword:true,createdAt:old?old.createdAt:now_(),updatedAt:now_()};if(old&&data.password)row.passwordHash=hashPassword_(data.password);upsertById_('Users',row);log_('Save User','Users',username,actor.username);return ok_(publicUser_(row),'บันทึกผู้ใช้งานแล้ว');}catch(e){return fail_(safeError_(e));}}
function deleteUser(token,id){try{var actor=requireAdmin_(token,'users.manage');var me=id===actor.id;if(me)throw new Error('ไม่สามารถลบบัญชีที่กำลังใช้งานได้');updateRecord_('Users',id,{status:'Disabled',updatedAt:now_()});log_('Disable User','Users',id,actor.username);return ok_(true,'ปิดใช้งานผู้ใช้แล้ว');}catch(e){return fail_(safeError_(e));}}

/* --------------------------------- REPORTS -------------------------------- */
function getDashboardStats(token){
  try{
    requireAdmin_(token,'reports.view');var cache=CacheService.getScriptCache(),raw=cache.get('dashboard');if(raw)return ok_(safeJson_(raw,{}));
    var orders=readTable_('Orders',false),products=readTable_('Products',false),customers=readTable_('Customers',false),inventory=readTable_('Inventory',false),today=new Date(),day=today.toISOString().substring(0,10),month=day.substring(0,7),year=day.substring(0,4);
    var paid=orders.filter(function(o){return o.paymentStatus==='Verified'&&o.orderStatus!=='Cancelled'&&o.orderStatus!=='Refunded';});
    function sum(list,fn){return list.reduce(function(s,x){return s+number_(fn(x),0);},0);}
    var stats={todaySales:sum(paid.filter(function(o){return String(o.createdAt).substring(0,10)===day;}),function(o){return o.grandTotal;}),yesterdaySales:sum(paid.filter(function(o){var d=new Date();d.setDate(d.getDate()-1);return String(o.createdAt).substring(0,10)===d.toISOString().substring(0,10);}),function(o){return o.grandTotal;}),monthSales:sum(paid.filter(function(o){return String(o.createdAt).substring(0,7)===month;}),function(o){return o.grandTotal;}),yearSales:sum(paid.filter(function(o){return String(o.createdAt).substring(0,4)===year;}),function(o){return o.grandTotal;}),totalSales:sum(paid,function(o){return o.grandTotal;}),orderCount:orders.length,pendingOrders:orders.filter(function(o){return ['Pending','Awaiting Payment','Processing','Packed'].indexOf(o.orderStatus)>=0;}).length,awaitingPayment:orders.filter(function(o){return o.paymentStatus==='Unpaid'||o.paymentStatus==='Pending Verification';}).length,productCount:products.length,lowStock:inventory.filter(function(i){return number_(i.quantity,0)-number_(i.reserved,0)<=number_(i.minimumStock,0);}).length,outOfStock:inventory.filter(function(i){return number_(i.quantity,0)-number_(i.reserved,0)<=0;}).length,customerCount:customers.length,netRevenue:sum(paid,function(o){return number_(o.grandTotal,0)-number_(o.tax,0);})};
    try{cache.put('dashboard',JSON.stringify(stats),60);}catch(e){}return ok_(stats);
  }catch(e){return fail_(safeError_(e));}
}
function getSalesReports(token,filters){
  try{requireAdmin_(token,'reports.view');filters=filters||{};var orders=readTable_('Orders',false).filter(function(o){return o.paymentStatus==='Verified'&&o.orderStatus!=='Cancelled';});var start=filters.startDate?new Date(filters.startDate).getTime():0,end=filters.endDate?new Date(filters.endDate+'T23:59:59').getTime():Date.now();orders=orders.filter(function(o){var t=new Date(o.createdAt).getTime();return t>=start&&t<=end;});var byDay={},byPayment={},top={},allOrderItems=readTable_('OrderItems',false);orders.forEach(function(o){var d=String(o.createdAt).substring(0,10);byDay[d]=(byDay[d]||0)+number_(o.grandTotal,0);byPayment[o.paymentMethod]=(byPayment[o.paymentMethod]||0)+number_(o.grandTotal,0);allOrderItems.filter(function(i){return i.orderId===o.id;}).forEach(function(i){top[i.productName]=(top[i.productName]||0)+number_(i.quantity,0);});});var days=Object.keys(byDay).sort();return ok_({orders:orders,labels:days,sales:days.map(function(d){return byDay[d];}),paymentMethods:Object.keys(byPayment).map(function(k){return {name:k,value:byPayment[k]};}),topProducts:Object.keys(top).sort(function(a,b){return top[b]-top[a];}).slice(0,10).map(function(k){return {name:k,quantity:top[k]};}),total:orders.reduce(function(s,o){return s+number_(o.grandTotal,0);},0)});}catch(e){return fail_(safeError_(e));}
}
function recordVisitor(clientKey,userAgent){
  try{var date=new Date().toISOString().substring(0,10),hash=sha256_(text_(clientKey,200)+'|'+date),rows=readTable_('Visitors',false),found=rows.filter(function(x){return x.date===date&&x.ipHash===hash;})[0];if(found)updateRecord_('Visitors',found.id,{count:number_(found.count,0)+1});else appendRecord_('Visitors',{id:newId_('VIS'),date:date,ipHash:hash,userAgent:text_(userAgent,250),count:1,createdAt:now_()});return ok_(true);}catch(e){return fail_(safeError_(e));}
}
function getVisitorStats(token){try{requireAdmin_(token,'reports.view');var rows=readTable_('Visitors',false),today=new Date().toISOString().substring(0,10),month=today.substring(0,7),year=today.substring(0,4);return ok_({today:rows.filter(function(x){return x.date===today;}).length,yesterday:rows.filter(function(x){var d=new Date();d.setDate(d.getDate()-1);return x.date===d.toISOString().substring(0,10);}).length,month:rows.filter(function(x){return String(x.date).substring(0,7)===month;}).length,year:rows.filter(function(x){return String(x.date).substring(0,4)===year;}).length,total:rows.length,onlineApprox:rows.filter(function(x){return x.createdAt&&Date.now()-new Date(x.createdAt).getTime()<5*60*1000;}).length});}catch(e){return fail_(safeError_(e));}}

/* ----------------------------------- LOGS --------------------------------- */
function log_(action,module,detail,username){try{appendRecord_('Logs',{id:newId_('LOG'),username:username||'System',action:text_(action,100),module:text_(module,80),detail:text_(detail,1000),timestamp:now_()});}catch(e){}}
function getOwnerNotificationSummary(token){
  try{
    var user=requireAdmin_(token,'');
    if(user.role!=='Super Admin')throw new Error('เฉพาะเจ้าของระบบเท่านั้นที่ดูการแจ้งเตือนนี้ได้');
    var out=[],stores=readTable_('Stores',false),orders=readTable_('Orders',false),returns=readTable_('ReturnRequests',false),payouts=readTable_('SellerPayouts',false);
    var pendingStores=stores.filter(function(x){return ['Pending','Pending Review','Awaiting Approval'].indexOf(x.status)>=0;});
    if(pendingStores.length)out.push({id:'stores',title:'ร้านค้ารออนุมัติ',message:'มีร้านค้ารอการตรวจสอบและอนุมัติ',count:pendingStores.length,page:'sellers',type:'warning',icon:'fa-store',timeLabel:'ต้องดำเนินการ'});
    var pendingPayments=orders.filter(function(x){return x.paymentStatus==='Pending Verification';});
    if(pendingPayments.length)out.push({id:'payments',title:'รอตรวจสอบการชำระเงิน',message:'มีคำสั่งซื้อที่ส่งหลักฐานการชำระเงิน',count:pendingPayments.length,page:'payments',type:'warning',icon:'fa-money-bill-wave',timeLabel:'ต้องดำเนินการ'});
    var pendingReturns=returns.filter(function(x){return ['Pending Seller Review','Refund Pending','Pending Admin Review'].indexOf(x.status)>=0;});
    if(pendingReturns.length)out.push({id:'returns',title:'คำขอคืนสินค้า/คืนเงิน',message:'มีคำขอที่กำลังรอตรวจสอบ',count:pendingReturns.length,page:'marketplaceReturns',type:'danger',icon:'fa-rotate-left',timeLabel:'ต้องดำเนินการ'});
    var pendingPayouts=payouts.filter(function(x){return x.status==='Pending';});
    if(pendingPayouts.length)out.push({id:'payouts',title:'ยอดจ่ายผู้ขายรอดำเนินการ',message:'มีรายการจ่ายเงินผู้ขายที่ยังไม่เสร็จสิ้น',count:pendingPayouts.length,page:'marketplacePayouts',type:'info',icon:'fa-wallet',timeLabel:'รอดำเนินการ'});
    var pendingOrders=orders.filter(function(x){return ['Pending','Awaiting Payment'].indexOf(x.orderStatus)>=0&&x.paymentStatus!=='Pending Verification';});
    if(pendingOrders.length)out.push({id:'orders',title:'คำสั่งซื้อใหม่/รอดำเนินการ',message:'มีคำสั่งซื้อที่ต้องติดตามสถานะ',count:pendingOrders.length,page:'orders',type:'info',icon:'fa-receipt',timeLabel:'รอดำเนินการ'});
    return ok_(out);
  }catch(e){return fail_(safeError_(e));}
}
function getLogs(token,filters){try{requireAdmin_(token,'logs.view');var rows=readTable_('Logs',false);rows.sort(function(a,b){return new Date(b.timestamp)-new Date(a.timestamp);});return ok_(rows.slice(0,500));}catch(e){return fail_(safeError_(e));}}

/* ---------------------------------- BACKUP -------------------------------- */
function createBackup(token){
  try{var user=requireAdmin_(token,'backup.manage');var ss=getSpreadsheet_();var root=DriveApp.getFolderById(FOLDER_ID);var folder=getOrCreateFolder_(root,'Backup');var date=Utilities.formatDate(new Date(),Session.getScriptTimeZone(),'yyyy-MM-dd_HHmm');var file=DriveApp.getFileById(ss.getId()).makeCopy('Ecommerce_Backup_'+date,folder);if(!file||!file.getId())throw new Error('Google Drive ไม่ยืนยันการสร้างไฟล์สำรอง');var record={id:newId_('BKP'),fileId:file.getId(),fileName:file.getName(),createdBy:user.username,createdAt:now_(),status:'Success'};appendRecord_('Backups',record);log_('Create Backup','Backup',file.getName(),user.username);return ok_(record,'สำรองข้อมูลสำเร็จ');}catch(e){return fail_(safeError_(e));}
}
function getBackups(token){try{requireAdmin_(token,'backup.manage');return ok_(readTable_('Backups',false).sort(function(a,b){return new Date(b.createdAt)-new Date(a.createdAt);}));}catch(e){return fail_(safeError_(e));}}

/* -------------------------------- DEMO DATA ------------------------------- */
function createDemoData(token){
  try{return withLock_(function(){var user=requireAdmin_(token,'demo.manage');var now=now_();var cats=[{id:'DEMO_CATEGORY_001',name:'อุปกรณ์ไอที',slug:'it-accessories',description:'อุปกรณ์เสริมไอที',image:'',parentId:'',order:1,status:'Active',createdAt:now,updatedAt:now},{id:'DEMO_CATEGORY_002',name:'ของใช้ในบ้าน',slug:'home',description:'สินค้าสำหรับบ้าน',image:'',parentId:'',order:2,status:'Active',createdAt:now,updatedAt:now}];cats.forEach(function(x){upsertById_('Categories',x);});
    var prods=[['DEMO_PRODUCT_001','DEMO-SKU-001','หูฟังไร้สาย','DEMO_CATEGORY_001',1290,990,25],['DEMO_PRODUCT_002','DEMO-SKU-002','เมาส์ไร้สาย','DEMO_CATEGORY_001',590,490,40],['DEMO_PRODUCT_003','DEMO-SKU-003','แก้วเก็บอุณหภูมิ','DEMO_CATEGORY_002',450,390,30],['DEMO_PRODUCT_004','DEMO-SKU-004','โคมไฟตั้งโต๊ะ','DEMO_CATEGORY_002',790,0,15]];
    prods.forEach(function(a){var p={id:a[0],sku:a[1],barcode:'',name:a[2],slug:slug_(a[2]),categoryId:a[3],brand:'Demo Brand',summary:'สินค้าตัวอย่างสำหรับทดสอบระบบ',description:'<p>รายละเอียดสินค้าตัวอย่าง</p>',coverImage:'',images:'[]',price:a[4],salePrice:a[5],costPrice:Math.round(a[4]*0.55),stock:a[6],unit:'ชิ้น',weight:0.5,featured:true,bestSeller:false,status:'Active',createdAt:now,updatedAt:now};upsertById_('Products',p);ensureInventory_(p.id,'',a[6],5);});
    upsertById_('Coupons',{id:'DEMO_COUPON_001',code:'DEMO10',discountType:'percent',discountValue:10,minimumOrder:300,maximumDiscount:200,usageLimit:100,usagePerCustomer:1,usedCount:0,startDate:'',endDate:'',status:'Active',createdAt:now});
    upsertById_('Promotions',{id:'DEMO_PROMOTION_001',name:'โปรโมชันทดลอง ลดพิเศษ',type:'percent',value:10,startDate:'',endDate:'',productIds:'',categoryIds:'',status:'Active',createdAt:now});
    upsertById_('Banners',{id:'DEMO_BANNER_001',title:'ช้อปสินค้าคุณภาพ',description:'ทดลองใช้งานหน้าร้านออนไลน์',image:'',url:'',buttonText:'เลือกซื้อสินค้า',position:'main',startDate:'',endDate:'',order:1,status:'Active',createdAt:now,updatedAt:now});
    var customer={id:'DEMO_CUSTOMER_001',username:'demo@example.com',passwordHash:hashPassword_('DemoPass123!'),firstname:'Demo',lastname:'Customer',phone:'0800000000',email:'demo@example.com',profileImage:'',status:'Active',createdAt:now,updatedAt:now};upsertById_('Customers',customer);
    upsertById_('Reviews',{id:'DEMO_REVIEW_001',productId:'DEMO_PRODUCT_001',customerId:customer.id,orderId:'DEMO_ORDER_001',rating:5,review:'สินค้าตัวอย่าง รีวิวสำหรับทดสอบ',images:'[]',status:'Published',createdAt:now});
    if(!readTable_('Orders',false).some(function(o){return o.id==='DEMO_ORDER_001';})){var order={id:'DEMO_ORDER_001',orderNumber:'DEMO-ORD-001',customerId:customer.id,customerName:'Demo Customer',phone:'0800000000',email:'demo@example.com',shippingAddress:JSON.stringify({recipient:'Demo Customer',phone:'0800000000',address:'99/1 ถนนสุขุมวิท',district:'คลองเตย',province:'กรุงเทพมหานคร',postalCode:'10110',country:'Thailand'}),subtotal:990,discount:0,shippingFee:40,tax:0,grandTotal:1030,paymentMethod:'bank_transfer',paymentStatus:'Unpaid',orderStatus:'Awaiting Payment',shippingStatus:'Pending',trackingNumber:'',note:'DEMO DATA',idempotencyKey:'DEMO_IDEMPOTENCY',createdAt:now,updatedAt:now,paidAt:'',completedAt:''};appendRecord_('Orders',order);appendRecord_('OrderItems',{id:'DEMO_ORDER_ITEM_001',orderId:order.id,productId:'DEMO_PRODUCT_001',variantId:'',productName:'หูฟังไร้สาย',sku:'DEMO-SKU-001',image:'',unitPrice:990,quantity:1,subtotal:990});appendRecord_('Payments',{id:'DEMO_PAYMENT_001',orderId:order.id,paymentMethod:'bank_transfer',amount:1030,reference:'',proofFileId:'',proofUrl:'',paymentDate:'',status:'Unpaid',verifiedBy:'',verifiedAt:'',note:'Demo',createdAt:now});appendRecord_('Shipping',{id:'DEMO_SHIPPING_001',orderId:order.id,carrier:'',method:'standard',trackingNumber:'',shippingFee:40,status:'Pending',shippedAt:'',deliveredAt:'',createdAt:now});}
    clearRuntimeCaches_();log_('Create Demo','Demo','Created demo records',user.username);return ok_(true,'สร้างข้อมูล Demo สำเร็จ');});}catch(e){return fail_(safeError_(e));}
}
function clearDemoData(token){
  try{return withLock_(function(){
    var user=requireAdmin_(token,'demo.manage'),tables=Object.keys(SCHEMA_),count=0;
    tables.forEach(function(table){
      if(['Settings','Users','Sessions','Logs','Backups'].indexOf(table)>=0)return;
      count+=deleteRows_(table,function(row){return String(row.id||'').indexOf('DEMO_')===0;});
    });
    // Keep real carts and orders intact; prune only demo product references inside carts.
    var carts=readTable_('Carts',false);
    carts.forEach(function(cart){
      var items=safeArray_(safeJson_(cart.items,[]));
      var kept=items.filter(function(item){return String(item.productId||'').indexOf('DEMO_')!==0;});
      if(kept.length!==items.length)updateRecord_('Carts',cart.id,{items:JSON.stringify(kept),updatedAt:now_()});
    });
    // Revoke, but do not delete, sessions belonging to the demo customer.
    var demoCustomers=readTable_('Customers',false).filter(function(c){return String(c.id||'').indexOf('DEMO_')===0;});
    var demoIds=demoCustomers.map(function(c){return c.id;});
    readTable_('Sessions',false).filter(function(s){return s.accountType==='customer'&&demoIds.indexOf(s.userId)>=0&&!s.revokedAt;}).forEach(function(s){updateSessionRevoked_(s.tokenHash);});
    clearRuntimeCaches_();
    log_('Clear Demo','Demo','Removed '+count+' demo-owned records',user.username);
    return ok_({deleted:count},'ล้างข้อมูล Demo สำเร็จ');
  });}catch(e){return fail_(safeError_(e));}
}


/* ============================ MARKETPLACE LAYER ===========================
 * Multi-vendor marketplace capabilities. Seller APIs are always scoped to the
 * authenticated customer and their approved Store record.
 * ========================================================================== */
function requireSeller_(customerToken) {
  var customer=requireCustomer_(customerToken);
  var store=findRecordByExactColumn_('Stores','ownerCustomerId',customer.id);
  if(!store)throw new Error('ยังไม่มีร้านค้า กรุณาสมัครเปิดร้านก่อน');
  if(store.status!=='Active')throw new Error(store.status==='Pending'?'ใบสมัครร้านค้ากำลังรออนุมัติ':'ร้านค้าถูกระงับหรือยังไม่เปิดใช้งาน');
  return {customer:customer,store:store};
}
function publicStore_(s) {
  return {id:s.id,shopName:s.shopName,slug:s.slug,description:s.description,logo:s.logo,banner:s.banner,
    rating:number_(s.rating,0),followerCount:number_(s.followerCount,0),status:s.status,createdAt:s.createdAt};
}
function notify_(recipientType,recipientId,title,message,type,link) {
  try {
    if(!recipientId)return;
    // Respect customer in-app notification preferences. Security and account
    // recovery messages remain mandatory and are never suppressed here.
    if(String(recipientType)==='customer') {
      var kind=String(type||'').toLowerCase(),prefRows=[];
      try { if(getSpreadsheet_().getSheetByName('CustomerPreferences')) prefRows=readTable_('CustomerPreferences',true).filter(function(x){return x.customerId===recipientId;}); } catch(prefError) {}
      var pref=prefRows[0]||{};
      var isPromo=/promo|promotion|coupon|voucher|campaign/.test(kind);
      var isOrder=/order|payment|ship|delivery|return/.test(kind);
      if(isPromo && (!prefRows.length || pref.promotionNotifications===undefined || !parseBool_(pref.promotionNotifications)))return;
      if(isOrder && pref.orderNotifications!==undefined && !parseBool_(pref.orderNotifications))return;
    }
    appendRecord_('Notifications',{id:newId_('NTF'),recipientId:recipientId,recipientType:recipientType,title:text_(title,140),message:text_(message,500),type:text_(type,40),link:text_(link,200),isRead:false,createdAt:now_()});
  } catch(e) {}
}
function getMarketplaceStores(options) {
  try {
    options = options || {};
    var q = text_(options.search, 100).toLowerCase();
    var rows = readTable_('Stores', true).filter(function(store) {
      return store.status === 'Active' && (!q || [store.shopName, store.description].join(' ').toLowerCase().indexOf(q) >= 0);
    });
    var follows = readTable_('StoreFollows', true);
    var products = readTable_('Products', true);
    var reviews = readTable_('Reviews', true);
    // Aggregate all public store metrics in one pass instead of filtering Products,
    // Reviews and StoreFollows separately for every store.
    var productSellerById = Object.create(null);
    var storeMetrics = Object.create(null);
    function metricsForStore_(storeId) {
      var key = String(storeId || '');
      if (!storeMetrics[key]) storeMetrics[key] = {followers:0, products:0, ratingTotal:0, reviewCount:0};
      return storeMetrics[key];
    }
    products.forEach(function(product) {
      if (product.status !== 'Active' || !product.sellerId) return;
      var storeId = String(product.sellerId);
      productSellerById[String(product.id)] = storeId;
      metricsForStore_(storeId).products++;
    });
    follows.forEach(function(follow) {
      metricsForStore_(follow.storeId).followers++;
    });
    reviews.forEach(function(review) {
      if (review.status !== 'Published') return;
      var storeId = productSellerById[String(review.productId)];
      if (!storeId) return;
      var metrics = metricsForStore_(storeId);
      metrics.ratingTotal += number_(review.rating, 0);
      metrics.reviewCount++;
    });
    rows = rows.map(function(store) {
      var metrics = storeMetrics[String(store.id)] || {followers:0,products:0,ratingTotal:0,reviewCount:0};
      var rating = metrics.reviewCount ? metrics.ratingTotal / metrics.reviewCount : 0;
      return {
        id:store.id,shopName:store.shopName,slug:store.slug,description:store.description,
        logo:store.logo,banner:store.banner,rating:Math.round(rating * 10) / 10,
        followerCount:metrics.followers,productCount:metrics.products
      };
    });
    rows.sort(function(a,b) { return b.followerCount - a.followerCount; });
    var page = Math.max(1, number_(options.page, 1));
    var size = Math.min(60, Math.max(1, number_(options.pageSize, 24)));
    return ok_({items:rows.slice((page - 1) * size, page * size),total:rows.length,page:page,pages:Math.ceil(rows.length / size)});
  } catch (e) {
    return fail_(safeError_(e));
  }
}
function getMarketplaceStore(storeId) {
  try {
    var st=readTable_('Stores',false).filter(function(x){return x.id===storeId&&x.status==='Active';})[0];
    if(!st)throw new Error('ไม่พบร้านค้าหรือร้านค้ายังไม่เปิด');
    var info=publicStore_(st);
    var products=getProducts({storeId:storeId,page:1,pageSize:100});
    info.products=products.success?products.data.items:[];
    info.productCount=products.success?number_(products.data.total,info.products.length):info.products.length;
    var storeProductIds=readTable_('Products',true).filter(function(p){return p.sellerId===storeId&&p.status==='Active';}).map(function(p){return String(p.id);});
    var storeProductMap=Object.create(null);
    storeProductIds.forEach(function(id){storeProductMap[id]=true;});
    var storeReviews=readTable_('Reviews',true).filter(function(r){
      return storeProductMap[String(r.productId||'')]&&['Approved','Active','Published'].indexOf(String(r.status||'Approved'))>=0&&number_(r.rating,0)>0;
    });
    info.reviewCount=storeReviews.length;
    if(storeReviews.length){
      var ratingTotal=storeReviews.reduce(function(sum,r){return sum+number_(r.rating,0);},0);
      info.rating=Math.round((ratingTotal/storeReviews.length)*10)/10;
    }
    info.vouchers=readTable_('Coupons',true).filter(function(c){return c.sellerId===storeId&&c.status==='Active'&&(!c.startDate||new Date(c.startDate).getTime()<=Date.now())&&(!c.endDate||new Date(c.endDate).getTime()>=Date.now());}).map(function(c){return {id:c.id,code:c.code,title:c.title,discountType:c.discountType,discountValue:c.discountValue,minimumOrder:c.minimumOrder,endDate:c.endDate};});
    info.followers=readTable_('StoreFollows',true).filter(function(f){return f.storeId===storeId;}).length;
    return ok_(info);
  }catch(e){return fail_(safeError_(e));}
}
function applySeller(customerToken,data) {
  try {var c=requireCustomer_(customerToken);data=data||{};if(String(getSettingValue_('sellerRegistrationEnabled'))==='false')throw new Error('ขณะนี้ปิดรับสมัครผู้ขาย');var exists=readTable_('Stores',false).filter(function(x){return x.ownerCustomerId===c.id;})[0];if(exists)return ok_(publicStore_(exists),exists.status==='Pending'?'ใบสมัครกำลังรออนุมัติ':'บัญชีนี้มีร้านค้าอยู่แล้ว');
    var name=text_(data.shopName,120),phone=text_(data.phone||c.phone,40),email=text_(data.email||c.email,160).toLowerCase();if(!name||!phone||!email)throw new Error('กรุณาระบุชื่อร้าน เบอร์โทร และอีเมล');
    var slug=slug_(data.slug||name),duplicate=readTable_('Stores',false).some(function(x){return x.slug===slug;});if(duplicate)slug=slug+'-'+String(Date.now()).slice(-5);
    var row={id:newId_('STR'),ownerCustomerId:c.id,shopName:name,slug:slug,description:sanitizeHtml_(data.description||''),logo:text_(data.logo,1000),banner:text_(data.banner,1000),email:email,phone:phone,address:text_(data.address,500),status:'Pending',rating:0,followerCount:0,commissionRate:'',approvedAt:'',createdAt:now_(),updatedAt:now_()};appendRecord_('Stores',row);log_('Seller Application','Marketplace',name,c.username);return ok_(publicStore_(row),'ส่งใบสมัครเปิดร้านแล้ว กรุณารอผู้ดูแลอนุมัติ');
  }catch(e){return fail_(safeError_(e));}
}
function getMyStore(customerToken) {try{var c=requireCustomer_(customerToken),st=findRecordByExactColumn_('Stores','ownerCustomerId',c.id);return ok_(st?publicStore_(st):null);}catch(e){return fail_(safeError_(e));}}
function adminGetSellers(token,filters) {
  try {
    requireAdmin_(token,'sellers.manage');
    filters=filters||{};
    var rows=readTable_('Stores',true);
    if(filters.status)rows=rows.filter(function(x){return x.status===filters.status;});
    var customers=readTable_('Customers',true),customersById=Object.create(null);
    customers.forEach(function(customer){customersById[String(customer.id)]=customer;});
    return ok_(rows.map(function(store){
      var customer=customersById[String(store.ownerCustomerId)]||{};
      var result=publicStore_(store);
      result.ownerName=(customer.firstname||'')+' '+(customer.lastname||'');
      result.ownerEmail=customer.email||'';
      result.ownerPhone=customer.phone||'';
      result.commissionRate=store.commissionRate;
      return result;
    }));
  } catch(e) { return fail_(safeError_(e)); }
}
function adminSetSellerStatus(token,storeId,status,commissionRate,note) {try{var u=requireAdmin_(token,'sellers.manage');if(['Active','Rejected','Suspended','Pending'].indexOf(status)<0)throw new Error('สถานะร้านค้าไม่ถูกต้อง');var st=readTable_('Stores',false).filter(function(x){return x.id===storeId;})[0];if(!st)throw new Error('ไม่พบร้านค้า');updateRecord_('Stores',storeId,{status:status,commissionRate:commissionRate===''?st.commissionRate:Math.max(0,Math.min(50,number_(commissionRate,number_(getSettingValue_('marketplaceCommissionRate'),5)))),approvedAt:status==='Active'?(st.approvedAt||now_()):st.approvedAt,updatedAt:now_()});notify_('customer',st.ownerCustomerId,'อัปเดตสถานะร้านค้า','ร้าน '+st.shopName+' เปลี่ยนสถานะเป็น '+status+' '+text_(note,200),'seller','');log_('Seller Status','Marketplace',storeId+' => '+status,u.username);return ok_(true,'อัปเดตสถานะร้านค้าแล้ว');}catch(e){return fail_(safeError_(e));}}
function sellerGetStoreProfile(customerToken) {try{var x=requireSeller_(customerToken),s=x.store;return ok_({id:s.id,shopName:s.shopName,slug:s.slug,description:s.description,logo:s.logo,banner:s.banner,email:s.email,phone:s.phone,address:s.address,commissionRate:s.commissionRate,status:s.status,createdAt:s.createdAt});}catch(e){return fail_(safeError_(e));}}
function sellerSaveStoreProfile(customerToken,data) {try{var x=requireSeller_(customerToken);data=data||{};var name=text_(data.shopName,120),slug=slug_(data.slug||name),logo=text_(data.logo,1000),banner=text_(data.banner,1000);if(!name)throw new Error('กรุณาระบุชื่อร้านค้า');if(readTable_('Stores',false).some(function(v){return v.id!==x.store.id&&v.slug===slug;}))throw new Error('URL ร้านค้านี้ถูกใช้แล้ว');if((logo&&!/^https:\/\//i.test(logo))||(banner&&!/^https:\/\//i.test(banner)))throw new Error('URL รูปภาพต้องขึ้นต้นด้วย https://');updateRecord_('Stores',x.store.id,{shopName:name,slug:slug,description:sanitizeHtml_(data.description||''),logo:logo,banner:banner,email:text_(data.email,160).toLowerCase(),phone:text_(data.phone,40),address:text_(data.address,500),updatedAt:now_()});log_('Seller Store Profile','Marketplace',name,x.customer.username);clearRuntimeCaches_();return ok_(sellerGetStoreProfile(customerToken).data,'บันทึกข้อมูลหน้าร้านแล้ว');}catch(e){return fail_(safeError_(e));}}
function sellerGetProductVariants(customerToken,productId) {try{var x=requireSeller_(customerToken),p=readTable_('Products',false).filter(function(v){return v.id===productId&&v.sellerId===x.store.id;})[0];if(!p)throw new Error('ไม่พบสินค้าในร้านของคุณ');var rows=readTable_('ProductVariants',false).filter(function(v){return v.productId===productId;});var inv=readTable_('Inventory',false);return ok_(rows.map(function(v){var r=inv.filter(function(z){return z.productId===productId&&z.variantId===v.id;})[0];v.available=r?Math.max(0,number_(r.quantity,0)-number_(r.reserved,0)):number_(v.stock,0);return v;}));}catch(e){return fail_(safeError_(e));}}
function sellerSaveProductVariant(customerToken,data) {try{var x=requireSeller_(customerToken);data=data||{};var p=readTable_('Products',false).filter(function(v){return v.id===data.productId&&v.sellerId===x.store.id;})[0];if(!p)throw new Error('ไม่พบสินค้าในร้านของคุณ');var id=text_(data.id,100)||newId_('VAR'),old=readTable_('ProductVariants',false).filter(function(v){return v.id===id;})[0];if(old&&old.productId!==p.id)throw new Error('ไม่มีสิทธิ์แก้ไขตัวเลือกสินค้านี้');var sku=text_(data.sku,80)||('VAR-'+Utilities.getUuid().replace(/-/g,'').substring(0,10).toUpperCase()),name=text_(data.variantName,120),stock=Math.max(0,Math.floor(number_(data.stock,0))),price=Math.max(0,number_(data.price,0));if(!name||price<=0)throw new Error('กรุณาระบุชื่อ Variant และราคา');if(readTable_('Products',false).some(function(v){return String(v.sku||'').toLowerCase()===sku.toLowerCase()&&v.sellerId===x.store.id;})||readTable_('ProductVariants',false).some(function(v){return v.id!==id&&String(v.sku).toLowerCase()===sku.toLowerCase();}))throw new Error('SKU นี้ถูกใช้แล้ว');var inv=inventoryRow_(p.id,id);if(inv&&stock<number_(inv.reserved,0))throw new Error('สต็อกใหม่ต่ำกว่าจำนวนที่จองไว้');var now=now_(),row={id:id,productId:p.id,sku:sku,variantName:name,attributes:JSON.stringify(data.attributes||{}),price:price,salePrice:Math.max(0,number_(data.salePrice,0)),stock:stock,status:text_(data.status||'Active',30),createdAt:old?old.createdAt:now,updatedAt:now};upsertById_('ProductVariants',row);if(!inv)ensureInventory_(p.id,id,stock,0);else if(number_(inv.quantity,0)!==stock){var delta=stock-number_(inv.quantity,0);updateRecord_('Inventory',inv.id,{quantity:stock,updatedAt:now});appendRecord_('InventoryMovements',{id:newId_('MOV'),productId:p.id,variantId:id,type:'Adjustment',quantity:delta,referenceId:'',reason:'Seller updated variant stock',createdBy:x.customer.username,createdAt:now});}clearRuntimeCaches_();return ok_(row,'บันทึกตัวเลือกสินค้าแล้ว');}catch(e){return fail_(safeError_(e));}}
function sellerDeleteProductVariant(customerToken,variantId) {try{var x=requireSeller_(customerToken),v=readTable_('ProductVariants',false).filter(function(z){return z.id===variantId;})[0];if(!v)throw new Error('ไม่พบตัวเลือกสินค้า');var p=readTable_('Products',false).filter(function(z){return z.id===v.productId&&z.sellerId===x.store.id;})[0];if(!p)throw new Error('ไม่มีสิทธิ์จัดการตัวเลือกสินค้านี้');if(readTable_('OrderItems',false).some(function(i){return i.variantId===variantId;})){updateRecord_('ProductVariants',variantId,{status:'Archived',updatedAt:now_()});return ok_(true,'เก็บตัวเลือกสินค้าเข้าคลัง เนื่องจากมีประวัติคำสั่งซื้อ');}deleteRows_('ProductVariants',function(z){return z.id===variantId&&z.productId===p.id;});deleteRows_('Inventory',function(z){return z.productId===p.id&&z.variantId===variantId;});clearRuntimeCaches_();return ok_(true,'ลบตัวเลือกสินค้าแล้ว');}catch(e){return fail_(safeError_(e));}}
function sellerDashboard(customerToken) {try{var x=requireSeller_(customerToken),sid=x.store.id,orders=readTable_('SellerOrders',false).filter(function(o){return o.sellerId===sid;}),products=readTable_('Products',false).filter(function(p){return p.sellerId===sid;}),payouts=readTable_('SellerPayouts',false).filter(function(p){return p.sellerId===sid;});return ok_({store:publicStore_(x.store),productCount:products.length,activeProducts:products.filter(function(p){return p.status==='Active';}).length,orderCount:orders.length,pendingOrders:orders.filter(function(o){return ['Awaiting Payment','Processing','Packed'].indexOf(o.status)>=0;}).length,revenue:orders.filter(function(o){return ['Delivered','Completed'].indexOf(o.status)>=0;}).reduce(function(s,o){return s+number_(o.subtotal,0);},0),pendingPayout:payouts.filter(function(p){return p.status!=='Paid';}).reduce(function(s,p){return s+number_(p.netAmount,0);},0)});}catch(e){return fail_(safeError_(e));}}
function sellerGetProducts(customerToken,filters) {try{var x=requireSeller_(customerToken);filters=filters||{};var rows=readTable_('Products',false).filter(function(p){return p.sellerId===x.store.id;});if(filters.status)rows=rows.filter(function(p){return p.status===filters.status;});var q=text_(filters.search,100).toLowerCase();if(q)rows=rows.filter(function(p){return [p.name,p.sku].join(' ').toLowerCase().indexOf(q)>=0;});rows.sort(function(a,b){var d=new Date(b.createdAt||0)-new Date(a.createdAt||0);return d||String(b.id||'').localeCompare(String(a.id||''));});return ok_(rows);}catch(e){return fail_(safeError_(e));}}
function sellerSaveProduct(customerToken,data) {
  try {
    ensureTableColumns_('Products',['quantityPromoEnabled','quantityPromoQty','quantityPromoDiscount','mallBadgeEnabled','mallBadgeText','featuredLabel','videoUrl','campaignLabel','campaignImage','promoTag','originProvince','freeShippingMinimum','sizeChart']);
    var x=requireSeller_(customerToken);data=data||{};
    var id=text_(data.id,100)||newId_('PRD'),old=readTable_('Products',false).filter(function(p){return p.id===id;})[0];
    if(old&&old.sellerId!==x.store.id)throw new Error('ไม่มีสิทธิ์แก้ไขสินค้าร้านอื่น');
    var stock=Math.max(0,Math.floor(number_(data.stock,0))),now=now_(),sellerSku=text_(data.sku,80)||('SKU-'+Utilities.getUuid().replace(/-/g,'').substring(0,10).toUpperCase()),categoryId=text_(data.categoryId,100);
    if(categoryId&&!readTable_('Categories',false).some(function(c){return String(c.id)===categoryId&&c.status==='Active';}))throw new Error('ไม่พบหมวดหมู่ที่เปิดใช้งาน กรุณาเลือกหมวดหมู่ใหม่');
    var promoEnabled=parseBool_(data.quantityPromoEnabled),promoQty=promoEnabled?Math.max(2,Math.floor(number_(data.quantityPromoQty,2))):0,promoDiscount=promoEnabled?Math.max(0,number_(data.quantityPromoDiscount,0)):0;
    var row={id:id,sku:sellerSku,barcode:text_(data.barcode,80),name:text_(data.name,200),slug:slug_(data.name),categoryId:categoryId,brand:text_(data.brand,120),summary:text_(data.summary,500),description:sanitizeHtml_(data.description),coverImage:text_(data.coverImage,1000),images:JSON.stringify(safeArray_(data.images)),price:Math.max(0,number_(data.price,0)),salePrice:Math.max(0,number_(data.salePrice,0)),costPrice:0,stock:stock,unit:text_(data.unit||'ชิ้น',30),weight:Math.max(0,number_(data.weight,0)),featured:false,featuredLabel:old?text_(old.featuredLabel||'ร้านแนะนำ',40):'ร้านแนะนำ',bestSeller:false,sellerId:x.store.id,tags:JSON.stringify(safeArray_(data.tags)),status:text_(data.status||'Active',30),quantityPromoEnabled:promoEnabled,quantityPromoQty:promoQty,quantityPromoDiscount:promoDiscount,mallBadgeEnabled:old?parseBool_(old.mallBadgeEnabled):false,mallBadgeText:old?text_(old.mallBadgeText||'Mall',24):'Mall',videoUrl:text_(data.videoUrl===undefined?(old?old.videoUrl:''):data.videoUrl,1000),campaignLabel:text_(data.campaignLabel===undefined?(old?old.campaignLabel:''):data.campaignLabel,60),campaignImage:text_(data.campaignImage===undefined?(old?old.campaignImage:''):data.campaignImage,1000),promoTag:text_(data.promoTag===undefined?(old?old.promoTag:''):data.promoTag,120),originProvince:text_(data.originProvince===undefined?(old?old.originProvince:''):data.originProvince,100),freeShippingMinimum:Math.max(0,number_(data.freeShippingMinimum===undefined?(old?old.freeShippingMinimum:0):data.freeShippingMinimum,0)),sizeChart:text_(data.sizeChart===undefined?(old?old.sizeChart:''):data.sizeChart,8000),createdAt:old?old.createdAt:now,updatedAt:now};
    row.videoUrl=validateProductVideoReference_(row.videoUrl,x.store.id);
    if(promoEnabled&&(promoQty<2||promoDiscount<=0||promoDiscount>=(number_(row.salePrice,0)>0?number_(row.salePrice,0):row.price)*promoQty))throw new Error('โปรโมชั่นจำนวนชิ้นต้องกำหนดจำนวนอย่างน้อย 2 ชิ้น และส่วนลดต้องต่ำกว่ามูลค่าสินค้าในชุด');
    if(!row.name||row.price<=0)throw new Error('กรุณากรอกชื่อสินค้าและราคาที่ถูกต้อง');
    if(readTable_('Products',false).some(function(p){return p.id!==id&&String(p.sku).toLowerCase()===row.sku.toLowerCase();}))throw new Error('SKU นี้ถูกใช้แล้ว');
    var inv=inventoryRow_(id,'');
    if(inv&&stock<number_(inv.reserved,0))throw new Error('สต็อกใหม่ต่ำกว่าจำนวนที่ถูกจองไว้');
    upsertById_('Products',row);
    if(!inv){ensureInventory_(id,'',stock,0);}else if(number_(inv.quantity,0)!==stock){
      var delta=stock-number_(inv.quantity,0);
      updateRecord_('Inventory',inv.id,{quantity:stock,updatedAt:now});
      appendRecord_('InventoryMovements',{id:newId_('MOV'),productId:id,variantId:'',type:'Adjustment',quantity:delta,referenceId:'',reason:'Seller updated product stock',createdBy:x.customer.username,createdAt:now});
    }
    log_('Seller Save Product','Marketplace',row.name,x.customer.username);clearRuntimeCaches_();
    return ok_(row,'บันทึกสินค้าแล้ว');
  }catch(e){return fail_(safeError_(e));}
}
function sellerDeleteProduct(customerToken,productId) {try{var x=requireSeller_(customerToken),p=readTable_('Products',false).filter(function(v){return v.id===productId&&v.sellerId===x.store.id;})[0];if(!p)throw new Error('ไม่พบสินค้าในร้านของคุณ');var used=readTable_('OrderItems',false).some(function(i){return i.productId===productId;});if(used)updateRecord_('Products',productId,{status:'Archived',updatedAt:now_()});else deleteRows_('Products',function(v){return v.id===productId&&v.sellerId===x.store.id;});clearRuntimeCaches_();return ok_(true,used?'เก็บสินค้าเข้าคลังแล้ว เนื่องจากมีประวัติคำสั่งซื้อ':'ลบสินค้าแล้ว');}catch(e){return fail_(safeError_(e));}}
function sellerGetOrders(customerToken,filters) {try{var x=requireSeller_(customerToken),sid=x.store.id;filters=filters||{};var rows=readTable_('SellerOrders',false).filter(function(o){return o.sellerId===sid;});if(filters.status)rows=rows.filter(function(o){return o.status===filters.status;});var parents=readTable_('Orders',false),items=readTable_('OrderItems',false);return ok_(rows.map(function(o){var parent=parents.filter(function(p){return p.id===o.parentOrderId;})[0]||{};return {id:o.id,parentOrderId:o.parentOrderId,orderNumber:o.orderNumber,parentOrderNumber:parent.orderNumber,customerName:parent.customerName,phone:parent.phone,shippingAddress:o.shippingAddress,subtotal:o.subtotal,shippingFee:o.shippingFee,status:o.status,carrier:o.carrier,trackingNumber:o.trackingNumber,paymentMethod:parent.paymentMethod,paymentStatus:parent.paymentStatus,createdAt:o.createdAt,items:items.filter(function(i){return i.sellerOrderId===o.id&&i.sellerId===sid;})};}).sort(function(a,b){return new Date(b.createdAt)-new Date(a.createdAt);}));}catch(e){return fail_(safeError_(e));}}
function sellerUpdateOrder(customerToken,sellerOrderId,status,carrier,trackingNumber) {try{return withLock_(function(){var x=requireSeller_(customerToken),o=readTable_('SellerOrders',false).filter(function(v){return v.id===sellerOrderId&&v.sellerId===x.store.id;})[0];if(!o)throw new Error('ไม่พบคำสั่งซื้อของร้าน');var parent=readTable_('Orders',false).filter(function(v){return v.id===o.parentOrderId;})[0];if(!parent)throw new Error('ไม่พบคำสั่งซื้อหลัก');var allowed={'Processing':['Packed'],'Packed':['Shipped'],'Shipped':['Delivered']};if(!allowed[o.status]||allowed[o.status].indexOf(status)<0)throw new Error('ไม่สามารถเปลี่ยนสถานะจาก '+o.status+' เป็น '+status);if(['Packed','Shipped','Delivered'].indexOf(status)>=0&&parent.paymentMethod!=='cod'&&parent.paymentStatus!=='Verified')throw new Error('ต้องยืนยันการชำระเงินก่อนจัดส่ง');var tr=text_(trackingNumber,120),ca=text_(carrier,100);if(status==='Shipped'&&(!tr||!ca))throw new Error('กรุณาระบุบริษัทขนส่งและเลข Tracking');var changes={status:status,carrier:ca,trackingNumber:tr,updatedAt:now_()};if(status==='Shipped')changes.shippedAt=now_();if(status==='Delivered')changes.deliveredAt=now_();updateRecord_('SellerOrders',o.id,changes);var siblings=readTable_('SellerOrders',false).filter(function(v){return v.parentOrderId===parent.id;}),rank={'Awaiting Payment':0,'Processing':1,'Packed':2,'Shipped':3,'Delivered':4,'Completed':5,'Cancelled':-1};var minRank=siblings.length?Math.min.apply(null,siblings.map(function(v){return rank[v.status]===undefined?0:rank[v.status];})):0;var parentStatus=minRank>=4?'Delivered':(minRank>=3?'Shipped':(minRank>=2?'Packed':(minRank>=1?'Processing':parent.orderStatus)));var parentChanges={orderStatus:parentStatus,shippingStatus:parentStatus,updatedAt:now_()};if(status==='Shipped')parentChanges.trackingNumber=tr;updateRecord_('Orders',parent.id,parentChanges);if(parent.customerId)notify_('customer',parent.customerId,'อัปเดตการจัดส่ง','ร้าน '+x.store.shopName+' อัปเดตคำสั่งซื้อ '+parent.orderNumber+' เป็น '+status,'order',parent.id);log_('Seller Order Status','Marketplace',o.orderNumber+' => '+status,x.customer.username);return ok_(true,'อัปเดตคำสั่งซื้อแล้ว');});}catch(e){return fail_(safeError_(e));}}
function sellerSaveVoucher(customerToken,data) {try{var x=requireSeller_(customerToken);data=data||{};var code=text_(data.code,60).toUpperCase();if(!code)throw new Error('กรุณาระบุโค้ดคูปอง');var id=text_(data.id,100)||newId_('CPN'),old=readTable_('Coupons',false).filter(function(c){return c.id===id;})[0];if(old&&old.sellerId!==x.store.id)throw new Error('ไม่มีสิทธิ์แก้ไขคูปองนี้');if(readTable_('Coupons',false).some(function(c){return c.id!==id&&String(c.code).toUpperCase()===code;}))throw new Error('โค้ดคูปองนี้ถูกใช้แล้ว');var row={id:id,code:code,title:text_(data.title||code,140),discountType:data.discountType==='percent'?'percent':'amount',discountValue:Math.max(0,number_(data.discountValue,0)),minimumOrder:Math.max(0,number_(data.minimumOrder,0)),maximumDiscount:Math.max(0,number_(data.maximumDiscount,0)),usageLimit:Math.max(0,number_(data.usageLimit,0)),usagePerCustomer:Math.max(0,number_(data.usagePerCustomer,1)),usedCount:old?number_(old.usedCount,0):0,startDate:text_(data.startDate,60),endDate:text_(data.endDate,60),sellerId:x.store.id,status:text_(data.status||'Active',30),createdAt:old?old.createdAt:now_()};if(row.discountValue<=0)throw new Error('จำนวนส่วนลดต้องมากกว่า 0');upsertById_('Coupons',row);return ok_(row,'บันทึก Voucher ร้านค้าแล้ว');}catch(e){return fail_(safeError_(e));}}
function sellerGetVouchers(customerToken) {try{var x=requireSeller_(customerToken),rows=readTable_('Coupons',false).filter(function(c){return c.sellerId===x.store.id;});rows.sort(function(a,b){return new Date(b.createdAt||0)-new Date(a.createdAt||0);});return ok_(rows);}catch(e){return fail_(safeError_(e));}}
function getMarketplaceVouchers() {try{var now=Date.now();var rows=readTable_('Coupons',true).filter(function(c){return c.status==='Active'&&(!c.startDate||new Date(c.startDate).getTime()<=now)&&(!c.endDate||new Date(c.endDate).getTime()>=now)&&(!number_(c.usageLimit,0)||number_(c.usedCount,0)<number_(c.usageLimit,0));});var stores=readTable_('Stores',true);return ok_(rows.map(function(c){var st=stores.filter(function(x){return x.id===c.sellerId;})[0];return {id:c.id,code:c.code,title:c.title||c.code,discountType:c.discountType,discountValue:c.discountValue,minimumOrder:c.minimumOrder,endDate:c.endDate,storeId:c.sellerId,storeName:st?st.shopName:'Marketplace'};}));}catch(e){return fail_(safeError_(e));}}
function collectVoucher(customerToken,couponId) {try{var c=requireCustomer_(customerToken),coupon=readTable_('Coupons',false).filter(function(x){return x.id===couponId&&x.status==='Active';})[0];if(!coupon)throw new Error('ไม่พบ Voucher');if(readTable_('CollectedVouchers',false).some(function(v){return v.customerId===c.id&&v.couponId===couponId;}))return ok_(true,'คุณเก็บ Voucher นี้แล้ว');appendRecord_('CollectedVouchers',{id:newId_('CVR'),customerId:c.id,couponId:couponId,collectedAt:now_(),usedAt:''});return ok_(true,'เก็บ Voucher แล้ว');}catch(e){return fail_(safeError_(e));}}
function getMyVouchers(customerToken) {try{var c=requireCustomer_(customerToken),ids=readTable_('CollectedVouchers',false).filter(function(v){return v.customerId===c.id;});var coupons=readTable_('Coupons',false);return ok_(ids.map(function(v){var cp=coupons.filter(function(z){return z.id===v.couponId;})[0];if(!cp)return null;return {id:cp.id,code:cp.code,title:cp.title,discountType:cp.discountType,discountValue:cp.discountValue,minimumOrder:cp.minimumOrder,endDate:cp.endDate,used:!!v.usedAt};}).filter(function(x){return !!x;}));}catch(e){return fail_(safeError_(e));}}
function activeFlashDealForProduct_(productId) {try{var n=Date.now(),p=readTable_('Products',true).filter(function(x){return x.id===productId;})[0];if(!p)return null;if(p.sellerId&&!readTable_('Stores',true).some(function(st){return st.id===p.sellerId&&st.status==='Active';}))return null;var rows=readTable_('FlashDeals',true).filter(function(d){return d.productId===productId&&d.status==='Active'&&(!d.startAt||new Date(d.startAt).getTime()<=n)&&(!d.endAt||new Date(d.endAt).getTime()>=n)&&(!number_(d.quota,0)||number_(d.soldCount,0)<number_(d.quota,0));});rows.sort(function(a,b){return number_(a.dealPrice,0)-number_(b.dealPrice,0);});return rows[0]||null;}catch(e){return null;}}
function getMarketplaceFlashDeals() {
  try {
    ensureTableColumns_('Products',['quantityPromoEnabled','quantityPromoQty','quantityPromoDiscount','mallBadgeEnabled','mallBadgeText','featuredLabel','videoUrl','campaignLabel','campaignImage','promoTag','originProvince','freeShippingMinimum','sizeChart']);
    var now=Date.now();
    var rows=readTable_('FlashDeals',true).filter(function(d){
      return d.status==='Active'&&(!d.startAt||new Date(d.startAt).getTime()<=now)&&(!d.endAt||new Date(d.endAt).getTime()>=now)&&(!number_(d.quota,0)||number_(d.soldCount,0)<number_(d.quota,0));
    });
    var products=readTable_('Products',true),stores=readTable_('Stores',true);
    var output=rows.map(function(d){
      var p=products.filter(function(x){return x.id===d.productId&&x.status==='Active';})[0];
      if(!p)return null;
      var st=stores.filter(function(x){return x.id===d.sellerId&&x.status==='Active';})[0]||{};
      if(d.sellerId&&!st.id)return null;
      var out=publicProduct_(p);
      out.salePrice=d.dealPrice;
      out.dealName=d.name;
      out.flashDealId=d.id;
      out.flashDealEnd=d.endAt;
      out.flashDealQuota=number_(d.quota,0);
      out.flashDealSold=number_(d.soldCount,0);
      out.storeName=st.shopName||'ร้านค้า';
      out.storeId=st.id||'';
      out.storeLogo=st.logo||'';
      out.storeAddress=st.address||'';
      out.remaining=number_(d.quota,0)?Math.max(0,number_(d.quota,0)-number_(d.soldCount,0)):null;
      return out;
    }).filter(function(x){return !!x;});
    productPublicMetrics_(output);
    return ok_(output);
  } catch(e) { return fail_(safeError_(e)); }
}
function adminGetFlashDeals(token) {try{requireAdmin_(token,'promotions.manage');var deals=readTable_('FlashDeals',false),products=readTable_('Products',false),stores=readTable_('Stores',false);return ok_(deals.map(function(d){var p=products.filter(function(x){return x.id===d.productId;})[0]||{},st=stores.filter(function(x){return x.id===d.sellerId;})[0]||{};d.productName=p.name||'';d.shopName=st.shopName||'ร้านค้าหลัก';d.remaining=number_(d.quota,0)>0?Math.max(0,number_(d.quota,0)-number_(d.soldCount,0)):null;return d;}).sort(function(a,b){return new Date(b.createdAt)-new Date(a.createdAt);}));}catch(e){return fail_(safeError_(e));}}
function adminSetFlashDealStatus(token,dealId,status) {try{var u=requireAdmin_(token,'promotions.manage');if(['Active','Inactive'].indexOf(status)<0)throw new Error('สถานะ Flash Deal ไม่ถูกต้อง');var d=readTable_('FlashDeals',false).filter(function(x){return x.id===dealId;})[0];if(!d)throw new Error('ไม่พบ Flash Deal');updateRecord_('FlashDeals',dealId,{status:status,updatedAt:now_()});log_('Flash Deal Status','Marketplace',dealId+' => '+status,u.username);clearRuntimeCaches_();return ok_(true,'อัปเดต Flash Deal แล้ว');}catch(e){return fail_(safeError_(e));}}
function sellerSaveFlashDeal(customerToken,data) {
  try {
    var x=requireSeller_(customerToken);data=data||{};
    var p=readTable_('Products',false).filter(function(v){return v.id===data.productId&&v.sellerId===x.store.id;})[0];
    if(!p||p.status!=='Active')throw new Error('เลือกสินค้าเปิดขายในร้านของคุณเท่านั้น');
    if(readTable_('ProductVariants',false).some(function(v){return v.productId===p.id&&v.status==='Active';}))throw new Error('Flash Deal รุ่นนี้รองรับสินค้าที่ไม่มีตัวเลือก SKU เท่านั้น เพื่อป้องกันราคาไม่ตรงกับ Variant');
    var price=Math.max(0,number_(data.dealPrice,0)),normal=effectivePrice_(p);
    if(price<=0||price>=normal)throw new Error('ราคา Flash Deal ต้องต่ำกว่าราคาปัจจุบัน');
    var start=text_(data.startAt,60),end=text_(data.endAt,60);
    if(!start||!end||isNaN(new Date(start).getTime())||isNaN(new Date(end).getTime())||new Date(end).getTime()<=new Date(start).getTime())throw new Error('กรุณากำหนดช่วงเวลา Flash Deal ให้ถูกต้อง');
    var variants=readTable_('ProductVariants',false).filter(function(v){return v.productId===p.id&&v.status==='Active';});
    var stockAvailable=variants.length?variants.reduce(function(sum,v){return sum+availableStock_(p.id,v.id);},0):availableStock_(p.id,'');
    var quota=Math.max(0,Math.floor(number_(data.quota,0)));
    if(quota<=0)throw new Error('กรุณากำหนดโควตา Flash Deal อย่างน้อย 1 ชิ้น');
    var id=text_(data.id,100)||newId_('FLD'),old=readTable_('FlashDeals',false).filter(function(v){return v.id===id;})[0];
    if(old&&old.sellerId!==x.store.id)throw new Error('ไม่มีสิทธิ์แก้ไข Flash Deal นี้');
    var sold=old?number_(old.soldCount,0):0;
    if(quota<sold)throw new Error('โควตาใหม่ต้องไม่น้อยกว่าจำนวนที่ขายไปแล้ว');
    if(quota-sold>stockAvailable)throw new Error('จำนวนโควตาที่ยังเหลือเกินสต็อกพร้อมขาย');
    var now=now_(),row={id:id,name:text_(data.name||'Flash Deal',120),sellerId:x.store.id,productId:p.id,dealPrice:price,quota:quota,soldCount:sold,startAt:start,endAt:end,status:old?old.status:'Active',createdAt:old?old.createdAt:now,updatedAt:now};
    upsertById_('FlashDeals',row);clearRuntimeCaches_();
    return ok_(row,'บันทึก Flash Deal แล้ว');
  }catch(e){return fail_(safeError_(e));}
}
function sellerGetFlashDeals(customerToken) {try{var x=requireSeller_(customerToken),rows=readTable_('FlashDeals',false).filter(function(d){return d.sellerId===x.store.id;});rows.sort(function(a,b){return new Date(b.createdAt||0)-new Date(a.createdAt||0);});return ok_(rows);}catch(e){return fail_(safeError_(e));}}
function followStore(customerToken,storeId) {try{var c=requireCustomer_(customerToken),st=readTable_('Stores',false).filter(function(x){return x.id===storeId&&x.status==='Active';})[0];if(!st)throw new Error('ไม่พบร้านค้า');var old=readTable_('StoreFollows',false).filter(function(x){return x.customerId===c.id&&x.storeId===storeId;})[0];if(old){deleteRows_('StoreFollows',function(x){return x.id===old.id;});return ok_({following:false},'เลิกติดตามร้านค้าแล้ว');}appendRecord_('StoreFollows',{id:newId_('FOL'),customerId:c.id,storeId:storeId,createdAt:now_()});notify_('customer',st.ownerCustomerId,'มีผู้ติดตามร้านใหม่','มีลูกค้าเริ่มติดตาม '+st.shopName,'store',storeId);return ok_({following:true},'ติดตามร้านค้าแล้ว');}catch(e){return fail_(safeError_(e));}}
function getFollowedStores(customerToken) {try{var c=requireCustomer_(customerToken),ids=readTable_('StoreFollows',false).filter(function(x){return x.customerId===c.id;}).map(function(x){return x.storeId;});return ok_(readTable_('Stores',false).filter(function(s){return ids.indexOf(s.id)>=0&&s.status==='Active';}).map(publicStore_));}catch(e){return fail_(safeError_(e));}}
function createChatThread(customerToken,storeId,productId) {try{var c=requireCustomer_(customerToken),st=readTable_('Stores',false).filter(function(x){return x.id===storeId&&x.status==='Active';})[0];if(!st)throw new Error('ไม่พบร้านค้า');if(st.ownerCustomerId===c.id)throw new Error('ไม่สามารถเริ่มแชตกับร้านค้าของตนเอง');if(productId){var p=readTable_('Products',false).filter(function(x){return x.id===productId&&x.sellerId===storeId&&x.status==='Active';})[0];if(!p)throw new Error('ไม่พบสินค้าในร้านนี้');}var old=readTable_('ChatThreads',false).filter(function(t){return t.customerId===c.id&&t.sellerId===storeId&&String(t.productId||'')===String(productId||'')&&t.status!=='Closed';})[0];if(old)return ok_(old);var row={id:newId_('CHT'),customerId:c.id,sellerId:storeId,productId:productId||'',lastMessage:'',lastMessageAt:now_(),status:'Open',createdAt:now_(),updatedAt:now_()};appendRecord_('ChatThreads',row);return ok_(row,'สร้างห้องแชตแล้ว');}catch(e){return fail_(safeError_(e));}}
function chatSend_(threadId,senderId,senderType,message,attachmentUrl,clientMessageId) {
  return withLock_(function(){
    ensureTableColumns_('ChatMessages',SCHEMA_.ChatMessages);
    var thread=readTable_('ChatThreads',false).filter(function(t){return String(t.id)===String(threadId)&&t.status!=='Closed';})[0];
    if(!thread)throw new Error('ไม่พบห้องแชต');
    var msg=text_(message,2000),attachment=text_(attachmentUrl,1000),clientId=text_(clientMessageId,120);
    if(!msg&&!attachment)throw new Error('กรุณาพิมพ์ข้อความ');
    if(clientId){var existing=readTable_('ChatMessages',false).filter(function(m){return String(m.threadId)===String(threadId)&&String(m.senderId)===String(senderId)&&String(m.clientMessageId||'')===clientId;})[0];if(existing)return existing;}
    var stamp=now_(),row={id:newId_('MSG'),threadId:threadId,senderId:senderId,senderType:senderType,message:msg,attachmentUrl:attachment,clientMessageId:clientId,isRead:false,readAt:'',deletedAt:'',deletedBy:'',createdAt:stamp};
    appendRecord_('ChatMessages',row);
    updateRecord_('ChatThreads',threadId,{lastMessage:msg||(attachment?'ส่งรูปภาพ':'ส่งไฟล์แนบ'),lastMessageAt:stamp,updatedAt:stamp});
    if(senderType==='customer'){var st=readTable_('Stores',false).filter(function(x){return x.id===thread.sellerId;})[0];if(st)notify_('customer',st.ownerCustomerId,'ข้อความใหม่จากลูกค้า',msg||'คุณได้รับไฟล์แนบ','chat',threadId);}
    else notify_('customer',thread.customerId,'ร้านค้าตอบกลับ',msg||'คุณได้รับไฟล์แนบ','chat',threadId);
    return row;
  });
}
function getCustomerChatThreads(customerToken) {
  try {
    var c=requireCustomer_(customerToken),threads=readTable_('ChatThreads',false).filter(function(t){return String(t.customerId)===String(c.id);}),stores=readTable_('Stores',false),byStore={},threadStore={};
    threads.forEach(function(t){
      var sid=String(t.sellerId||'');if(!sid)return;
      var st=stores.filter(function(x){return String(x.id)===sid;})[0]||{};
      if(!byStore[sid])byStore[sid]={storeId:sid,storeName:st.shopName||'ร้านค้า',storeLogo:st.logo||'',storeSlug:st.slug||'',storeStatus:st.status||'',lastMessageAt:t.lastMessageAt||t.createdAt||'',lastMessage:t.lastMessage||'',threadIds:[],id:t.id,status:t.status||'Open',unreadCount:0,_active:t.status!=='Closed',_sort:new Date(t.lastMessageAt||t.createdAt||0).getTime()||0};
      var group=byStore[sid];group.threadIds.push(t.id);threadStore[String(t.id)]=sid;var stamp=new Date(t.lastMessageAt||t.createdAt||0).getTime()||0;
      if(stamp>Number(group._sort||0)){group.lastMessageAt=t.lastMessageAt||t.createdAt||'';group.lastMessage=t.lastMessage||'';group._sort=stamp;}
      if(t.status!=='Closed'&&(!group._active||stamp>=Number(group._activeSort||-1))){group.id=t.id;group.status=t.status||'Open';group._active=true;group._activeSort=stamp;}
    });
    readTable_('ChatMessages',false).forEach(function(m){var sid=threadStore[String(m.threadId)];if(sid&&m.senderType==='seller'&&!parseBool_(m.isRead)&&!m.deletedAt)byStore[sid].unreadCount++;});
    var rows=Object.keys(byStore).map(function(k){var x=byStore[k];delete x._active;delete x._activeSort;delete x._sort;return x;});
    rows.sort(function(a,b){return (new Date(b.lastMessageAt||0).getTime()||0)-(new Date(a.lastMessageAt||0).getTime()||0);});return ok_(rows);
  }catch(e){return fail_(safeError_(e));}
}
function customerChatGetStoreThread_(customer,storeId,createIfMissing){
  var sid=text_(storeId,100),store=readTable_('Stores',false).filter(function(x){return String(x.id)===sid;})[0];
  if(!store)throw new Error('ไม่พบร้านค้า');if(String(store.ownerCustomerId)===String(customer.id))throw new Error('ไม่สามารถเริ่มแชตกับร้านค้าของตนเอง');if(store.status!=='Active')throw new Error('ร้านค้านี้ยังไม่พร้อมให้บริการแชต');
  var rows=readTable_('ChatThreads',false).filter(function(t){return String(t.customerId)===String(customer.id)&&String(t.sellerId)===sid&&t.status!=='Closed';});
  rows.sort(function(a,b){return (new Date(b.lastMessageAt||b.createdAt||0).getTime()||0)-(new Date(a.lastMessageAt||a.createdAt||0).getTime()||0);});if(rows.length)return rows[0];
  if(!createIfMissing)throw new Error('ไม่พบห้องสนทนาที่เปิดใช้งาน กรุณาเริ่มแชตจากหน้าร้านค้าอีกครั้ง');
  var stamp=now_(),row={id:newId_('CHT'),customerId:customer.id,sellerId:sid,productId:'',lastMessage:'',lastMessageAt:stamp,status:'Open',createdAt:stamp,updatedAt:stamp};appendRecord_('ChatThreads',row);return row;
}
function getCustomerStoreChatMessages(customerToken,storeId){
  try{var c=requireCustomer_(customerToken),t=customerChatGetStoreThread_(c,storeId,true),related=readTable_('ChatThreads',false).filter(function(x){return String(x.customerId)===String(c.id)&&String(x.sellerId)===String(t.sellerId);}),ids={};related.forEach(function(x){ids[String(x.id)]=true;});var all=readTable_('ChatMessages',false);markChatMessagesRead_(all.filter(function(m){return ids[String(m.threadId)];}),'customer');var rows=all.filter(function(m){return String(m.threadId)===String(t.id);});return ok_({threadId:t.id,storeId:t.sellerId,messages:rows,unreadCount:0},'โหลดข้อความแล้ว');}
  catch(e){return fail_(safeError_(e));}
}
function sendCustomerStoreChatMessage(customerToken,storeId,message,attachmentUrl,clientMessageId){
  try{var c=requireCustomer_(customerToken),t=customerChatGetStoreThread_(c,storeId,true);return ok_(chatSend_(t.id,c.id,'customer',message,attachmentUrl,clientMessageId),'ส่งข้อความแล้ว');}
  catch(e){return fail_(safeError_(e));}
}
function getSellerChatThreads(customerToken) {
  try{
    var x=requireSeller_(customerToken),customers=readTable_('Customers',true),threads=readTable_('ChatThreads',false).filter(function(t){return String(t.sellerId)===String(x.store.id);}),byCustomer={},threadCustomer={};
    threads.forEach(function(t){
      var cid=String(t.customerId||'');if(!cid)return;var c=customers.filter(function(v){return String(v.id)===cid;})[0]||{},stamp=new Date(t.lastMessageAt||t.createdAt||0).getTime()||0;
      if(!byCustomer[cid])byCustomer[cid]={id:t.id,customerId:cid,customerName:[c.firstname,c.lastname].filter(Boolean).join(' ')||c.username||('ลูกค้า '+cid),customerImage:c.profileImage||c.avatarUrl||c.avatar||'',customerEmail:c.email||'',customerPhone:String(c.phone||''),lastMessage:t.lastMessage||'',lastMessageAt:t.lastMessageAt||t.createdAt||'',status:t.status||'Open',threadIds:[],unreadCount:0,_stamp:-1,_activeStamp:-1};
      var g=byCustomer[cid];g.threadIds.push(String(t.id));threadCustomer[String(t.id)]=cid;
      if(stamp>=g._stamp){g._stamp=stamp;g.lastMessage=t.lastMessage||'';g.lastMessageAt=t.lastMessageAt||t.createdAt||'';if(g._activeStamp<0)g.id=t.id;}
      if(t.status!=='Closed'&&stamp>=g._activeStamp){g._activeStamp=stamp;g.id=t.id;g.status=t.status||'Open';}
    });
    readTable_('ChatMessages',false).forEach(function(m){var cid=threadCustomer[String(m.threadId)];if(cid&&m.senderType==='customer'&&!parseBool_(m.isRead)&&!m.deletedAt)byCustomer[cid].unreadCount++;});
    var rows=Object.keys(byCustomer).map(function(k){var g=byCustomer[k];delete g._stamp;delete g._activeStamp;return g;});
    rows.sort(function(a,b){return (new Date(b.lastMessageAt||0).getTime()||0)-(new Date(a.lastMessageAt||0).getTime()||0);});return ok_(rows);
  }catch(e){return fail_(safeError_(e));}
}
function sendCustomerChatMessage(customerToken,threadId,message,attachmentUrl,clientMessageId) {try{var c=requireCustomer_(customerToken),t=readTable_('ChatThreads',false).filter(function(x){return x.id===threadId&&x.customerId===c.id;})[0];if(!t)throw new Error('ไม่มีสิทธิ์เข้าถึงห้องแชต');return ok_(chatSend_(threadId,c.id,'customer',message,attachmentUrl,clientMessageId),'ส่งข้อความแล้ว');}catch(e){return fail_(safeError_(e));}}
function sendSellerChatMessage(customerToken,threadId,message,attachmentUrl,clientMessageId) {try{var x=requireSeller_(customerToken),t=readTable_('ChatThreads',false).filter(function(v){return v.id===threadId&&v.sellerId===x.store.id;})[0];if(!t)throw new Error('ไม่มีสิทธิ์เข้าถึงห้องแชต');return ok_(chatSend_(threadId,x.store.id,'seller',message,attachmentUrl,clientMessageId),'ส่งข้อความแล้ว');}catch(e){return fail_(safeError_(e));}}
function markChatMessagesRead_(rows,viewerType){ensureTableColumns_('ChatMessages',SCHEMA_.ChatMessages);var stamp=now_();rows.forEach(function(m){var incoming=viewerType==='seller'?m.senderType==='customer':m.senderType!=='customer';if(incoming&&!parseBool_(m.isRead)){updateRecord_('ChatMessages',m.id,{isRead:true,readAt:stamp});m.isRead=true;m.readAt=stamp;}});}
function getCustomerChatMessages(customerToken,threadId) {try{var c=requireCustomer_(customerToken),t=readTable_('ChatThreads',false).filter(function(x){return x.id===threadId&&x.customerId===c.id;})[0];if(!t)throw new Error('ไม่มีสิทธิ์เข้าถึงห้องแชต');var rows=readTable_('ChatMessages',false).filter(function(m){return m.threadId===threadId;});markChatMessagesRead_(rows,'customer');return ok_(rows);}catch(e){return fail_(safeError_(e));}}
function getSellerChatMessages(customerToken,threadId) {try{var x=requireSeller_(customerToken),t=readTable_('ChatThreads',false).filter(function(v){return String(v.id)===String(threadId)&&String(v.sellerId)===String(x.store.id);})[0];if(!t)throw new Error('ไม่มีสิทธิ์เข้าถึงห้องแชต');var related=readTable_('ChatThreads',false).filter(function(v){return String(v.sellerId)===String(x.store.id)&&String(v.customerId)===String(t.customerId);}),ids={};related.forEach(function(v){ids[String(v.id)]=true;});var all=readTable_('ChatMessages',false);markChatMessagesRead_(all.filter(function(m){return ids[String(m.threadId)];}),'seller');return ok_(all.filter(function(m){return String(m.threadId)===String(threadId);}));}catch(e){return fail_(safeError_(e));}}

function getCustomerStoreChatUpdates(customerToken,storeId,afterMessageAt){
  try{
    var c=requireCustomer_(customerToken),t=customerChatGetStoreThread_(c,storeId,false),pollCursorAt=now_();
    var related=readTable_('ChatThreads',false).filter(function(x){return String(x.customerId)===String(c.id)&&String(x.sellerId)===String(t.sellerId);}),ids={};related.forEach(function(x){ids[String(x.id)]=true;});
    var cursor=new Date(afterMessageAt||0).getTime()||0,overlap=Math.max(0,cursor-1000),all=readTable_('ChatMessages',false),recent=all.filter(function(m){if(!ids[String(m.threadId)])return false;var time=new Date(m.createdAt||0).getTime()||0;return time>=overlap;});
    // Initial history load marks older messages read. During polling, update only the recent incoming slice.
    markChatMessagesRead_(recent,'customer');
    var rows=recent.filter(function(m){return String(m.threadId)===String(t.id);});
    rows.sort(function(a,b){return (new Date(a.createdAt||0).getTime()||0)-(new Date(b.createdAt||0).getTime()||0);});
    return ok_({threadId:t.id,storeId:t.sellerId,messages:rows,lastMessageAt:rows.length?rows[rows.length-1].createdAt:'',cursorAt:pollCursorAt},'อัปเดตข้อความแล้ว');
  }catch(e){return fail_(safeError_(e));}
}
function getSellerChatUpdates(customerToken,threadId,afterMessageAt,afterReadAt){
  try{
    var x=requireSeller_(customerToken),t=readTable_('ChatThreads',false).filter(function(v){return String(v.id)===String(threadId)&&String(v.sellerId)===String(x.store.id);})[0],pollCursorAt=now_();
    if(!t)throw new Error('ไม่มีสิทธิ์เข้าถึงห้องแชต');
    var related=readTable_('ChatThreads',false).filter(function(v){return String(v.sellerId)===String(x.store.id)&&String(v.customerId)===String(t.customerId);}),ids={};related.forEach(function(v){ids[String(v.id)]=true;});
    var cursor=new Date(afterMessageAt||0).getTime()||0,overlap=Math.max(0,cursor-1000),all=readTable_('ChatMessages',false),allRelated=all.filter(function(m){return !!ids[String(m.threadId)];}),relatedMessages=allRelated.filter(function(m){var time=new Date(m.createdAt||0).getTime()||0;return time>=overlap;});
    var rows=relatedMessages.filter(function(m){return String(m.threadId)===String(threadId);});markChatMessagesRead_(rows,'seller');
    rows.sort(function(a,b){return (new Date(a.createdAt||0).getTime()||0)-(new Date(b.createdAt||0).getTime()||0);});
    var readCursor=new Date(afterReadAt||0).getTime()||0,readIds=allRelated.filter(function(m){var readTime=new Date(m.readAt||0).getTime()||0;return String(m.threadId)===String(threadId)&&m.senderType==='seller'&&parseBool_(m.isRead)&&!m.deletedAt&&readTime>readCursor;}).map(function(m){return String(m.id);});
    return ok_({messages:rows,readMessageIds:readIds,lastMessageAt:rows.length?rows[rows.length-1].createdAt:'',cursorAt:pollCursorAt,lastReadAt:now_()},'อัปเดตข้อความแล้ว');
  }catch(e){return fail_(safeError_(e));}
}

function sellerGetChatCustomerProfile(customerToken,customerId){try{var x=requireSeller_(customerToken),threads=readTable_('ChatThreads',false).filter(function(t){return t.sellerId===x.store.id&&t.customerId===customerId;});if(!threads.length)throw new Error('ไม่มีสิทธิ์ดูข้อมูลลูกค้ารายนี้');var c=readTable_('Customers',false).filter(function(v){return v.id===customerId;})[0];if(!c)throw new Error('ไม่พบข้อมูลลูกค้า');return ok_({customer:{id:c.id,username:c.username,firstname:c.firstname,lastname:c.lastname,phone:c.phone,email:c.email,profileImage:c.profileImage,createdAt:c.createdAt},threadCount:threads.length});}catch(e){return fail_(safeError_(e));}}
function sellerDeleteChatMessage(customerToken,threadId,messageId){try{ensureTableColumns_('ChatMessages',SCHEMA_.ChatMessages);var x=requireSeller_(customerToken),t=readTable_('ChatThreads',false).filter(function(v){return v.id===threadId&&v.sellerId===x.store.id;})[0];if(!t)throw new Error('ไม่มีสิทธิ์เข้าถึงห้องแชต');var m=readTable_('ChatMessages',false).filter(function(v){return v.id===messageId&&v.threadId===threadId;})[0];if(!m||m.senderType!=='seller'||m.senderId!==x.store.id)throw new Error('ลบได้เฉพาะข้อความที่ร้านค้าส่งเอง');if(m.deletedAt)throw new Error('ข้อความนี้ถูกลบไปแล้ว');if(parseBool_(m.isRead)||m.readAt)throw new Error('ไม่สามารถลบข้อความที่ลูกค้าอ่านแล้ว');var age=Date.now()-new Date(m.createdAt).getTime();if(!isFinite(age)||age<0||age>5*60*1000)throw new Error('ลบข้อความได้ภายใน 5 นาทีหลังส่งเท่านั้น');var stamp=now_();updateRecord_('ChatMessages',messageId,{message:'',attachmentUrl:'',deletedAt:stamp,deletedBy:'seller'});return ok_(true,'ลบข้อความแล้ว');}catch(e){return fail_(safeError_(e));}}
function sellerSendChatBroadcast(customerToken,data){try{var x=requireSeller_(customerToken);data=data||{};var title=text_(data.title,140),message=text_(data.message,500);if(!title||!message)throw new Error('กรุณากรอกหัวข้อและข้อความประกาศ');var ids={},threads=readTable_('ChatThreads',false).filter(function(t){return t.sellerId===x.store.id;});threads.forEach(function(t){ids[t.customerId]=true;});readTable_('StoreFollows',true).filter(function(f){return f.storeId===x.store.id;}).forEach(function(f){ids[f.customerId]=true;});var itemOrderIds={};readTable_('OrderItems',true).filter(function(i){return i.sellerId===x.store.id;}).forEach(function(i){itemOrderIds[i.orderId]=true;});readTable_('Orders',true).filter(function(o){return itemOrderIds[o.id]&&o.customerId;}).forEach(function(o){ids[o.customerId]=true;});var allowed=Object.keys(ids),mode=data.mode==='selected'?'selected':'all',selected=safeArray_(data.customerIds).map(function(v){return text_(v,100);});if(mode==='selected'){if(!selected.length)throw new Error('กรุณาเลือกลูกค้า');allowed=allowed.filter(function(id){return selected.indexOf(id)>=0;});}if(!allowed.length)throw new Error('ไม่พบลูกค้าที่มีความสัมพันธ์กับร้าน');if(allowed.length>5000)throw new Error('จำนวนผู้รับเกินขีดจำกัด 5,000 ราย กรุณาแบ่งส่งเป็นชุด');var stamp=now_(),sh=ensureTableColumns_('Notifications',SCHEMA_.Notifications),headers=sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0].map(function(v){return String(v||'').trim();}),records=allowed.map(function(id){return {id:newId_('NTF'),recipientId:id,recipientType:'customer',title:title,message:message,type:'broadcast',link:x.store.id,isRead:false,createdAt:stamp};}),rows=records.map(function(record){return headers.map(function(header){return record[header]===undefined?'':record[header];});});var currentLast=sh.getLastRow();sh.getRange(currentLast+1,1,rows.length,headers.length).setValues(rows);return ok_({sent:rows.length,mode:mode,storeId:x.store.id},'ส่งบรอดแคสต์แล้ว');}catch(e){return fail_(safeError_(e));}}
function getMyNotifications(customerToken) {try{var c=requireCustomer_(customerToken);return ok_(readTable_('Notifications',false).filter(function(n){return n.recipientType==='customer'&&n.recipientId===c.id;}).sort(function(a,b){return new Date(b.createdAt)-new Date(a.createdAt);}).slice(0,100));}catch(e){return fail_(safeError_(e));}}
function markNotificationRead(customerToken,id) {try{var c=requireCustomer_(customerToken),n=readTable_('Notifications',false).filter(function(x){return x.id===id&&x.recipientId===c.id&&x.recipientType==='customer';})[0];if(!n)throw new Error('ไม่พบการแจ้งเตือน');updateRecord_('Notifications',id,{isRead:true});return ok_(true);}catch(e){return fail_(safeError_(e));}}
function requestReturn(customerToken,data) {try{var c=requireCustomer_(customerToken);data=data||{};var o=readTable_('Orders',false).filter(function(x){return x.id===data.orderId&&x.customerId===c.id;})[0];if(!o||['Delivered','Completed'].indexOf(o.orderStatus)<0)throw new Error('คำสั่งซื้อนี้ยังไม่เข้าเงื่อนไขการคืนสินค้า');var age=(Date.now()-new Date(o.completedAt||o.updatedAt||o.createdAt).getTime())/86400000;if(age>number_(getSettingValue_('returnWindowDays'),7))throw new Error('เกินระยะเวลายื่นคำขอคืนสินค้า');var item=readTable_('OrderItems',false).filter(function(i){return i.id===data.orderItemId&&i.orderId===o.id;})[0];if(!item)throw new Error('ไม่พบรายการสินค้าในคำสั่งซื้อ');var qty=Math.floor(number_(data.quantity,1));if(qty<1||qty>number_(item.quantity,0))throw new Error('จำนวนสินค้าที่ขอคืนไม่ถูกต้อง');if(readTable_('ReturnRequests',false).some(function(r){return r.orderItemId===item.id&&['Pending Seller Review','Approved','Return Shipped','Received','Refund Pending'].indexOf(r.status)>=0;}))throw new Error('รายการนี้มีคำขอคืนสินค้าที่กำลังดำเนินการอยู่');var row={id:newId_('RET'),orderId:o.id,orderItemId:item.id,customerId:c.id,sellerId:item.sellerId||'PLATFORM',quantity:qty,reason:text_(data.reason,100),details:sanitizeHtml_(data.details||''),evidence:JSON.stringify(safeArray_(data.evidence)),status:'Pending Seller Review',sellerResponse:'',adminResponse:'',createdAt:now_(),updatedAt:now_(),resolvedAt:''};appendRecord_('ReturnRequests',row);var st=readTable_('Stores',false).filter(function(s){return s.id===row.sellerId;})[0];if(st)notify_('customer',st.ownerCustomerId,'มีคำขอคืนสินค้าใหม่','มีคำขอคืนสินค้าสำหรับ '+item.productName,'return',row.id);return ok_(row,'ส่งคำขอคืนสินค้าแล้ว');}catch(e){return fail_(safeError_(e));}}
function getCustomerReturns(customerToken) {try{var c=requireCustomer_(customerToken);return ok_(readTable_('ReturnRequests',false).filter(function(r){return r.customerId===c.id;}).sort(function(a,b){return new Date(b.createdAt)-new Date(a.createdAt);}));}catch(e){return fail_(safeError_(e));}}
function sellerGetReturns(customerToken) {try{var x=requireSeller_(customerToken),rows=readTable_('ReturnRequests',false).filter(function(r){return r.sellerId===x.store.id;});rows.sort(function(a,b){return new Date(b.createdAt||0)-new Date(a.createdAt||0);});return ok_(rows);}catch(e){return fail_(safeError_(e));}}
function sellerRespondReturn(customerToken,returnId,decision,message) {try{var x=requireSeller_(customerToken),r=readTable_('ReturnRequests',false).filter(function(v){return v.id===returnId&&v.sellerId===x.store.id;})[0];if(!r||r.status!=='Pending Seller Review')throw new Error('ไม่พบคำขอหรือคำขอถูกดำเนินการแล้ว');if(['Approved','Rejected'].indexOf(decision)<0)throw new Error('ผลการพิจารณาไม่ถูกต้อง');updateRecord_('ReturnRequests',returnId,{status:decision,sellerResponse:sanitizeHtml_(message||''),updatedAt:now_()});notify_('customer',r.customerId,'อัปเดตคำขอคืนสินค้า','ร้านค้า '+x.store.shopName+' '+(decision==='Approved'?'อนุมัติ':'ปฏิเสธ')+' คำขอคืนสินค้า','return',returnId);return ok_(true,'บันทึกผลการพิจารณาแล้ว');}catch(e){return fail_(safeError_(e));}}
function adminGetReturns(token) {try{requireAdmin_(token,'returns.manage');return ok_(readTable_('ReturnRequests',false).sort(function(a,b){return new Date(b.createdAt)-new Date(a.createdAt);}));}catch(e){return fail_(safeError_(e));}}
function adminResolveReturn(token,returnId,status,note) {try{var u=requireAdmin_(token,'returns.manage'),r=readTable_('ReturnRequests',false).filter(function(x){return x.id===returnId;})[0];if(!r)throw new Error('ไม่พบคำขอคืนสินค้า');if(['Return Shipped','Received','Refund Pending','Rejected','Resolved'].indexOf(status)<0)throw new Error('สถานะไม่ถูกต้อง');updateRecord_('ReturnRequests',returnId,{status:status,adminResponse:sanitizeHtml_(note||'').substring(0,5000),updatedAt:now_(),resolvedAt:['Rejected','Resolved'].indexOf(status)>=0?now_():''});if(status==='Resolved')notify_('customer',r.customerId,'ดำเนินการคืนสินค้าแล้ว','คำขอคืนสินค้าของคุณได้รับการดำเนินการแล้ว กรุณาตรวจสอบผลการคืนเงินจริงกับช่องทางชำระเงิน','return',returnId);log_('Resolve Return','Marketplace',returnId+' => '+status,u.username);return ok_(true,'อัปเดตคำขอคืนสินค้าแล้ว');}catch(e){return fail_(safeError_(e));}}
function awardCoinsForOrder_(order) {try{if(!order.customerId||readTable_('CoinTransactions',false).some(function(x){return x.orderId===order.id&&x.type==='Earn';}))return;var rate=number_(getSettingValue_('coinRewardRate'),1),amount=Math.floor(number_(order.grandTotal,0)/100*rate);if(amount>0)appendRecord_('CoinTransactions',{id:newId_('COIN'),customerId:order.customerId,orderId:order.id,type:'Earn',amount:amount,description:'Coins from order '+order.orderNumber,createdAt:now_()});}catch(e){}}
function getCustomerWallet(customerToken) {try{var c=requireCustomer_(customerToken),rows=readTable_('CoinTransactions',false).filter(function(x){return x.customerId===c.id;});var balance=rows.reduce(function(s,x){return s+(x.type==='Spend'?-number_(x.amount,0):number_(x.amount,0));},0);return ok_({balance:balance,transactions:rows.sort(function(a,b){return new Date(b.createdAt)-new Date(a.createdAt);})});}catch(e){return fail_(safeError_(e));}}
function createSellerPayoutsForOrder_(orderId) {try{var sub=readTable_('SellerOrders',false).filter(function(x){return x.parentOrderId===orderId&&x.sellerId!=='PLATFORM';});sub.forEach(function(o){if(!readTable_('SellerPayouts',false).some(function(p){return p.sellerOrderId===o.id;}))appendRecord_('SellerPayouts',{id:newId_('PYO'),sellerId:o.sellerId,sellerOrderId:o.id,grossAmount:o.subtotal,discountAmount:number_(o.discountAmount,0),commissionAmount:o.commissionAmount,netAmount:o.netAmount,status:'Pending',payoutReference:'',paidAt:'',createdAt:now_(),updatedAt:now_()});});}catch(e){}}
function sellerGetPayouts(customerToken) {try{var x=requireSeller_(customerToken);return ok_(readTable_('SellerPayouts',false).filter(function(p){return p.sellerId===x.store.id;}).sort(function(a,b){return new Date(b.createdAt)-new Date(a.createdAt);}));}catch(e){return fail_(safeError_(e));}}
function adminGetSellerPayouts(token) {try{requireAdmin_(token,'payouts.manage');var rows=readTable_('SellerPayouts',false),stores=readTable_('Stores',false);return ok_(rows.map(function(p){var s=stores.filter(function(x){return x.id===p.sellerId;})[0]||{};p.shopName=s.shopName||'';return p;}).sort(function(a,b){return new Date(b.createdAt)-new Date(a.createdAt);}));}catch(e){return fail_(safeError_(e));}}
function adminSetSellerPayout(token,payoutId,status,reference) {try{var u=requireAdmin_(token,'payouts.manage');if(['Pending','Paid','On Hold'].indexOf(status)<0)throw new Error('สถานะการจ่ายเงินไม่ถูกต้อง');var p=readTable_('SellerPayouts',false).filter(function(x){return x.id===payoutId;})[0];if(!p)throw new Error('ไม่พบรายการจ่ายเงิน');if(p.status==='Paid'&&status!=='Paid')throw new Error('รายการที่จ่ายแล้วไม่สามารถย้อนสถานะได้');updateRecord_('SellerPayouts',payoutId,{status:status,payoutReference:text_(reference,160),paidAt:status==='Paid'?now_():p.paidAt,updatedAt:now_()});return ok_(true,'อัปเดตสถานะจ่ายเงินผู้ขายแล้ว');}catch(e){return fail_(safeError_(e));}}
function sellerSaveLiveRoom(customerToken,data) {try{var x=requireSeller_(customerToken);data=data||{};var url=text_(data.streamUrl,1000);if(!/^https:\/\//i.test(url))throw new Error('กรุณาระบุ URL ถ่ายทอดสด HTTPS เช่น YouTube Live');var row={id:text_(data.id,100)||newId_('LIVE'),sellerId:x.store.id,title:text_(data.title,160),description:sanitizeHtml_(data.description||''),streamUrl:url,thumbnail:text_(data.thumbnail,1000),scheduledAt:text_(data.scheduledAt,60),status:text_(data.status||'Scheduled',30),createdAt:now_(),updatedAt:now_()};if(!row.title)throw new Error('กรุณาระบุชื่อไลฟ์');upsertById_('LiveRooms',row);return ok_(row,'บันทึกตารางไลฟ์แล้ว');}catch(e){return fail_(safeError_(e));}}
function sellerGetLiveRooms(customerToken) {try{var x=requireSeller_(customerToken),rows=readTable_('LiveRooms',false).filter(function(v){return v.sellerId===x.store.id;});rows.sort(function(a,b){return new Date(b.createdAt||0)-new Date(a.createdAt||0);});return ok_(rows);}catch(e){return fail_(safeError_(e));}}
function getMarketplaceLiveRooms() {try{var stores=readTable_('Stores',true);return ok_(readTable_('LiveRooms',true).filter(function(x){return x.status==='Live'||x.status==='Scheduled';}).map(function(x){var s=stores.filter(function(v){return v.id===x.sellerId&&v.status==='Active';})[0];if(!s)return null;x.shopName=s.shopName;x.storeLogo=s.logo;return x;}).filter(function(x){return !!x;}));}catch(e){return fail_(safeError_(e));}}
function confirmOrderReceived(customerToken,orderId) {try{return withLock_(function(){var c=requireCustomer_(customerToken),o=readTable_('Orders',false).filter(function(x){return x.id===orderId&&x.customerId===c.id;})[0];if(!o)throw new Error('ไม่พบคำสั่งซื้อ');if(o.orderStatus==='Completed')return ok_(true,'คำสั่งซื้อนี้ปิดงานแล้ว');if(o.orderStatus!=='Delivered')throw new Error('คำสั่งซื้อนี้ยังไม่อยู่ในสถานะส่งสำเร็จ');if(o.paymentMethod==='cod'&&o.paymentStatus!=='Verified'){updateRecord_('Orders',orderId,{paymentStatus:'Verified',paidAt:now_(),updatedAt:now_()});var payment=readTable_('Payments',false).filter(function(p){return p.orderId===orderId;})[0];if(payment)updateRecord_('Payments',payment.id,{status:'Verified',verifiedBy:'Customer COD Confirmation',verifiedAt:now_(),note:'COD collected and confirmed by customer'});settleOrderStock_(orderId,false);}else if(o.paymentStatus!=='Verified'){throw new Error('ยังไม่พบการยืนยันการชำระเงิน');}updateRecord_('Orders',orderId,{orderStatus:'Completed',completedAt:now_(),updatedAt:now_()});readTable_('SellerOrders',false).filter(function(x){return x.parentOrderId===orderId;}).forEach(function(x){updateRecord_('SellerOrders',x.id,{status:'Completed',updatedAt:now_()});});createSellerPayoutsForOrder_(orderId);awardCoinsForOrder_(o);notify_('customer',c.id,'คำสั่งซื้อสำเร็จ','ขอบคุณที่ยืนยันการรับสินค้า '+o.orderNumber,'order',orderId);clearRuntimeCaches_();return ok_(true,'ยืนยันการได้รับสินค้าแล้ว');});}catch(e){return fail_(safeError_(e));}}

/* ------------------------------- EXPORT HELPERS -------------------------- */
function exportReport(token,format,filters){
  var tempId = '';
  try {
    var user = requireAdmin_(token,'reports.view');
    var result = getSalesReports(token,filters||{});
    if(!result.success) throw new Error(result.message);
    var data = result.data;
    var rows = [['วันที่','หมายเลขคำสั่งซื้อ','ลูกค้า','โทรศัพท์','วิธีชำระเงิน','สถานะ','ยอดสินค้า','ส่วนลด','ค่าจัดส่ง','ภาษี','ยอดสุทธิ']];
    data.orders.forEach(function(o) {
      rows.push([String(o.createdAt).substring(0,10),o.orderNumber,o.customerName,o.phone,o.paymentMethod,o.orderStatus,number_(o.subtotal,0),number_(o.discount,0),number_(o.shippingFee,0),number_(o.tax,0),number_(o.grandTotal,0)]);
    });
    var kind = String(format||'csv').toLowerCase();
    if(kind==='csv') {
      var csv = rows.map(function(r){return r.map(function(v){return '"'+String(v).replace(/"/g,'""')+'"';}).join(',');}).join('\n');
      return ok_({filename:'sales-report.csv',content:csv,mimeType:'text/csv;charset=utf-8'},'สร้าง CSV แล้ว');
    }
    if(kind!=='xlsx' && kind!=='pdf') throw new Error('รองรับ CSV, XLSX และ PDF');
    var temp = SpreadsheetApp.create('TEMP_Sales_Report_'+new Date().getTime());
    tempId = temp.getId();
    var sheet = temp.getSheets()[0];
    sheet.setName('Sales Report');
    sheet.getRange(1,1,rows.length,rows[0].length).setValues(rows);
    sheet.setFrozenRows(1);
    sheet.getRange(1,1,1,rows[0].length).setFontWeight('bold').setBackground('#dbeafe');
    sheet.autoResizeColumns(1,rows[0].length);
    SpreadsheetApp.flush();
    var mime = kind==='xlsx'?'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':'application/pdf';
    var extension = kind==='xlsx'?'xlsx':'pdf';
    var url = 'https://docs.google.com/spreadsheets/d/'+tempId+'/export?format='+extension;
    if(kind==='pdf') url += '&size=A4&portrait=false&fitw=true&sheetnames=false&printtitle=false&pagenumbers=true&gridlines=false&fzr=true';
    var response = UrlFetchApp.fetch(url,{headers:{Authorization:'Bearer '+ScriptApp.getOAuthToken()},muteHttpExceptions:true});
    if(response.getResponseCode()<200 || response.getResponseCode()>=300) throw new Error('Google ไม่สามารถสร้างไฟล์ '+extension.toUpperCase()+' ได้');
    var bytes = response.getContent();
    var base64 = Utilities.base64Encode(bytes);
    log_('Export Report','Reports',extension.toUpperCase(),user.username);
    return ok_({filename:'sales-report.'+extension,mimeType:mime,contentBase64:base64},'สร้างไฟล์ '+extension.toUpperCase()+' แล้ว');
  } catch(e) {
    return fail_(safeError_(e));
  } finally {
    if(tempId) { try { DriveApp.getFileById(tempId).setTrashed(true); } catch(cleanupError) {} }
  }
}

/* ----------------------------- CUSTOMER PROFILE -------------------------- */
function getCustomerProfile(customerToken) {
  try {
    ensureTableColumns_('Customers', ['id','username','firstname','lastname','phone','email','emailVerified','gender','birthDate','profileImage','updatedAt']);
    var customer = requireCustomer_(customerToken);
    return ok_({ customer: publicCustomer_(customer) }, 'โหลดข้อมูลส่วนตัวแล้ว');
  } catch (error) { return fail_(safeError_(error)); }
}

function updateCustomerProfile(customerToken, data) {
  try {
    var customer = requireCustomer_(customerToken);
    data = data || {};
    ensureTableColumns_('Customers', ['id','username','firstname','lastname','phone','email','emailVerified','gender','birthDate','profileImage','updatedAt']);

    var username = text_(data.username === undefined ? customer.username : data.username, 80).trim().toLowerCase();
    if (!username) throw new Error('กรุณากรอกชื่อผู้ใช้');
    if (username.indexOf('@') >= 0) username = normalizeRegistrationEmail_(username);
    else if (!/^[a-z0-9._-]{3,80}$/.test(username)) throw new Error('ชื่อผู้ใช้ต้องมี 3-80 ตัวอักษร และใช้ได้เฉพาะ a-z, 0-9, จุด, ขีดล่าง หรือขีดกลาง');

    var customers = readTable_('Customers', false);
    var duplicateUsername = customers.some(function(row) {
      return String(row.id) !== String(customer.id) && (String(row.username || '').toLowerCase() === username || String(row.email || '').toLowerCase() === username);
    });
    if (duplicateUsername) throw new Error('ชื่อผู้ใช้นี้มีคนใช้แล้ว กรุณาเลือกชื่ออื่น');

    var firstname = text_(data.firstname === undefined ? customer.firstname : data.firstname, 100).trim();
    var lastname = text_(data.lastname === undefined ? customer.lastname : data.lastname, 100).trim();
    var phone = text_(data.phone === undefined ? customer.phone : data.phone, 40).trim();
    if (phone && !/^[0-9+()\-\s]{6,40}$/.test(phone)) throw new Error('กรุณากรอกหมายเลขโทรศัพท์ให้ถูกต้อง');

    var gender = text_(data.gender === undefined ? customer.gender : data.gender, 30).trim();
    var allowedGenders = ['', 'male', 'female', 'other', 'prefer_not_to_say'];
    if (allowedGenders.indexOf(gender) < 0) throw new Error('กรุณาเลือกเพศจากรายการที่กำหนด');

    var birthDate = text_(data.birthDate === undefined ? customer.birthDate : data.birthDate, 10).trim();
    if (birthDate) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) throw new Error('รูปแบบวันเกิดไม่ถูกต้อง');
      var parts = birthDate.split('-').map(Number), birth = new Date(parts[0], parts[1] - 1, parts[2]);
      if (birth.getFullYear() !== parts[0] || birth.getMonth() !== parts[1] - 1 || birth.getDate() !== parts[2]) throw new Error('วันเกิดไม่ถูกต้อง');
      var today = new Date(); today.setHours(0,0,0,0);
      if (birth.getTime() > today.getTime()) throw new Error('วันเกิดต้องไม่เป็นวันที่ในอนาคต');
    }

    var image = text_(data.profileImage === undefined ? customer.profileImage : data.profileImage, 1000);
    var assetRows = readTable_('DriveAssets', true);
    var tokenMatch = image.match(/^drive-asset:\/\/([A-Za-z0-9_-]{20,80})$/i);
    var driveId = '';
    if (tokenMatch) {
      var tokenAsset = assetRows.filter(function(row) {
        return row.id === tokenMatch[1] && row.access === 'owner' && row.folder === 'Customers' && row.ownerType === 'customer' && row.ownerId === customer.id && row.status === 'Active';
      })[0];
      if (!tokenAsset) throw new Error('รูปโปรไฟล์นี้ไม่ได้เป็นของบัญชีคุณ');
      driveId = tokenAsset.fileId;
    } else {
      var isDriveImage = /^(drive-private:\/\/|https:\/\/lh\d*\.googleusercontent\.com\/d\/|https:\/\/drive\.google\.com\/)/i.test(image);
      if (isDriveImage) {
        driveId = extractDriveIdFromAssetValue_(image);
        if (!driveId) throw new Error('URL รูปโปรไฟล์ Google Drive ไม่ถูกต้อง');
        var ownedAsset = assetRows.filter(function(row) {
          return row.fileId === driveId && row.access === 'owner' && row.folder === 'Customers' && row.ownerType === 'customer' && row.ownerId === customer.id && row.status === 'Active';
        })[0];
        if (!ownedAsset) {
          var driveFile = DriveApp.getFileById(driveId);
          var description = String(driveFile.getDescription() || '');
          var belongsToCustomer = isFileInSystemFolder_(driveFile, 'Customers') &&
            (description === 'EcommerceCustomerProfile|' + customer.id || extractDriveIdFromAssetValue_(customer.profileImage) === driveId);
          if (!belongsToCustomer) throw new Error('รูปโปรไฟล์นี้ไม่ได้เป็นของบัญชีคุณ');
        }
      } else if (image && !/^https:\/\//i.test(image)) throw new Error('URL รูปโปรไฟล์ไม่ถูกต้อง');
    }
    if (driveId) image = driveProfileImageUrl_(driveId);

    var changes = {
      username: username, firstname: firstname, lastname: lastname, phone: phone,
      gender: gender, birthDate: birthDate, profileImage: image, updatedAt: now_()
    };
    updateRecord_('Customers', customer.id, changes);
    SpreadsheetApp.flush();
    var verifiedCustomer = findRecordByExactColumn_('Customers', 'id', customer.id);
    if (!verifiedCustomer || String(verifiedCustomer.username || '') !== username || String(verifiedCustomer.gender || '') !== gender || String(verifiedCustomer.birthDate || '') !== birthDate || String(verifiedCustomer.profileImage || '').trim() !== image) {
      throw new Error('บันทึกข้อมูลแล้ว แต่ตรวจสอบข้อมูลที่บันทึกไม่ครบ กรุณาลองใหม่');
    }
    log_('Update Customer Profile', 'Customer Account', 'Updated profile fields', customer.username);
    return ok_({ customer: publicCustomer_(verifiedCustomer), savedToSheet: true, sheet: 'Customers' }, 'บันทึกข้อมูลส่วนตัวแล้ว');
  } catch (error) { return fail_(safeError_(error)); }
}

function sendCustomerProfileEmailOtp_(email, otp) {
  if (MailApp.getRemainingDailyQuota() < 1) throw new Error('วันนี้ระบบส่งอีเมลครบโควตาแล้ว กรุณาลองใหม่ภายหลัง');
  var settings = getSettings(), store = settings && settings.success ? (settings.data || {}) : {};
  var brand = text_(store.storeName || 'Marketplace', 100);
  var subject = 'รหัสยืนยันการเปลี่ยนอีเมล ' + brand;
  var textBody = 'รหัสยืนยันการเปลี่ยนอีเมลของคุณคือ ' + otp + '\nรหัสนี้หมดอายุภายใน 5 นาที ใช้ได้ครั้งเดียว และกรอกผิดได้ไม่เกิน 5 ครั้ง\nห้ามส่งต่อรหัสนี้ให้ผู้อื่น';
  var safeBrand = brand.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  var htmlBody = '<div style="margin:0;padding:28px;background:#f4f6fa;font-family:Arial,sans-serif;color:#1f2937"><div style="max-width:520px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:28px"><b style="color:#ee4d2d">'+safeBrand+'</b><h2>ยืนยันอีเมลใหม่</h2><p>ใช้รหัสนี้เพื่อยืนยันการเปลี่ยนอีเมลบัญชีของคุณ รหัสหมดอายุใน 5 นาที</p><div style="margin:24px 0;padding:18px;background:#fff4ef;border-radius:12px;text-align:center;font-size:32px;font-weight:700;letter-spacing:9px;color:#ee4d2d">'+otp+'</div><p style="color:#64748b">ห้ามส่งต่อรหัสนี้ให้ผู้อื่น หากคุณไม่ได้ร้องขอ ให้ละเว้นอีเมลฉบับนี้</p></div></div>';
  try { MailApp.sendEmail({to:email,subject:subject,body:textBody,htmlBody:htmlBody,name:brand}); }
  catch (error) { throw new Error('ส่งรหัสยืนยันอีเมลไม่สำเร็จ กรุณาตรวจสอบสิทธิ์ MailApp'); }
}

function requestCustomerEmailChange(customerToken, newEmail) {
  try {
    var customer = requireCustomer_(customerToken);
    ensureEmailOtpChallengesTable_();
    ensureTableColumns_('Customers', ['id','email','username']);
    var normalized = normalizeRegistrationEmail_(newEmail);
    if (normalized === String(customer.email || '').toLowerCase()) throw new Error('อีเมลนี้เป็นอีเมลปัจจุบันอยู่แล้ว');
    var collision = readTable_('Customers', false).some(function(row) {
      return String(row.id) !== String(customer.id) && (String(row.email || '').toLowerCase() === normalized || String(row.username || '').toLowerCase() === normalized);
    });
    if (collision) throw new Error('อีเมลนี้ถูกใช้กับบัญชีอื่นแล้ว');

    var quota = reserveEmailOtpSendQuota_(normalized), challengeId = newId_('EOTP'), otp = createEmailRegistrationOtp_();
    var expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();
    try { sendCustomerProfileEmailOtp_(normalized, otp); }
    catch (sendError) { releaseEmailOtpSendQuota_(quota); throw sendError; }
    readTable_('EmailOtpChallenges', false).forEach(function(row) {
      if (row.userId === customer.id && row.purpose === 'ProfileEmailChange' && row.status === 'Sent') updateRecord_('EmailOtpChallenges', row.id, {status:'Superseded'});
    });
    appendRecord_('EmailOtpChallenges', {
      id: challengeId, email: normalized, purpose: 'ProfileEmailChange', userId: customer.id,
      codeHash: sha256_('profile-email-change-otp|' + getEmailOtpHashPepper_() + '|' + challengeId + '|' + normalized + '|' + otp),
      status: 'Sent', attempts: 0, expiresAt: expiresAt, lastSentAt: now_(), registrationTicketHash: '',
      registrationTicketExpiresAt: '', verifiedAt: '', consumedAt: '', createdAt: now_()
    });
    return ok_({challengeId:challengeId,email:normalized,maskedEmail:maskEmailForDisplay_(normalized),expiresAt:expiresAt}, 'ส่งรหัส OTP ไปยังอีเมลใหม่แล้ว');
  } catch (error) { return fail_(safeError_(error)); }
}

function verifyCustomerEmailChangeOtp(customerToken, challengeId, newEmail, otp) {
  try {
    var customer = requireCustomer_(customerToken);
    ensureEmailOtpChallengesTable_();
    var normalized = normalizeRegistrationEmail_(newEmail), id = text_(challengeId, 100), code = String(otp || '').replace(/\D/g, '');
    return withLock_(function() {
      var challenge = findRecordByExactColumn_('EmailOtpChallenges', 'id', id);
      if (!challenge || challenge.purpose !== 'ProfileEmailChange' || challenge.userId !== customer.id || String(challenge.email || '').toLowerCase() !== normalized || challenge.status !== 'Sent') throw new Error('คำขอยืนยันอีเมลนี้ไม่ถูกต้องหรือถูกใช้ไปแล้ว');
      if (new Date(challenge.expiresAt).getTime() <= Date.now()) { updateRecord_('EmailOtpChallenges', id, {status:'Expired'}); throw new Error('รหัส OTP หมดอายุแล้ว กรุณาขอรหัสใหม่'); }
      var attempts = number_(challenge.attempts, 0);
      if (attempts >= 5) { updateRecord_('EmailOtpChallenges', id, {status:'Blocked'}); throw new Error('กรอกรหัส OTP ผิดเกินกำหนด กรุณาขอรหัสใหม่'); }
      var expected = sha256_('profile-email-change-otp|' + getEmailOtpHashPepper_() + '|' + id + '|' + normalized + '|' + code);
      if (!/^\d{6}$/.test(code) || !constantTimeEqual_(expected, challenge.codeHash)) {
        attempts++;
        updateRecord_('EmailOtpChallenges', id, {attempts:attempts,status:attempts >= 5 ? 'Blocked' : 'Sent'});
        throw new Error(attempts >= 5 ? 'กรอกรหัส OTP ผิดเกินกำหนด กรุณาขอรหัสใหม่' : 'รหัส OTP ไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง');
      }
      var collision = readTable_('Customers', false).some(function(row) {
        return String(row.id) !== String(customer.id) && (String(row.email || '').toLowerCase() === normalized || String(row.username || '').toLowerCase() === normalized);
      });
      if (collision) throw new Error('อีเมลนี้ถูกใช้กับบัญชีอื่นแล้ว กรุณาเริ่มใหม่');
      updateRecord_('Customers', customer.id, {email:normalized,emailVerified:true,updatedAt:now_()});
      updateRecord_('EmailOtpChallenges', id, {status:'Completed',attempts:attempts,verifiedAt:now_(),consumedAt:now_()});
      SpreadsheetApp.flush();
      var updated = findRecordByExactColumn_('Customers', 'id', customer.id);
      return ok_({customer:publicCustomer_(updated)}, 'ยืนยันและเปลี่ยนอีเมลสำเร็จ');
    });
  } catch (error) { return fail_(safeError_(error)); }
}

function changeCustomerPassword(customerToken,currentPassword,newPassword){try{var c=requireCustomer_(customerToken);var raw=readTable_('Customers',false).filter(function(x){return x.id===c.id;})[0];if(!verifyPassword_(currentPassword,raw.passwordHash))throw new Error('รหัสผ่านปัจจุบันไม่ถูกต้อง');if(String(newPassword||'').length<8)throw new Error('รหัสผ่านใหม่ต้องมีอย่างน้อย 8 ตัวอักษร');updateRecord_('Customers',c.id,{passwordHash:hashPassword_(newPassword),updatedAt:now_()});return ok_(true,'เปลี่ยนรหัสผ่านแล้ว');}catch(e){return fail_(safeError_(e));}}


/* ------------------------ PASSWORD RESET / NEWSLETTER -------------------- */
function requestPasswordReset(email, accountType) {
  try {
    var type = accountType === 'customer' ? 'customer' : 'admin';
    var address = text_(email, 160).toLowerCase();
    var rows = readTable_(type === 'customer' ? 'Customers' : 'Users', false);
    var user = rows.filter(function(x) {
      return type === 'customer' ? String(x.email).toLowerCase() === address : (String(x.email || '').toLowerCase() === address || String(x.username).toLowerCase() === address);
    })[0];
    if (user && user.status === 'Active' && (type === 'customer' || (user.email && String(user.email).indexOf('@') > 0))) {
      var token = Utilities.getUuid().replace(/-/g, '') + Utilities.getUuid().replace(/-/g, '');
      var expires = new Date(Date.now() + 30 * 60 * 1000).toISOString();
      appendRecord_('PasswordResets', {id:newId_('RST'),tokenHash:sha256_(token),accountType:type,userId:user.id,expiresAt:expires,usedAt:'',createdAt:now_()});
      var link = getWebAppUrl_() + '?reset=' + encodeURIComponent(token) + '&type=' + type;
      var body = 'มีคำขอตั้งรหัสผ่านใหม่สำหรับบัญชีของคุณ\n\nเปิดลิงก์นี้ภายใน 30 นาที:\n' + link + '\n\nหากคุณไม่ได้เป็นผู้ร้องขอ สามารถละเว้นอีเมลนี้ได้';
      MailApp.sendEmail(user.email, 'ตั้งรหัสผ่านใหม่สำหรับร้านค้าออนไลน์', body);
    }
    return ok_(true, 'หากพบอีเมลในระบบ ระบบจะส่งลิงก์ตั้งรหัสผ่านไปให้ กรุณาตรวจสอบกล่องจดหมาย');
  } catch (e) { return fail_(safeError_(e)); }
}
function resetPassword(resetToken, newPassword) {
  try {
    if (String(newPassword || '').length < 8) throw new Error('รหัสผ่านใหม่ต้องมีอย่างน้อย 8 ตัวอักษร');
    var hash = sha256_(resetToken || '');
    var row = readTable_('PasswordResets', false).filter(function(x) { return x.tokenHash === hash && !x.usedAt && new Date(x.expiresAt).getTime() > Date.now(); })[0];
    if (!row) throw new Error('ลิงก์ตั้งรหัสผ่านไม่ถูกต้องหรือหมดอายุแล้ว');
    var table = row.accountType === 'customer' ? 'Customers' : 'Users';
    updateRecord_(table, row.userId, table === 'Users' ? {passwordHash:hashPassword_(newPassword),mustChangePassword:false,updatedAt:now_()} : {passwordHash:hashPassword_(newPassword),updatedAt:now_()});
    updateRecord_('PasswordResets', row.id, {usedAt:now_()});
    var userSessions = readTable_('Sessions', false).filter(function(s) { return s.userId === row.userId && s.accountType === row.accountType && !s.revokedAt; });
    userSessions.forEach(function(s) { updateSessionRevoked_(s.tokenHash); });
    return ok_(true, 'ตั้งรหัสผ่านใหม่แล้ว กรุณาเข้าสู่ระบบอีกครั้ง');
  } catch (e) { return fail_(safeError_(e)); }
}
function subscribeNewsletter(email) {
  try {
    var address = text_(email, 160).toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(address)) throw new Error('กรุณากรอกอีเมลให้ถูกต้อง');
    var old = readTable_('Newsletters', false).filter(function(x) { return x.email === address; })[0];
    if (old) updateRecord_('Newsletters', old.id, {status:'Active'});
    else appendRecord_('Newsletters', {id:newId_('NEWS'),email:address,status:'Active',createdAt:now_()});
    return ok_(true, 'สมัครรับข่าวสารแล้ว');
  } catch (e) { return fail_(safeError_(e)); }
}
function getNewsletters(token) {
  try { requireAdmin_(token, 'customers.view'); return ok_(readTable_('Newsletters', false)); }
  catch (e) { return fail_(safeError_(e)); }
}

/* ----------------------- ADMIN ENTERPRISE DATA GRID ---------------------- */
/**
 * Server-side filtering, ordering and pagination for Owner tables.
 * Sorting always defaults to CreatedAt DESC (or Timestamp for Logs). UpdatedAt
 * is intentionally never used as the default sort key, so editing a record
 * does not move it to the top of the table.
 */
function getAdminGridPage(token, moduleName, options) {
  try {
    options = options || {};
    var moduleMap = {
      products: {table:'Products', permission:'products.view', search:['id','sku','barcode','name','brand','categoryId','sellerId'], status:'status', totals:['stock']},
      categories: {table:'Categories', permission:'categories.view', search:['id','name','slug','description','parentId'], status:'status', totals:[]},
      inventory: {table:'Inventory', permission:'inventory.view', search:['id','productId','productName','variantName','sku'], status:'', totals:['quantity','reserved','available']},
      orders: {table:'Orders', permission:'orders.view', search:['id','orderNumber','customerName','phone','email','paymentMethod','trackingNumber'], status:'orderStatus', totals:['subtotal','discount','shippingFee','tax','grandTotal']},
      payments: {table:'Payments', permission:'payments.view', search:['id','orderId','orderNumber','customerName','reference','paymentMethod','verifiedBy'], status:'status', totals:['amount']},
      shipping: {table:'ShippingMethods', permission:'shipping.view', search:['id','name','method'], status:'status', totals:[]},
      customers: {table:'Customers', permission:'customers.view', search:['id','username','firstname','lastname','phone','email'], status:'status', totals:[]},
      sellers: {table:'Stores', permission:'sellers.manage', search:['id','shopName','ownerName','ownerEmail','ownerPhone','slug'], status:'status', totals:['followerCount']},
      flashDeals: {table:'FlashDeals', permission:'promotions.manage', search:['id','name','shopName','productName','sellerId','productId'], status:'status', totals:['quota','soldCount','remaining']},
      marketplaceReturns: {table:'ReturnRequests', permission:'returns.manage', search:['id','orderId','orderItemId','reason','details','status'], status:'status', totals:['quantity']},
      marketplacePayouts: {table:'SellerPayouts', permission:'payouts.manage', search:['id','sellerOrderId','shopName','payoutReference','status'], status:'status', totals:['grossAmount','discountAmount','commissionAmount','netAmount']},
      promotions: {table:'Promotions', permission:'promotions.view', search:['id','name','type','value','productIds','categoryIds'], status:'status', totals:[]},
      coupons: {table:'Coupons', permission:'coupons.view', search:['id','code','title','sellerId'], status:'status', totals:['usedCount']},
      reviews: {table:'Reviews', permission:'reviews.view', search:['id','productId','productName','customerId','orderId','review'], status:'status', totals:[]},
      banners: {table:'Banners', permission:'banners.view', search:['id','title','description','position','url'], status:'status', totals:[]},
      users: {table:'Users', permission:'users.view', search:['id','username','name','email','role'], status:'status', totals:[]},
      logs: {table:'Logs', permission:'logs.view', search:['id','username','action','module','detail'], status:'', totals:[]},
      newsletters: {table:'Newsletters', permission:'customers.view', search:['id','email'], status:'status', totals:[]},
      backup: {table:'Backups', permission:'backup.manage', search:['id','fileName','createdBy','status'], status:'status', totals:[]}
    };
    var config = moduleMap[String(moduleName || '')];
    if (!config) throw new Error('ไม่รองรับตารางที่ร้องขอ');
    requireAdmin_(token, config.permission);

    var rows = readTable_(config.table, true).map(function(row, index) {
      var copy = JSON.parse(JSON.stringify(row));
      copy.__gridSourceIndex = index;
      return copy;
    });

    // Join display-only fields without exposing password hashes or session data.
    if (moduleName === 'products') {
      var inventoryRows = readTable_('Inventory', true), variants = readTable_('ProductVariants', true), categories = readTable_('Categories', true), stores = readTable_('Stores', true);
      rows.forEach(function(p) {
        var child = variants.filter(function(v) { return String(v.productId) === String(p.id) && v.status === 'Active'; });
        if (child.length) {
          p.stock = child.reduce(function(sum, v) {
            var inv = inventoryRows.filter(function(x) { return String(x.productId) === String(p.id) && String(x.variantId) === String(v.id); })[0];
            return sum + (inv ? Math.max(0, number_(inv.quantity, 0) - number_(inv.reserved, 0)) : number_(v.stock, 0));
          }, 0);
        } else {
          var base = inventoryRows.filter(function(x) { return String(x.productId) === String(p.id) && !x.variantId; })[0];
          if (base) p.stock = Math.max(0, number_(base.quantity, 0) - number_(base.reserved, 0));
        }
        var cat = categories.filter(function(x) { return String(x.id) === String(p.categoryId); })[0];
        var store = stores.filter(function(x) { return String(x.id) === String(p.sellerId); })[0];
        p.categoryName = cat ? cat.name : '';
        p.shopName = store ? store.shopName : '';
      });
    } else if (moduleName === 'inventory') {
      var products = readTable_('Products', true), productVariants = readTable_('ProductVariants', true);
      rows.forEach(function(x) {
        var p = products.filter(function(v) { return String(v.id) === String(x.productId); })[0] || {};
        var variant = productVariants.filter(function(v) { return String(v.id) === String(x.variantId); })[0] || {};
        x.productName = p.name || '';
        x.variantName = variant.variantName || '';
        x.sku = variant.sku || p.sku || '';
        x.available = Math.max(0, number_(x.quantity, 0) - number_(x.reserved, 0));
      });
    } else if (moduleName === 'payments') {
      var orderRows = readTable_('Orders', true);
      rows.forEach(function(x) {
        var o = orderRows.filter(function(v) { return String(v.id) === String(x.orderId); })[0] || {};
        x.orderNumber = o.orderNumber || '';
        x.customerName = o.customerName || '';
      });
    } else if (moduleName === 'sellers') {
      var customers = readTable_('Customers', true);
      rows.forEach(function(x) {
        var c = customers.filter(function(v) { return String(v.id) === String(x.ownerCustomerId); })[0] || {};
        x.ownerName = [c.firstname || '', c.lastname || ''].join(' ').trim();
        x.ownerEmail = c.email || '';
        x.ownerPhone = c.phone || '';
      });
    } else if (moduleName === 'flashDeals') {
      var dealProducts = readTable_('Products', true), dealStores = readTable_('Stores', true);
      rows.forEach(function(x) {
        var p = dealProducts.filter(function(v) { return String(v.id) === String(x.productId); })[0] || {};
        var s = dealStores.filter(function(v) { return String(v.id) === String(x.sellerId); })[0] || {};
        x.productName = p.name || '';
        x.shopName = s.shopName || 'ร้านค้าหลัก';
        x.remaining = number_(x.quota, 0) > 0 ? Math.max(0, number_(x.quota, 0) - number_(x.soldCount, 0)) : '';
      });
    } else if (moduleName === 'marketplacePayouts') {
      var payoutStores = readTable_('Stores', true);
      rows.forEach(function(x) {
        var s = payoutStores.filter(function(v) { return String(v.id) === String(x.sellerId); })[0] || {};
        x.shopName = s.shopName || '';
      });
    } else if (moduleName === 'reviews') {
      var reviewProducts = readTable_('Products', true);
      rows.forEach(function(x) {
        var p = reviewProducts.filter(function(v) { return String(v.id) === String(x.productId); })[0] || {};
        x.productName = p.name || '';
      });
    }

    // Strip credentials, but preserve the source index internally until sorting is complete.
    rows = rows.map(function(row) {
      var sourceIndex = Number(row.__gridSourceIndex || 0);
      delete row.passwordHash; delete row.tokenHash; delete row.guestAccessToken;
      delete row.registrationTicketHash; delete row.codeHash;
      var safeRow = row;
      if (moduleName === 'customers') safeRow = publicCustomer_(row);
      else if (moduleName === 'users') safeRow = publicUser_(row);
      // Non-sensitive metadata needed by the admin grid: ordering, status filters and display.
      ['status','createdAt','updatedAt'].forEach(function(key) { if (row[key] !== undefined) safeRow[key] = row[key]; });
      safeRow.__gridSourceIndex = sourceIndex;
      return safeRow;
    });

    var total = rows.length;
    var statusOptions = config.status ? Array.from(new Set(rows.map(function(x) { return String(x[config.status] || '').trim(); }).filter(Boolean))).sort() : [];
    var search = text_(options.search, 160).toLowerCase();
    if (search) {
      rows = rows.filter(function(row) {
        return Object.keys(row).some(function(key) {
          var value = row[key];
          if (value === null || value === undefined || typeof value === 'object') return false;
          return String(value).toLowerCase().indexOf(search) >= 0;
        });
      });
    }
    if (options.status && config.status) {
      var statusValue = String(options.status);
      rows = rows.filter(function(row) {
        return String(row[config.status] || '') === statusValue;
      });
    }
    var dateField = moduleName === 'logs' ? 'timestamp' : (moduleName === 'payments' ? 'paymentDate' : 'createdAt');
    if (options.dateFrom || options.dateTo) {
      rows = rows.filter(function(row) {
        var raw = row[dateField] || row.createdAt || row.updatedAt || '';
        if (!raw) return false;
        var date = new Date(raw);
        if (isNaN(date.getTime())) return false;
        var day = Utilities.formatDate(date, Session.getScriptTimeZone(), 'yyyy-MM-dd');
        if (options.dateFrom && day < String(options.dateFrom)) return false;
        if (options.dateTo && day > String(options.dateTo)) return false;
        return true;
      });
    }
    var filteredTotal = rows.length;
    var sortKey = String(options.sortKey || (moduleName === 'logs' ? 'timestamp' : 'createdAt'));
    if (!/^[A-Za-z0-9_]+$/.test(sortKey)) sortKey = moduleName === 'logs' ? 'timestamp' : 'createdAt';
    var sortDir = String(options.sortDir || 'desc').toLowerCase() === 'asc' ? 'asc' : 'desc';
    var dateSortKeys = ['createdAt','timestamp','paymentDate','approvedAt','paidAt','startDate','endDate','updatedAt','deliveredAt','shippedAt'];
    var sortRows = rows.map(function(row, index) { return {row:row, index:index, sourceIndex:number_(row.__gridSourceIndex, index)}; });
    sortRows.sort(function(a, b) {
      var av = a.row[sortKey], bv = b.row[sortKey], comparison = 0;
      if (dateSortKeys.indexOf(sortKey) >= 0 || /Date$/.test(sortKey)) {
        var ad = av ? new Date(av).getTime() : NaN, bd = bv ? new Date(bv).getTime() : NaN;
        if (!isNaN(ad) && !isNaN(bd)) comparison = ad - bd;
        else if (!isNaN(ad)) comparison = 1;
        else if (!isNaN(bd)) comparison = -1;
      } else {
        var an = av === '' || av === null || av === undefined ? NaN : Number(av);
        var bn = bv === '' || bv === null || bv === undefined ? NaN : Number(bv);
        if (!isNaN(an) && !isNaN(bn) && String(av).trim() !== '' && String(bv).trim() !== '') comparison = an - bn;
        else comparison = String(av === undefined ? '' : av).localeCompare(String(bv === undefined ? '' : bv), 'th', {numeric:true, sensitivity:'base'});
      }
      if (comparison !== 0) return sortDir === 'asc' ? comparison : -comparison;
      // Stable tie-breaker: newest appended record first; edits never change this index.
      var sourceOrder = b.sourceIndex - a.sourceIndex;
      return sourceOrder || (a.index - b.index);
    });
    rows = sortRows.map(function(x) {
      delete x.row.__gridSourceIndex;
      return x.row;
    });

    var summary = {};
    config.totals.forEach(function(key) {
      summary[key] = rows.reduce(function(sum, row) { return sum + number_(row[key], 0); }, 0);
    });
    if (moduleName === 'inventory') summary.available = rows.reduce(function(sum, row) { return sum + Math.max(0, number_(row.quantity, 0) - number_(row.reserved, 0)); }, 0);

    var exportAll = options.exportAll === true;
    var pageSize = exportAll ? Math.min(Math.max(filteredTotal, 1), 5000) : Number(options.pageSize || 10);
    if (!exportAll && [10,25,50,100].indexOf(pageSize) < 0) pageSize = 10;
    var pages = exportAll ? 1 : Math.max(1, Math.ceil(filteredTotal / pageSize));
    var page = exportAll ? 1 : Math.max(1, Math.min(pages, Math.floor(Number(options.page || 1)) || 1));
    var items = rows.slice((page - 1) * pageSize, page * pageSize);
    return ok_({items:items,total:total,filteredTotal:filteredTotal,page:page,pageSize:pageSize,pages:pages,summary:summary,statusOptions:statusOptions,sortKey:sortKey,sortDir:sortDir,exportLimited:exportAll && filteredTotal > items.length}, 'โหลดข้อมูลตารางแล้ว');
  } catch (error) {
    return fail_(safeError_(error));
  }
}

/* ------------------------------ HEALTH CHECK ----------------------------- */
function systemHealth(token){try{requireAdmin_(token,'settings.manage');var ss=getSpreadsheet_();var root=DriveApp.getFolderById(FOLDER_ID);var missing=[];Object.keys(SCHEMA_).forEach(function(n){if(!ss.getSheetByName(n))missing.push(n);});return ok_({version:APP_VERSION_,spreadsheet:ss.getName(),driveFolder:root.getName(),missingSheets:missing,webAppUrl:getWebAppUrl_(),serverTime:now_()});}catch(e){return fail_(safeError_(e));}}


/* ---------------------- CUSTOMER ACCOUNT SETTINGS ----------------------- */
function ensureCustomerAuxTable_(name) {
  var headers = SCHEMA_[name];
  if (!headers) throw new Error('ไม่พบโครงสร้างตารางที่ร้องขอ');
  var ss = getSpreadsheet_(), sh = ss.getSheetByName(name);
  if (!sh) { sh = ss.insertSheet(name); sh.getRange(1,1,1,headers.length).setValues([headers]); sh.setFrozenRows(1); }
  else {
    var last = Math.max(1, sh.getLastColumn()), existing = sh.getRange(1,1,1,last).getValues()[0].map(function(v){return String(v||'').trim();});
    if (!existing.some(function(v){return !!v;})) { sh.getRange(1,1,1,headers.length).setValues([headers]); sh.setFrozenRows(1); }
    else { var missing = headers.filter(function(h){return existing.indexOf(h)<0;}); if(missing.length){sh.getRange(1,last+1,1,missing.length).setValues([missing]);sh.setFrozenRows(1);} }
  }
  return sh;
}
function customerDefaultPreferences_(customerId) {
  return {id:'CPF_'+customerId,customerId:customerId,profileReviewVisibility:false,personalizedOffers:false,orderNotifications:true,promotionNotifications:false,securityNotifications:true,defaultAddressId:'',defaultPaymentMethod:'bank_transfer',updatedAt:now_()};
}
function getCustomerPreferences(customerToken) {
  try {
    var c=requireCustomer_(customerToken);ensureCustomerAuxTable_('CustomerPreferences');
    var row=readTable_('CustomerPreferences',false).filter(function(x){return x.customerId===c.id;})[0]||customerDefaultPreferences_(c.id);
    var out=customerDefaultPreferences_(c.id);Object.keys(out).forEach(function(k){if(row[k]!==undefined&&row[k]!=='' )out[k]=row[k];});
    ['profileReviewVisibility','personalizedOffers','orderNotifications','promotionNotifications','securityNotifications'].forEach(function(k){out[k]=row[k]===undefined||row[k]===''?out[k]:parseBool_(row[k]);});
    return ok_(out);
  } catch(e) { return fail_(safeError_(e)); }
}
function saveCustomerPreferences(customerToken,data) {
  try {
    var c=requireCustomer_(customerToken);data=data||{};ensureCustomerAuxTable_('CustomerPreferences');
    var current=customerDefaultPreferences_(c.id),old=readTable_('CustomerPreferences',false).filter(function(x){return x.customerId===c.id;})[0]||{};
    Object.keys(current).forEach(function(k){if(old[k]!==undefined&&old[k]!=='')current[k]=old[k];});
    ['profileReviewVisibility','personalizedOffers','orderNotifications','promotionNotifications'].forEach(function(k){if(data[k]!==undefined)current[k]=parseBool_(data[k]);});current.securityNotifications=true;
    if(data.defaultAddressId!==undefined){var addressId=text_(data.defaultAddressId,100);if(addressId&&!readTable_('Addresses',false).some(function(a){return a.id===addressId&&a.customerId===c.id;}))throw new Error('ที่อยู่เริ่มต้นไม่ถูกต้อง');current.defaultAddressId=addressId;}
    if(data.defaultPaymentMethod!==undefined){var method=text_(data.defaultPaymentMethod,30);if(['bank_transfer','qr_payment','cod'].indexOf(method)<0)throw new Error('วิธีชำระเงินเริ่มต้นไม่ถูกต้อง');current.defaultPaymentMethod=method;}
    current.id='CPF_'+c.id;current.customerId=c.id;current.updatedAt=now_();upsertById_('CustomerPreferences',current);
    return ok_(current,'บันทึกการตั้งค่าแล้ว');
  } catch(e) { return fail_(safeError_(e)); }
}
function getCustomerBankAccounts(customerToken) {
  try {var c=requireCustomer_(customerToken);ensureCustomerAuxTable_('CustomerBankAccounts');var rows=readTable_('CustomerBankAccounts',false).filter(function(x){return x.customerId===c.id;}).sort(function(a,b){return (parseBool_(b.isDefault)?1:0)-(parseBool_(a.isDefault)?1:0)||new Date(b.createdAt)-new Date(a.createdAt);});return ok_(rows.map(function(x){return {id:x.id,bankName:x.bankName,accountName:x.accountName,accountLast4:x.accountLast4,isDefault:parseBool_(x.isDefault),createdAt:x.createdAt};}));}
  catch(e){return fail_(safeError_(e));}
}
function saveCustomerBankAccount(customerToken,data) {
  try {
    var c=requireCustomer_(customerToken);data=data||{};ensureCustomerAuxTable_('CustomerBankAccounts');
    var bank=text_(data.bankName,100),holder=text_(data.accountName,120),digits=String(data.accountNumber||'').replace(/\D/g,'');
    if(!bank||!holder||digits.length<6||digits.length>20)throw new Error('ข้อมูลบัญชีธนาคารไม่ถูกต้อง');
    var isDefault=parseBool_(data.isDefault),rows=readTable_('CustomerBankAccounts',false).filter(function(x){return x.customerId===c.id;}),hasDefault=rows.some(function(x){return parseBool_(x.isDefault);}),makeDefault=isDefault||!hasDefault,now=now_();
    if(makeDefault)rows.forEach(function(x){if(parseBool_(x.isDefault))updateRecord_('CustomerBankAccounts',x.id,{isDefault:false,updatedAt:now});});
    var row={id:newId_('CBK'),customerId:c.id,bankName:bank,accountName:holder,accountLast4:digits.slice(-4),isDefault:makeDefault,createdAt:now,updatedAt:now};appendRecord_('CustomerBankAccounts',row);
    return ok_({id:row.id,bankName:row.bankName,accountName:row.accountName,accountLast4:row.accountLast4,isDefault:row.isDefault},'บันทึกบัญชีธนาคารแล้ว (เก็บเฉพาะเลขท้าย 4 หลัก)');
  } catch(e) { return fail_(safeError_(e)); }
}
function setDefaultCustomerBankAccount(customerToken,id) {
  try {var c=requireCustomer_(customerToken);ensureCustomerAuxTable_('CustomerBankAccounts');var rows=readTable_('CustomerBankAccounts',false).filter(function(x){return x.customerId===c.id;});if(!rows.some(function(x){return x.id===id;}))throw new Error('ไม่พบบัญชีธนาคาร');var now=now_();rows.forEach(function(x){updateRecord_('CustomerBankAccounts',x.id,{isDefault:x.id===id,updatedAt:now});});return ok_(true,'ตั้งบัญชีหลักแล้ว');}
  catch(e){return fail_(safeError_(e));}
}
function deleteCustomerBankAccount(customerToken,id) {
  try {var c=requireCustomer_(customerToken);ensureCustomerAuxTable_('CustomerBankAccounts');var rows=readTable_('CustomerBankAccounts',false),target=rows.filter(function(x){return x.id===id&&x.customerId===c.id;})[0];if(!target)throw new Error('ไม่พบบัญชีธนาคาร');deleteRows_('CustomerBankAccounts',function(x){return x.id===id&&x.customerId===c.id;});if(parseBool_(target.isDefault)){var next=readTable_('CustomerBankAccounts',false).filter(function(x){return x.customerId===c.id;})[0];if(next)updateRecord_('CustomerBankAccounts',next.id,{isDefault:true,updatedAt:now_()});}return ok_(true,'ลบบัญชีธนาคารแล้ว');}
  catch(e){return fail_(safeError_(e));}
}
