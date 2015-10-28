cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-certificates/www/certificate.js",
        "id": "cordova-plugin-certificates.Certificates",
        "clobbers": [
            "cordova.plugins.certificates"
        ]
    },
    {
        "file": "plugins/cordova-plugin-device/www/device.js",
        "id": "cordova-plugin-device.device",
        "clobbers": [
            "device"
        ]
    },
    {
        "file": "plugins/cordova-plugin-whitelist/whitelist.js",
        "id": "cordova-plugin-whitelist.whitelist",
        "runs": true
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-certificates": "0.6.2",
    "cordova-plugin-device": "1.0.1",
    "cordova-plugin-whitelist": "1.0.0"
}
// BOTTOM OF METADATA
});