/**
 * Copyright 2013 Archfirst
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Utilities
 *
 * @authors
 * Vikas Goyal
 */

/**
 *
 *  Base64 encode / decode
 *  http://www.webtoolkit.info/
 *
 **/

angular.module('bullsfirst')
    .factory('BASE64', function () {
        'use strict';

        return {
            // private property
            _keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',

            // public method for encoding
            encode: function (input) {
                var output = '';
                var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
                var i = 0;

                input = this._utf8_encode(input);

                while (i < input.length) {

                    chr1 = input.charCodeAt(i++);
                    chr2 = input.charCodeAt(i++);
                    chr3 = input.charCodeAt(i++);

                    enc1 = chr1 >> 2;
                    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                    enc4 = chr3 & 63;

                    if (isNaN(chr2)) {
                        enc3 = enc4 = 64;
                    } else if (isNaN(chr3)) {
                        enc4 = 64;
                    }

                    output = output +
                        this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
                        this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

                }

                return output;
            },

            // public method for decoding
            decode: function (input) {
                var output = '';
                var chr1, chr2, chr3;
                var enc1, enc2, enc3, enc4;
                var i = 0;

                input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');

                while (i < input.length) {

                    enc1 = this._keyStr.indexOf(input.charAt(i++));
                    enc2 = this._keyStr.indexOf(input.charAt(i++));
                    enc3 = this._keyStr.indexOf(input.charAt(i++));
                    enc4 = this._keyStr.indexOf(input.charAt(i++));

                    chr1 = (enc1 << 2) | (enc2 >> 4);
                    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                    chr3 = ((enc3 & 3) << 6) | enc4;

                    output = output + String.fromCharCode(chr1);

                    if (enc3 !== 64) {
                        output = output + String.fromCharCode(chr2);
                    }
                    if (enc4 !== 64) {
                        output = output + String.fromCharCode(chr3);
                    }

                }

                output = this._utf8_decode(output);

                return output;

            },

            // private method for UTF-8 encoding
            _utf8_encode: function (string) {
                string = string.replace(/\r\n/g, '\n');
                var utftext = '';

                for (var n = 0; n < string.length; n++) {

                    var c = string.charCodeAt(n);

                    if (c < 128) {
                        utftext += String.fromCharCode(c);
                    }
                    else if ((c > 127) && (c < 2048)) {
                        utftext += String.fromCharCode((c >> 6) | 192);
                        utftext += String.fromCharCode((c & 63) | 128);
                    }
                    else {
                        utftext += String.fromCharCode((c >> 12) | 224);
                        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                        utftext += String.fromCharCode((c & 63) | 128);
                    }

                }

                return utftext;
            },

            // private method for UTF-8 decoding
            _utf8_decode: function (utftext) {
                var string = '';
                var i = 0;
                var c = 0, c2 = 0, c3 = 0;

                while (i < utftext.length) {

                    c = utftext.charCodeAt(i);

                    if (c < 128) {
                        string += String.fromCharCode(c);
                        i++;
                    }
                    else if ((c > 191) && (c < 224)) {
                        c2 = utftext.charCodeAt(i + 1);
                        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                        i += 2;
                    }
                    else {
                        c2 = utftext.charCodeAt(i + 1);
                        c3 = utftext.charCodeAt(i + 2);
                        string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                        i += 3;
                    }

                }

                return string;
            }
        };
    })
    .factory('utilities', function () {
        'use strict';
        return {
            getWindowSize: function () {
                var myWidth = 0, myHeight = 0;
                if (typeof( window.innerWidth ) === 'number') {
                    //Non-IE
                    myWidth = window.innerWidth;
                    myHeight = window.innerHeight;
                } else if (document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight )) {
                    //IE 6+ in 'standards compliant mode'
                    myWidth = document.documentElement.clientWidth;
                    myHeight = document.documentElement.clientHeight;
                } else if (document.body && ( document.body.clientWidth || document.body.clientHeight )) {
                    //IE 4 compatible
                    myWidth = document.body.clientWidth;
                    myHeight = document.body.clientHeight;
                }
                return {
                    width: myWidth,
                    height: myHeight
                };
            },

            // Native JavaScript version of jQuery's .removeClass()
            clearClass: function(element, className) {            
                var classes = element.className,
                    arr = classes.slice(' '),
                    i,
                    len = arr.length,
                    cleanArr = [];

                for (i=0; i<len; i++) {
                    if (arr[i] !== className) {
                        cleanArr.push(arr[i]);
                    }
                }

                element.className = cleanArr.join(' ');

                return element;
            },

            // Native JavaScript version of jQuery's .click()
            triggerClick: function(el) {
                var event = document.createEvent('MouseEvents');

                event.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                el.dispatchEvent(event);
            }
        };

    });