/**
 * Load a single extension.
 * @param  {string} extension - extension path.
 * @return {Promise} that resolves to an extension module handle
 */
export declare var load_extension: (extension: any) => Promise<{}>;
/**
 * Load multiple extensions.
 * Takes n-args, where each arg is a string path to the extension.
 * @return {Promise} that resolves to a list of loaded module handles.
 */
export declare var load_extensions: () => Promise<void>;
/**
 * Wait for a config section to load, and then load the extensions specified
 * in a 'load_extensions' key inside it.
 */
export declare function load_extensions_from_config(section: any): void;
/**
 * Splits a string into an array of strings using a regex or string
 * separator. Matches of the separator are not included in the result array.
 * However, if `separator` is a regex that contains capturing groups,
 * backreferences are spliced into the result each time `separator` is
 * matched. Fixes browser bugs compared to the native
 * `String.prototype.split` and can be used reliably cross-browser.
 * @param {String} str String to split.
 * @param {RegExp} separator Regex to use for separating
 *     the string.
 * @param {Number} [limit] Maximum number of items to include in the result
 *     array.
 * @returns {Array} Array of substrings.
 * @example
 *
 * // Basic use
 * regex_split('a b c d', ' ');
 * // -> ['a', 'b', 'c', 'd']
 *
 * // With limit
 * regex_split('a b c d', ' ', 2);
 * // -> ['a', 'b']
 *
 * // Backreferences in result array
 * regex_split('..word1 word2..', /([a-z]+)(\d+)/i);
 * // -> ['..', 'word', '1', ' ', 'word', '2', '..']
 */
export declare var regex_split: (str: any, separator: any, limit: any) => any[];
export declare var uuid: () => string;
export declare function xmlencode(string: any): any;
export declare var ansi_colormap: {
    "30": string;
    "31": string;
    "32": string;
    "33": string;
    "34": string;
    "35": string;
    "36": string;
    "37": string;
    "40": string;
    "41": string;
    "42": string;
    "43": string;
    "44": string;
    "45": string;
    "46": string;
    "47": string;
    "01": string;
};
export declare function ansispan(str: any): any;
export declare function fixConsole(txt: any): any;
export declare function fixCarriageReturn(txt: any): any;
export declare function autoLinkUrls(txt: any): any;
export declare var points_to_pixels: (points: any) => number;
export declare var always_new: (constructor: any) => () => any;
export declare var url_path_join: () => string;
export declare var url_path_split: (path: any) => any[];
export declare var parse_url: (url: any) => HTMLAnchorElement;
export declare var encode_uri_components: (uri: any) => any;
export declare var url_join_encode: () => any;
export declare var splitext: (filename: any) => any[];
export declare var escape_html: (text: any) => string;
export declare var get_body_data: (key: any) => any;
export declare var to_absolute_cursor_pos: (cm: any, cursor: any) => any;
export declare var from_absolute_cursor_pos: (cm: any, cursor_pos: any) => {
    line: any;
    ch: number;
};
export declare var browser: any;
export declare var platform: string;
export declare var get_url_param: (name: any) => string;
export declare var is_or_has: (a: any, b: any) => any;
export declare var is_focused: (e: any) => boolean;
export declare var mergeopt: (_class: any, options: any, overwrite: any) => any;
export declare var ajax_error_msg: (jqXHR: any) => any;
export declare var log_ajax_error: (jqXHR: any, status: any, error: any) => void;
export declare var requireCodeMirrorMode: (mode: any, callback: any, errback: any) => void;
/**
 * Wraps an AJAX error as an Error object.
 */
export declare var wrap_ajax_error: (jqXHR: any, status: any, error: any) => Error;
export declare var promising_ajax: (url: any, settings: any) => Promise<{}>;
export declare var WrappedError: (message: any, error: any) => any;
export declare var load_class: (class_name: any, module_name: any, registry: any) => Promise<{}>;
export declare var reject: (message: any, log: any) => (error: any) => Promise<any>;
