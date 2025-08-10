"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var url_1 = require("url");
var fs_1 = require("fs");
var crypto_1 = require("crypto");
var path_1 = require("path");
var Config_js_1 = require("../../system/global/Config.js");
var file_type_1 = require("file-type");
var DataBase_js_1 = require("../../system/global/DataBase.js");
var __filename = (0, url_1.fileURLToPath)(import.meta.url);
var __dirname = path_1.default.dirname(__filename);
var FileManager = /** @class */ (function () {
    function FileManager() {
    }
    FileManager.goToTemp = function (filePath) {
        return __awaiter(this, void 0, void 0, function () {
            var tempDir, tempFilePath;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tempDir = path_1.default.join(__dirname, '../../storage/temp');
                        return [4 /*yield*/, fs_1.promises.mkdir(tempDir, { recursive: true })];
                    case 1:
                        _a.sent();
                        tempFilePath = path_1.default.join(tempDir, path_1.default.basename(filePath));
                        return [4 /*yield*/, fs_1.promises.copyFile(filePath, tempFilePath)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, tempFilePath];
                }
            });
        });
    };
    FileManager.saveToStorage = function (target, fileBuffer) {
        return __awaiter(this, void 0, void 0, function () {
            var targetDir, filePath;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        targetDir = path_1.default.join(__dirname, '../../storage');
                        return [4 /*yield*/, fs_1.promises.mkdir(targetDir, { recursive: true })];
                    case 1:
                        _a.sent();
                        filePath = path_1.default.join(targetDir, target);
                        return [4 /*yield*/, fs_1.promises.writeFile(filePath, fileBuffer)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    FileManager.saveFile = function (filePath, fileBuffer) {
        return __awaiter(this, void 0, void 0, function () {
            var ext, fileName, targetDir, fullPath;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getFileType(fileBuffer)];
                    case 1:
                        ext = _a.sent();
                        fileName = "".concat(this.hashBuffer(fileBuffer), ".").concat(ext);
                        targetDir = path_1.default.join(__dirname, "../../storage/".concat(filePath));
                        return [4 /*yield*/, fs_1.promises.mkdir(targetDir, { recursive: true })];
                    case 2:
                        _a.sent();
                        fullPath = path_1.default.join(targetDir, fileName);
                        return [4 /*yield*/, fs_1.promises.writeFile(fullPath, fileBuffer)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, fileName];
                }
            });
        });
    };
    FileManager.deleteFromStorage = function (target) {
        return __awaiter(this, void 0, void 0, function () {
            var targetDir;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        targetDir = path_1.default.join(__dirname, "../../storage/".concat(target));
                        return [4 /*yield*/, fs_1.promises.rm(targetDir, { recursive: true, force: true })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    FileManager.getFromStorage = function (target) {
        return __awaiter(this, void 0, void 0, function () {
            var targetDir, fileBuffer;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        targetDir = path_1.default.join(__dirname, "../../storage/".concat(target));
                        return [4 /*yield*/, fs_1.promises.readFile(targetDir)];
                    case 1:
                        fileBuffer = _b.sent();
                        _a = {
                            buffer: fileBuffer
                        };
                        return [4 /*yield*/, this.getFileType(fileBuffer)];
                    case 2: return [2 /*return*/, (_a.ext = _b.sent(),
                            _a)];
                }
            });
        });
    };
    FileManager.getFromWebStorage = function (target) {
        return __awaiter(this, void 0, void 0, function () {
            var targetDir, fileBuffer, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        targetDir = "".concat(Config_js_1.default.WEB_STORAGE).concat(target);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, fs_1.promises.readFile(targetDir)];
                    case 2:
                        fileBuffer = _a.sent();
                        return [2 /*return*/, fileBuffer];
                    case 3:
                        err_1 = _a.sent();
                        if (err_1.code === 'ENOENT') {
                            return [2 /*return*/, undefined];
                        }
                        throw err_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    FileManager.getFileType = function (buffer) {
        return __awaiter(this, void 0, void 0, function () {
            var fileType, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, file_type_1.fileTypeFromBuffer)(buffer)];
                    case 1:
                        fileType = _b.sent();
                        if (!fileType || !fileType.ext) {
                            throw new Error('Не удалось определить расширение файла');
                        }
                        return [2 /*return*/, fileType.ext];
                    case 2:
                        _a = _b.sent();
                        return [2 /*return*/, 'undefined'];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    FileManager.getFileByID = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var file, buffer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, DataBase_js_1.dbQueryM)('SELECT * FROM `files` WHERE `id` = ?', [id])];
                    case 1:
                        file = _a.sent();
                        if (!(file.length > 0)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.getFromStorage("/messenger/pools/".concat(file[0].pool, "/").concat(file[0].name))];
                    case 2:
                        buffer = _a.sent();
                        return [2 /*return*/, buffer];
                    case 3: return [2 /*return*/, null];
                }
            });
        });
    };
    FileManager.hashBuffer = function (buffer, algorithm) {
        if (algorithm === void 0) { algorithm = 'sha256'; }
        return crypto_1.default.createHash(algorithm).update(buffer).digest('hex');
    };
    return FileManager;
}());
exports.default = FileManager;
