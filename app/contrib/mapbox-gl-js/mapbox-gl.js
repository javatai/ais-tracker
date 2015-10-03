(function(f) {
    if (typeof exports === "object" && typeof module !== "undefined") {
        module.exports = f()
    } else if (typeof define === "function" && define.amd) {
        define([], f)
    } else {
        var g;
        if (typeof window !== "undefined") {
            g = window
        } else if (typeof global !== "undefined") {
            g = global
        } else if (typeof self !== "undefined") {
            g = self
        } else {
            g = this
        }
        g.mapboxgl = f()
    }
})(function() {
    var define, module, exports;
    return (function e(t, n, r) {
        function s(o, u) {
            if (!n[o]) {
                if (!t[o]) {
                    var a = typeof require == "function" && require;
                    if (!u && a) return a(o, !0);
                    if (i) return i(o, !0);
                    var f = new Error("Cannot find module '" + o + "'");
                    throw f.code = "MODULE_NOT_FOUND", f
                }
                var l = n[o] = {
                    exports: {}
                };
                t[o][0].call(l.exports, function(e) {
                    var n = t[o][1][e];
                    return s(n ? n : e)
                }, l, l.exports, e, t, n, r)
            }
            return n[o].exports
        }
        var i = typeof require == "function" && require;
        for (var o = 0; o < r.length; o++) s(r[o]);
        return s
    })({
        1: [function(require, module, exports) {
            "use strict";

            function Buffer(t) {
                t ? (this.array = t.array, this.pos = t.pos) : (this.array = new ArrayBuffer(this.defaultLength), this.length = this.defaultLength, this.setupViews())
            }
            module.exports = Buffer, Buffer.prototype = {
                pos: 0,
                itemSize: 4,
                defaultLength: 8192,
                arrayType: "ARRAY_BUFFER",
                get index() {
                    return this.pos / this.itemSize
                },
                setupViews: function() {
                    this.ubytes = new Uint8Array(this.array), this.bytes = new Int8Array(this.array), this.ushorts = new Uint16Array(this.array), this.shorts = new Int16Array(this.array)
                },
                bind: function(t) {
                    var e = t[this.arrayType];
                    this.buffer ? t.bindBuffer(e, this.buffer) : (this.buffer = t.createBuffer(), t.bindBuffer(e, this.buffer), t.bufferData(e, this.array.slice(0, this.pos), t.STATIC_DRAW), this.array = null)
                },
                destroy: function(t) {
                    this.buffer && t.deleteBuffer(this.buffer)
                },
                resize: function() {
                    if (this.length < this.pos + this.itemSize) {
                        for (; this.length < this.pos + this.itemSize;) this.length = 2 * Math.round(1.5 * this.length / 2);
                        this.array = new ArrayBuffer(this.length);
                        var t = new Uint8Array(this.array);
                        t.set(this.ubytes), this.setupViews()
                    }
                }
            };
        }, {}],
        2: [function(require, module, exports) {
            "use strict";
            var LineVertexBuffer = require("./line_vertex_buffer"),
                LineElementBuffer = require("./line_element_buffer"),
                FillVertexBuffer = require("./fill_vertex_buffer"),
                FillElementBuffer = require("./triangle_element_buffer"),
                OutlineElementBuffer = require("./outline_element_buffer"),
                GlyphVertexBuffer = require("./glyph_vertex_buffer"),
                GlyphElementBuffer = require("./triangle_element_buffer"),
                IconVertexBuffer = require("./icon_vertex_buffer"),
                IconElementBuffer = require("./triangle_element_buffer"),
                CollisionBoxVertexBuffer = require("./collision_box_vertex_buffer"),
                CircleVertexBuffer = require("./circle_vertex_buffer"),
                CircleElementBuffer = require("./triangle_element_buffer");
            module.exports = function(e) {
                return e = e || {}, {
                    glyphVertex: new GlyphVertexBuffer(e.glyphVertex),
                    glyphElement: new GlyphElementBuffer(e.glyphElement),
                    iconVertex: new IconVertexBuffer(e.iconVertex),
                    iconElement: new IconElementBuffer(e.iconElement),
                    circleVertex: new CircleVertexBuffer(e.circleVertex),
                    circleElement: new CircleElementBuffer(e.circleElement),
                    fillVertex: new FillVertexBuffer(e.fillVertex),
                    fillElement: new FillElementBuffer(e.fillElement),
                    outlineElement: new OutlineElementBuffer(e.outlineElement),
                    lineVertex: new LineVertexBuffer(e.lineVertex),
                    lineElement: new LineElementBuffer(e.lineElement),
                    collisionBoxVertex: new CollisionBoxVertexBuffer(e.collisionBoxVertex)
                }
            };
        }, {
            "./circle_vertex_buffer": 3,
            "./collision_box_vertex_buffer": 4,
            "./fill_vertex_buffer": 5,
            "./glyph_vertex_buffer": 6,
            "./icon_vertex_buffer": 7,
            "./line_element_buffer": 8,
            "./line_vertex_buffer": 9,
            "./outline_element_buffer": 10,
            "./triangle_element_buffer": 11
        }],
        3: [function(require, module, exports) {
            "use strict";

            function CircleVertexBuffer(e) {
                Buffer.call(this, e)
            }
            var util = require("../../util/util"),
                Buffer = require("./buffer");
            module.exports = CircleVertexBuffer, CircleVertexBuffer.prototype = util.inherit(Buffer, {
                defaultLength: 32768,
                itemSize: 4,
                add: function(e, t, i, r) {
                    var f = this.pos,
                        s = f / 2;
                    this.resize(), this.shorts[s + 0] = 2 * e + (i + 1) / 2, this.shorts[s + 1] = 2 * t + (r + 1) / 2, this.pos += this.itemSize
                },
                bind: function(e, t, i) {
                    Buffer.prototype.bind.call(this, e), e.vertexAttribPointer(t.a_pos, 2, e.SHORT, !1, this.itemSize, i + 0)
                }
            });
        }, {
            "../../util/util": 106,
            "./buffer": 1
        }],
        4: [function(require, module, exports) {
            "use strict";

            function CollisionBoxVertexBuffer(t) {
                Buffer.call(this, t)
            }
            var util = require("../../util/util"),
                Buffer = require("./buffer");
            module.exports = CollisionBoxVertexBuffer, CollisionBoxVertexBuffer.prototype = util.inherit(Buffer, {
                itemSize: 12,
                defaultLength: 32768,
                add: function(t, i, e, r) {
                    var s = this.pos,
                        o = s / 2,
                        u = this.index;
                    return this.resize(), this.shorts[o + 0] = t.x, this.shorts[o + 1] = t.y, this.shorts[o + 2] = Math.round(i.x), this.shorts[o + 3] = Math.round(i.y), this.ubytes[s + 8] = Math.floor(10 * e), this.ubytes[s + 9] = Math.floor(10 * r), this.pos += this.itemSize, u
                }
            });
        }, {
            "../../util/util": 106,
            "./buffer": 1
        }],
        5: [function(require, module, exports) {
            "use strict";

            function FillVertexBuffer(e) {
                Buffer.call(this, e)
            }
            var util = require("../../util/util"),
                Buffer = require("./buffer");
            module.exports = FillVertexBuffer, FillVertexBuffer.prototype = util.inherit(Buffer, {
                itemSize: 4,
                add: function(e, i) {
                    var t = this.pos / 2;
                    this.resize(), this.shorts[t + 0] = e, this.shorts[t + 1] = i, this.pos += this.itemSize
                }
            });
        }, {
            "../../util/util": 106,
            "./buffer": 1
        }],
        6: [function(require, module, exports) {
            "use strict";

            function GlyphVertexBuffer(t) {
                Buffer.call(this, t)
            }
            var util = require("../../util/util"),
                Buffer = require("./buffer");
            module.exports = GlyphVertexBuffer, GlyphVertexBuffer.prototype = util.inherit(Buffer, {
                defaultLength: 32768,
                itemSize: 16,
                add: function(t, e, r, i, s, h, o, f, u) {
                    var a = this.pos,
                        l = a / 2;
                    this.resize(), this.shorts[l + 0] = t, this.shorts[l + 1] = e, this.shorts[l + 2] = Math.round(64 * r), this.shorts[l + 3] = Math.round(64 * i), this.ubytes[a + 8] = Math.floor(s / 4), this.ubytes[a + 9] = Math.floor(h / 4), this.ubytes[a + 10] = Math.floor(10 * u), this.ubytes[a + 12] = Math.floor(10 * o), this.ubytes[a + 13] = Math.floor(10 * Math.min(f, 25)), this.pos += this.itemSize
                },
                bind: function(t, e, r) {
                    Buffer.prototype.bind.call(this, t);
                    var i = this.itemSize;
                    t.vertexAttribPointer(e.a_pos, 2, t.SHORT, !1, i, r + 0), t.vertexAttribPointer(e.a_offset, 2, t.SHORT, !1, i, r + 4), t.vertexAttribPointer(e.a_data1, 4, t.UNSIGNED_BYTE, !1, i, r + 8), t.vertexAttribPointer(e.a_data2, 2, t.UNSIGNED_BYTE, !1, i, r + 12)
                }
            });
        }, {
            "../../util/util": 106,
            "./buffer": 1
        }],
        7: [function(require, module, exports) {
            "use strict";

            function IconVertexBuffer(t) {
                Buffer.call(this, t)
            }
            var util = require("../../util/util"),
                Buffer = require("./buffer");
            module.exports = IconVertexBuffer, IconVertexBuffer.prototype = util.inherit(Buffer, {
                defaultLength: 32768,
                itemSize: 16,
                add: function(t, e, i, r, s, o, h, u, f) {
                    var a = this.pos,
                        n = a / 2;
                    this.resize(), this.shorts[n + 0] = t, this.shorts[n + 1] = e, this.shorts[n + 2] = Math.round(64 * i), this.shorts[n + 3] = Math.round(64 * r), this.ubytes[a + 8] = s / 4, this.ubytes[a + 9] = o / 4, this.ubytes[a + 10] = Math.floor(10 * (f || 0)), this.ubytes[a + 12] = Math.floor(10 * (h || 0)), this.ubytes[a + 13] = Math.floor(10 * Math.min(u || 25, 25)), this.pos += this.itemSize
                },
                bind: function(t, e, i) {
                    Buffer.prototype.bind.call(this, t);
                    var r = this.itemSize;
                    t.vertexAttribPointer(e.a_pos, 2, t.SHORT, !1, r, i + 0), t.vertexAttribPointer(e.a_offset, 2, t.SHORT, !1, r, i + 4), t.vertexAttribPointer(e.a_data1, 4, t.UNSIGNED_BYTE, !1, r, i + 8), t.vertexAttribPointer(e.a_data2, 2, t.UNSIGNED_BYTE, !1, r, i + 12)
                }
            });
        }, {
            "../../util/util": 106,
            "./buffer": 1
        }],
        8: [function(require, module, exports) {
            "use strict";

            function LineElementBuffer(e) {
                Buffer.call(this, e)
            }
            var util = require("../../util/util"),
                Buffer = require("./buffer");
            module.exports = LineElementBuffer, LineElementBuffer.prototype = util.inherit(Buffer, {
                itemSize: 6,
                arrayType: "ELEMENT_ARRAY_BUFFER",
                add: function(e, t, i) {
                    var r = this.pos / 2;
                    this.resize(), this.ushorts[r + 0] = e, this.ushorts[r + 1] = t, this.ushorts[r + 2] = i, this.pos += this.itemSize
                }
            });
        }, {
            "../../util/util": 106,
            "./buffer": 1
        }],
        9: [function(require, module, exports) {
            "use strict";

            function LineVertexBuffer(e) {
                Buffer.call(this, e)
            }
            var util = require("../../util/util"),
                Buffer = require("./buffer");
            module.exports = LineVertexBuffer, LineVertexBuffer.extrudeScale = 63, LineVertexBuffer.prototype = util.inherit(Buffer, {
                itemSize: 8,
                defaultLength: 32768,
                add: function(e, t, r, i, s) {
                    var u = this.pos,
                        f = u / 2,
                        h = this.index,
                        o = LineVertexBuffer.extrudeScale;
                    return this.resize(), this.shorts[f + 0] = 2 * Math.floor(e.x) | r, this.shorts[f + 1] = 2 * Math.floor(e.y) | i, this.bytes[u + 4] = Math.round(o * t.x), this.bytes[u + 5] = Math.round(o * t.y), this.bytes[u + 6] = (s || 0) / 128, this.bytes[u + 7] = (s || 0) % 128, this.pos += this.itemSize, h
                }
            });
        }, {
            "../../util/util": 106,
            "./buffer": 1
        }],
        10: [function(require, module, exports) {
            "use strict";

            function OutlineElementBuffer(e) {
                Buffer.call(this, e)
            }
            var util = require("../../util/util"),
                Buffer = require("./buffer");
            module.exports = OutlineElementBuffer, OutlineElementBuffer.prototype = util.inherit(Buffer, {
                itemSize: 4,
                arrayType: "ELEMENT_ARRAY_BUFFER",
                add: function(e, t) {
                    var i = this.pos / 2;
                    this.resize(), this.ushorts[i + 0] = e, this.ushorts[i + 1] = t, this.pos += this.itemSize
                }
            });
        }, {
            "../../util/util": 106,
            "./buffer": 1
        }],
        11: [function(require, module, exports) {
            "use strict";

            function TriangleElementBuffer(e) {
                Buffer.call(this, e)
            }
            var util = require("../../util/util"),
                Buffer = require("./buffer");
            module.exports = TriangleElementBuffer, TriangleElementBuffer.prototype = util.inherit(Buffer, {
                itemSize: 6,
                arrayType: "ELEMENT_ARRAY_BUFFER",
                add: function(e, t, i) {
                    var r = this.pos / 2;
                    this.resize(), this.ushorts[r + 0] = e, this.ushorts[r + 1] = t, this.ushorts[r + 2] = i, this.pos += this.itemSize
                }
            });
        }, {
            "../../util/util": 106,
            "./buffer": 1
        }],
        12: [function(require, module, exports) {
            "use strict";

            function CircleBucket(e) {
                this.buffers = e, this.elementGroups = new ElementGroups(e.circleVertex, e.circleElement)
            }
            var ElementGroups = require("./element_groups");
            module.exports = CircleBucket, CircleBucket.prototype.addFeatures = function() {
                for (var e = 4096, r = 0; r < this.features.length; r++)
                    for (var t = this.features[r].loadGeometry()[0], s = 0; s < t.length; s++) {
                        this.elementGroups.makeRoomFor(6);
                        var u = t[s].x,
                            i = t[s].y;
                        if (!(0 > u || u >= e || 0 > i || i >= e)) {
                            var l = this.buffers.circleVertex.index - this.elementGroups.current.vertexStartIndex;
                            this.buffers.circleVertex.add(u, i, -1, -1), this.buffers.circleVertex.add(u, i, 1, -1), this.buffers.circleVertex.add(u, i, 1, 1), this.buffers.circleVertex.add(u, i, -1, 1), this.elementGroups.elementBuffer.add(l, l + 1, l + 2), this.elementGroups.elementBuffer.add(l, l + 3, l + 2), this.elementGroups.current.vertexLength += 4, this.elementGroups.current.elementLength += 2
                        }
                    }
            };
        }, {
            "./element_groups": 14
        }],
        13: [function(require, module, exports) {
            "use strict";

            function createBucket(e, t, i, r, l) {
                var c = new StyleDeclarationSet("layout", e.type, e.layout, {}).values(),
                    a = {
                        lastIntegerZoom: 1 / 0,
                        lastIntegerZoomTime: 0,
                        lastZoom: 0
                    },
                    u = {};
                for (var o in c) u[o] = c[o].calculate(i, a);
                "symbol" === e.type && (c["text-size"] && (u["text-max-size"] = c["text-size"].calculate(18, a), u["text-size"] = c["text-size"].calculate(i + 1, a)), c["icon-size"] && (u["icon-max-size"] = c["icon-size"].calculate(18, a), u["icon-size"] = c["icon-size"].calculate(i + 1, a)));
                var s = "line" === e.type ? LineBucket : "fill" === e.type ? FillBucket : "symbol" === e.type ? SymbolBucket : "circle" === e.type ? CircleBucket : null,
                    n = new s(t, new LayoutProperties[e.type](u), r, i, l);
                return n.id = e.id, n.type = e.type, n["source-layer"] = e["source-layer"], n.interactive = e.interactive, n.minZoom = e.minzoom, n.maxZoom = e.maxzoom, n.filter = featureFilter(e.filter), n.features = [], n
            }
            module.exports = createBucket;
            var LineBucket = require("./line_bucket"),
                FillBucket = require("./fill_bucket"),
                SymbolBucket = require("./symbol_bucket"),
                CircleBucket = require("./circle_bucket"),
                LayoutProperties = require("../style/layout_properties"),
                featureFilter = require("feature-filter"),
                StyleDeclarationSet = require("../style/style_declaration_set");
        }, {
            "../style/layout_properties": 53,
            "../style/style_declaration_set": 59,
            "./circle_bucket": 12,
            "./fill_bucket": 16,
            "./line_bucket": 17,
            "./symbol_bucket": 18,
            "feature-filter": 112
        }],
        14: [function(require, module, exports) {
            "use strict";

            function ElementGroups(e, t, n) {
                this.vertexBuffer = e, this.elementBuffer = t, this.secondElementBuffer = n, this.groups = []
            }

            function ElementGroup(e, t, n) {
                this.vertexStartIndex = e, this.elementStartIndex = t, this.secondElementStartIndex = n, this.elementLength = 0, this.vertexLength = 0, this.secondElementLength = 0
            }
            module.exports = ElementGroups, ElementGroups.prototype.makeRoomFor = function(e) {
                (!this.current || this.current.vertexLength + e > 65535) && (this.current = new ElementGroup(this.vertexBuffer.index, this.elementBuffer && this.elementBuffer.index, this.secondElementBuffer && this.secondElementBuffer.index), this.groups.push(this.current))
            };
        }, {}],
        15: [function(require, module, exports) {
            "use strict";

            function FeatureTree(t, e) {
                this.x = t.x, this.y = t.y, this.z = t.z - Math.log(e) / Math.LN2, this.rtree = rbush(9), this.toBeInserted = []
            }

            function geometryIntersectsBox(t, e, n) {
                return "Point" === e ? pointIntersectsBox(t, n) : "LineString" === e ? lineIntersectsBox(t, n) : "Polygon" === e ? polyIntersectsBox(t, n) || lineIntersectsBox(t, n) : !1
            }

            function polyIntersectsBox(t, e) {
                return polyContainsPoint(t, new Point(e[0], e[1])) || polyContainsPoint(t, new Point(e[0], e[3])) || polyContainsPoint(t, new Point(e[2], e[1])) || polyContainsPoint(t, new Point(e[2], e[3])) ? !0 : lineIntersectsBox(t, e)
            }

            function lineIntersectsBox(t, e) {
                for (var n = 0; n < t.length; n++)
                    for (var r = t[n], o = 0, i = r.length - 1; o < r.length; i = o++) {
                        var s = r[o],
                            a = r[i],
                            u = new Point(s.y, s.x),
                            l = new Point(a.y, a.x);
                        if (segmentCrossesHorizontal(s, a, e[0], e[2], e[1]) || segmentCrossesHorizontal(s, a, e[0], e[2], e[3]) || segmentCrossesHorizontal(u, l, e[1], e[3], e[0]) || segmentCrossesHorizontal(u, l, e[1], e[3], e[2])) return !0
                    }
                return pointIntersectsBox(t, e)
            }

            function segmentCrossesHorizontal(t, e, n, r, o) {
                if (e.y === t.y) return e.y === o && Math.min(t.x, e.x) <= r && Math.max(t.x, e.x) >= n;
                var i = (o - t.y) / (e.y - t.y),
                    s = t.x + i * (e.x - t.x);
                return s >= n && r >= s && 1 >= i && i >= 0
            }

            function pointIntersectsBox(t, e) {
                for (var n = 0; n < t.length; n++)
                    for (var r = t[n], o = 0; o < r.length; o++)
                        if (r[o].x >= e[0] && r[o].y >= e[1] && r[o].x <= e[2] && r[o].y <= e[3]) return !0;
                return !1
            }

            function geometryContainsPoint(t, e, n, r) {
                return "Point" === e ? pointContainsPoint(t, n, r) : "LineString" === e ? lineContainsPoint(t, n, r) : "Polygon" === e ? polyContainsPoint(t, n) || lineContainsPoint(t, n, r) : !1
            }

            function distToSegmentSquared(t, e, n) {
                var r = e.distSqr(n);
                if (0 === r) return t.distSqr(e);
                var o = ((t.x - e.x) * (n.x - e.x) + (t.y - e.y) * (n.y - e.y)) / r;
                return 0 > o ? t.distSqr(e) : o > 1 ? t.distSqr(n) : t.distSqr(n.sub(e)._mult(o)._add(e))
            }

            function lineContainsPoint(t, e, n) {
                for (var r = n * n, o = 0; o < t.length; o++)
                    for (var i = t[o], s = 1; s < i.length; s++) {
                        var a = i[s - 1],
                            u = i[s];
                        if (distToSegmentSquared(e, a, u) < r) return !0
                    }
                return !1
            }

            function polyContainsPoint(t, e) {
                for (var n, r, o, i = !1, s = 0; s < t.length; s++) {
                    n = t[s];
                    for (var a = 0, u = n.length - 1; a < n.length; u = a++) r = n[a], o = n[u], r.y > e.y != o.y > e.y && e.x < (o.x - r.x) * (e.y - r.y) / (o.y - r.y) + r.x && (i = !i)
                }
                return i
            }

            function pointContainsPoint(t, e, n) {
                for (var r = n * n, o = 0; o < t.length; o++)
                    for (var i = t[o], s = 0; s < i.length; s++)
                        if (i[s].distSqr(e) <= r) return !0;
                return !1
            }
            var rbush = require("rbush"),
                Point = require("point-geometry"),
                vt = require("vector-tile"),
                util = require("../util/util");
            module.exports = FeatureTree, FeatureTree.prototype.insert = function(t, e, n) {
                t.layers = e, t.feature = n, this.toBeInserted.push(t)
            }, FeatureTree.prototype._load = function() {
                this.rtree.load(this.toBeInserted), this.toBeInserted = []
            }, FeatureTree.prototype.query = function(t, e) {
                this.toBeInserted.length && this._load();
                var n, r, o = t.params || {},
                    i = t.x,
                    s = t.y,
                    a = [];
                "undefined" != typeof i && "undefined" != typeof s ? (n = 4096 * (o.radius || 0) / t.scale, r = [i - n, s - n, i + n, s + n]) : r = [t.minX, t.minY, t.maxX, t.maxY];
                for (var u = this.rtree.search(r), l = 0; l < u.length; l++) {
                    var y = u[l].feature,
                        f = u[l].layers,
                        h = vt.VectorTileFeature.types[y.type];
                    if (!(o.$type && h !== o.$type || n && !geometryContainsPoint(y.loadGeometry(), h, new Point(i, s), n) || !geometryIntersectsBox(y.loadGeometry(), h, r))) {
                        var x = y.toGeoJSON(this.x, this.y, this.z);
                        o.includeGeometry || (x.geometry = null);
                        for (var d = 0; d < f.length; d++) {
                            var g = f[d];
                            o.layerIds && o.layerIds.indexOf(g) < 0 || a.push(util.extend({
                                layer: g
                            }, x))
                        }
                    }
                }
                e(null, a)
            };
        }, {
            "../util/util": 106,
            "point-geometry": 137,
            "rbush": 138,
            "vector-tile": 141
        }],
        16: [function(require, module, exports) {
            "use strict";

            function FillBucket(e) {
                this.buffers = e, this.elementGroups = new ElementGroups(e.fillVertex, e.fillElement, e.outlineElement)
            }
            var ElementGroups = require("./element_groups");
            module.exports = FillBucket, FillBucket.prototype.addFeatures = function() {
                for (var e = this.features, t = 0; t < e.length; t++) {
                    var l = e[t];
                    this.addFeature(l.loadGeometry())
                }
            }, FillBucket.prototype.addFeature = function(e) {
                for (var t = 0; t < e.length; t++) this.addFill(e[t])
            }, FillBucket.prototype.addFill = function(e) {
                if (!(e.length < 3)) {
                    var t = e.length;
                    this.elementGroups.makeRoomFor(t + 1);
                    for (var l, r, n, i = this.elementGroups.current, o = this.buffers.fillVertex, u = this.buffers.fillElement, s = this.buffers.outlineElement, d = o.index - i.vertexStartIndex, a = 0; a < e.length; a++) r = o.index - i.vertexStartIndex, n = e[a], o.add(n.x, n.y), i.vertexLength++, a >= 2 && (n.x !== e[0].x || n.y !== e[0].y) && (u.add(d, l, r), i.elementLength++), a >= 1 && (s.add(l, r), i.secondElementLength++), l = r
                }
            };
        }, {
            "./element_groups": 14
        }],
        17: [function(require, module, exports) {
            "use strict";

            function LineBucket(e, t) {
                this.buffers = e, this.elementGroups = new ElementGroups(e.lineVertex, e.lineElement), this.layoutProperties = t
            }
            var ElementGroups = require("./element_groups");
            module.exports = LineBucket, LineBucket.prototype.addFeatures = function() {
                for (var e = this.features, t = 0; t < e.length; t++) {
                    var r = e[t];
                    this.addFeature(r.loadGeometry())
                }
            }, LineBucket.prototype.addFeature = function(e) {
                for (var t = this.layoutProperties, r = 0; r < e.length; r++) this.addLine(e[r], t["line-join"], t["line-cap"], t["line-miter-limit"], t["line-round-limit"])
            }, LineBucket.prototype.addLine = function(e, t, r, i, s) {
                for (var n = e.length; n > 2 && e[n - 1].equals(e[n - 2]);) n--;
                if (!(e.length < 2)) {
                    "bevel" === t && (i = 1.05);
                    var u = e[0],
                        h = e[n - 1],
                        d = u.equals(h);
                    if (this.elementGroups.makeRoomFor(10 * n), 2 !== n || !d) {
                        var a, l, o, f, m, p, x, v = r,
                            c = d ? "butt" : r,
                            V = 1,
                            b = 0,
                            _ = !0;
                        this.e1 = this.e2 = this.e3 = -1, d && (a = e[n - 2], m = u.sub(a)._unit()._perp());
                        for (var y = 0; n > y; y++)
                            if (o = d && y === n - 1 ? e[1] : e[y + 1], !o || !e[y].equals(o)) {
                                m && (f = m), a && (l = a), a = e[y], l && (b += a.dist(l)), m = o ? o.sub(a)._unit()._perp() : f, f = f || m;
                                var L = f.add(m)._unit(),
                                    C = L.x * m.x + L.y * m.y,
                                    g = 1 / C,
                                    k = l && o,
                                    G = k ? t : o ? v : c;
                                if (k && "round" === G && (s > g ? G = "miter" : 2 >= g && (G = "fakeround")), "miter" === G && g > i && (G = "bevel"), "bevel" === G && (g > 2 && (G = "flipbevel"), i > g && (G = "miter")), "miter" === G) L._mult(g), this.addCurrentVertex(a, V, b, L, 0, 0, !1);
                                else if ("flipbevel" === G) {
                                    if (g > 100) L = m.clone();
                                    else {
                                        var B = f.x * m.y - f.y * m.x > 0 ? -1 : 1,
                                            q = g * f.add(m).mag() / f.sub(m).mag();
                                        L._perp()._mult(q * B)
                                    }
                                    this.addCurrentVertex(a, V, b, L, 0, 0, !1), V = -V
                                } else if ("bevel" === G || "fakeround" === G) {
                                    var P = V * (f.x * m.y - f.y * m.x) > 0,
                                        S = -Math.sqrt(g * g - 1);
                                    if (P ? (x = 0, p = S) : (p = 0, x = S), _ || this.addCurrentVertex(a, V, b, f, p, x, !1), "fakeround" === G) {
                                        for (var E, F = Math.floor(8 * (.5 - (C - .5))), I = 0; F > I; I++) E = m.mult((I + 1) / (F + 1))._add(f)._unit(), this.addPieSliceVertex(a, V, b, E, P);
                                        this.addPieSliceVertex(a, V, b, L, P);
                                        for (var M = F - 1; M >= 0; M--) E = f.mult((M + 1) / (F + 1))._add(m)._unit(), this.addPieSliceVertex(a, V, b, E, P)
                                    }
                                    o && this.addCurrentVertex(a, V, b, m, -p, -x, !1)
                                } else "butt" === G ? (_ || this.addCurrentVertex(a, V, b, f, 0, 0, !1), o && this.addCurrentVertex(a, V, b, m, 0, 0, !1)) : "square" === G ? (_ || (this.addCurrentVertex(a, V, b, f, 1, 1, !1), this.e1 = this.e2 = -1, V = 1), o && this.addCurrentVertex(a, V, b, m, -1, -1, !1)) : "round" === G && (_ || (this.addCurrentVertex(a, V, b, f, 0, 0, !1), this.addCurrentVertex(a, V, b, f, 1, 1, !0), this.e1 = this.e2 = -1, V = 1), o && (this.addCurrentVertex(a, V, b, m, -1, -1, !0), this.addCurrentVertex(a, V, b, m, 0, 0, !1)));
                                _ = !1
                            }
                    }
                }
            }, LineBucket.prototype.addCurrentVertex = function(e, t, r, i, s, n, u) {
                var h, d = u ? 1 : 0,
                    a = this.buffers.lineVertex,
                    l = this.buffers.lineElement,
                    o = this.elementGroups.current,
                    f = this.elementGroups.current.vertexStartIndex;
                h = i.mult(t), s && h._sub(i.perp()._mult(s)), this.e3 = a.add(e, h, d, 0, r) - f, this.e1 >= 0 && this.e2 >= 0 && (l.add(this.e1, this.e2, this.e3), o.elementLength++), this.e1 = this.e2, this.e2 = this.e3, h = i.mult(-t), n && h._sub(i.perp()._mult(n)), this.e3 = a.add(e, h, d, 1, r) - f, this.e1 >= 0 && this.e2 >= 0 && (l.add(this.e1, this.e2, this.e3), o.elementLength++), this.e1 = this.e2, this.e2 = this.e3, o.vertexLength += 2
            }, LineBucket.prototype.addPieSliceVertex = function(e, t, r, i, s) {
                var n = this.buffers.lineVertex,
                    u = this.buffers.lineElement,
                    h = this.elementGroups.current,
                    d = this.elementGroups.current.vertexStartIndex,
                    a = s;
                i = i.mult(t * (s ? -1 : 1)), this.e3 = n.add(e, i, 0, a, r) - d, h.vertexLength += 1, this.e1 >= 0 && this.e2 >= 0 && (u.add(this.e1, this.e2, this.e3), h.elementLength++), s ? this.e2 = this.e3 : this.e1 = this.e3
            };
        }, {
            "./element_groups": 14
        }],
        18: [function(require, module, exports) {
            "use strict";

            function SymbolBucket(e, t, o, i, s) {
                this.buffers = e, this.layoutProperties = t, this.overscaling = o, this.zoom = i, this.collisionDebug = s;
                var n = 512 * o,
                    a = 4096;
                this.tilePixelRatio = a / n, this.compareText = {}, this.symbolInstances = []
            }

            function SymbolInstance(e, t, o, i, s, n, a, l, r, c, h, u) {
                this.x = e.x, this.y = e.y, this.hasText = !!o, this.hasIcon = !!i, this.hasText && (this.glyphQuads = n ? getGlyphQuads(e, o, a, t, s, r) : [], this.textCollisionFeature = new CollisionFeature(t, e, o, a, l, r)), this.hasIcon && (this.iconQuads = n ? getIconQuads(e, i, c, t, s, u) : [], this.iconCollisionFeature = new CollisionFeature(t, e, i, c, h, u))
            }
            var ElementGroups = require("./element_groups"),
                Anchor = require("../symbol/anchor"),
                getAnchors = require("../symbol/get_anchors"),
                resolveTokens = require("../util/token"),
                Quads = require("../symbol/quads"),
                Shaping = require("../symbol/shaping"),
                resolveText = require("../symbol/resolve_text"),
                resolveIcons = require("../symbol/resolve_icons"),
                mergeLines = require("../symbol/mergelines"),
                shapeText = Shaping.shapeText,
                shapeIcon = Shaping.shapeIcon,
                getGlyphQuads = Quads.getGlyphQuads,
                getIconQuads = Quads.getIconQuads,
                clipLine = require("../symbol/clip_line"),
                Point = require("point-geometry"),
                CollisionFeature = require("../symbol/collision_feature");
            module.exports = SymbolBucket, SymbolBucket.prototype.needsPlacement = !0, SymbolBucket.prototype.addFeatures = function(e) {
                var t = this.layoutProperties,
                    o = this.features,
                    i = this.textFeatures,
                    s = .5,
                    n = .5;
                switch (t["text-anchor"]) {
                    case "right":
                    case "top-right":
                    case "bottom-right":
                        s = 1;
                        break;
                    case "left":
                    case "top-left":
                    case "bottom-left":
                        s = 0
                }
                switch (t["text-anchor"]) {
                    case "bottom":
                    case "bottom-right":
                    case "bottom-left":
                        n = 1;
                        break;
                    case "top":
                    case "top-right":
                    case "top-left":
                        n = 0
                }
                for (var a = "right" === t["text-justify"] ? 1 : "left" === t["text-justify"] ? 0 : .5, l = 24, r = t["text-line-height"] * l, c = "line" !== t["symbol-placement"] ? t["text-max-width"] * l : 0, h = t["text-letter-spacing"] * l, u = [t["text-offset"][0] * l, t["text-offset"][1] * l], m = t["text-font"].join(","), p = [], x = 0; x < o.length; x++) p.push(o[x].loadGeometry());
                if ("line" === t["symbol-placement"]) {
                    var y = mergeLines(o, i, p);
                    p = y.geometries, o = y.features, i = y.textFeatures
                }
                for (var d, g, f = 0; f < o.length; f++)
                    if (p[f]) {
                        if (d = i[f] ? shapeText(i[f], this.stacks[m], c, r, s, n, a, h, u) : null, t["icon-image"]) {
                            var b = resolveTokens(o[f].properties, t["icon-image"]),
                                v = this.icons[b];
                            g = shapeIcon(v, t), v && (void 0 === this.sdfIcons ? this.sdfIcons = v.sdf : this.sdfIcons !== v.sdf && console.warn("Style sheet warning: Cannot mix SDF and non-SDF icons in one bucket"))
                        } else g = null;
                        (d || g) && this.addFeature(p[f], d, g)
                    }
                this.placeFeatures(e, this.buffers, this.collisionDebug)
            }, SymbolBucket.prototype.addFeature = function(e, t, o) {
                var i = this.layoutProperties,
                    s = 24,
                    n = i["text-size"] / s,
                    a = this.tilePixelRatio * n,
                    l = this.tilePixelRatio * i["text-max-size"] / s,
                    r = this.tilePixelRatio * i["icon-size"],
                    c = this.tilePixelRatio * i["symbol-spacing"],
                    h = i["symbol-avoid-edges"],
                    u = i["text-padding"] * this.tilePixelRatio,
                    m = i["icon-padding"] * this.tilePixelRatio,
                    p = i["text-max-angle"] / 180 * Math.PI,
                    x = "map" === i["text-rotation-alignment"] && "line" === i["symbol-placement"],
                    y = "map" === i["icon-rotation-alignment"] && "line" === i["symbol-placement"],
                    d = i["text-allow-overlap"] || i["icon-allow-overlap"] || i["text-ignore-placement"] || i["icon-ignore-placement"],
                    g = "line" === i["symbol-placement"],
                    f = c / 2;
                g && (e = clipLine(e, 0, 0, 4096, 4096));
                for (var b = 0; b < e.length; b++)
                    for (var v = e[b], I = g ? getAnchors(v, c, p, t, o, s, l, this.overscaling) : [new Anchor(v[0].x, v[0].y, 0)], S = 0, F = I.length; F > S; S++) {
                        var P = I[S];
                        if (!(t && g && this.anchorIsTooClose(t.text, f, P))) {
                            var M = !(P.x < 0 || P.x > 4096 || P.y < 0 || P.y > 4096);
                            if (!h || M) {
                                var k = M || d;
                                this.symbolInstances.push(new SymbolInstance(P, v, t, o, i, k, a, u, x, r, m, y))
                            }
                        }
                    }
            }, SymbolBucket.prototype.anchorIsTooClose = function(e, t, o) {
                var i = this.compareText;
                if (e in i) {
                    for (var s = i[e], n = s.length - 1; n >= 0; n--)
                        if (o.dist(s[n]) < t) return !0
                } else i[e] = [];
                return i[e].push(o), !1
            }, SymbolBucket.prototype.placeFeatures = function(e, t, o) {
                this.buffers = t;
                var i = this.elementGroups = {
                        text: new ElementGroups(t.glyphVertex, t.glyphElement),
                        icon: new ElementGroups(t.iconVertex, t.iconElement),
                        sdfIcons: this.sdfIcons
                    },
                    s = this.layoutProperties,
                    n = e.maxScale;
                i.text["text-size"] = s["text-size"], i.icon["icon-size"] = s["icon-size"];
                var a = "map" === s["text-rotation-alignment"] && "line" === s["symbol-placement"],
                    l = "map" === s["icon-rotation-alignment"] && "line" === s["symbol-placement"],
                    r = s["text-allow-overlap"] || s["icon-allow-overlap"] || s["text-ignore-placement"] || s["icon-ignore-placement"];
                if (r) {
                    var c = e.angle,
                        h = Math.sin(c),
                        u = Math.cos(c);
                    this.symbolInstances.sort(function(e, t) {
                        var o = h * e.x + u * e.y,
                            i = h * t.x + u * t.y;
                        return i - o
                    })
                }
                for (var m = 0; m < this.symbolInstances.length; m++) {
                    var p = this.symbolInstances[m],
                        x = p.hasText,
                        y = p.hasIcon,
                        d = s["text-optional"] || !x,
                        g = s["icon-optional"] || !y,
                        f = x && !s["text-allow-overlap"] ? e.placeCollisionFeature(p.textCollisionFeature) : e.minScale,
                        b = y && !s["icon-allow-overlap"] ? e.placeCollisionFeature(p.iconCollisionFeature) : e.minScale;
                    d || g ? !g && f ? f = Math.max(b, f) : !d && b && (b = Math.max(b, f)) : b = f = Math.max(b, f), x && (s["text-ignore-placement"] || e.insertCollisionFeature(p.textCollisionFeature, f), n >= f && this.addSymbols(t.glyphVertex, t.glyphElement, i.text, p.glyphQuads, f, s["text-keep-upright"], a, e.angle)), y && (s["icon-ignore-placement"] || e.insertCollisionFeature(p.iconCollisionFeature, b), n >= b && this.addSymbols(t.iconVertex, t.iconElement, i.icon, p.iconQuads, b, s["icon-keep-upright"], l, e.angle))
                }
                o && this.addToDebugBuffers(e)
            }, SymbolBucket.prototype.addSymbols = function(e, t, o, i, s, n, a, l) {
                o.makeRoomFor(4 * i.length);
                for (var r = o.current, c = this.zoom, h = Math.max(Math.log(s) / Math.LN2 + c, 0), u = 0; u < i.length; u++) {
                    var m = i[u],
                        p = m.angle,
                        x = (p + l + Math.PI) % (2 * Math.PI);
                    if (!(n && a && (x <= Math.PI / 2 || x > 3 * Math.PI / 2))) {
                        var y = m.tl,
                            d = m.tr,
                            g = m.bl,
                            f = m.br,
                            b = m.tex,
                            v = m.anchorPoint,
                            I = Math.max(c + Math.log(m.minScale) / Math.LN2, h),
                            S = Math.min(c + Math.log(m.maxScale) / Math.LN2, 25);
                        if (!(I >= S)) {
                            I === h && (I = 0);
                            var F = e.index - r.vertexStartIndex;
                            e.add(v.x, v.y, y.x, y.y, b.x, b.y, I, S, h), e.add(v.x, v.y, d.x, d.y, b.x + b.w, b.y, I, S, h), e.add(v.x, v.y, g.x, g.y, b.x, b.y + b.h, I, S, h), e.add(v.x, v.y, f.x, f.y, b.x + b.w, b.y + b.h, I, S, h), r.vertexLength += 4, t.add(F, F + 1, F + 2), t.add(F + 1, F + 2, F + 3), r.elementLength += 2
                        }
                    }
                }
            }, SymbolBucket.prototype.getDependencies = function(e, t, o) {
                function i(e) {
                    return e || s ? o(e) : void(s = !0)
                }
                var s = !1;
                this.getTextDependencies(e, t, i), this.getIconDependencies(e, t, i)
            }, SymbolBucket.prototype.getIconDependencies = function(e, t, o) {
                function i(e, t) {
                    return e ? o(e) : (this.icons = t, void o())
                }
                if (this.layoutProperties["icon-image"]) {
                    var s = this.features,
                        n = resolveIcons(s, this.layoutProperties);
                    n.length ? t.send("get icons", {
                        icons: n
                    }, i.bind(this)) : o()
                } else o()
            }, SymbolBucket.prototype.getTextDependencies = function(e, t, o) {
                var i = this.features,
                    s = this.layoutProperties["text-font"],
                    n = this.stacks = e.stacks;
                void 0 === n[s] && (n[s] = {});
                var a = n[s],
                    l = resolveText(i, this.layoutProperties, a);
                this.textFeatures = l.textFeatures, t.send("get glyphs", {
                    uid: e.uid,
                    fontstack: s,
                    codepoints: l.codepoints
                }, function(e, t) {
                    if (e) return o(e);
                    for (var i in t) a[i] = t[i];
                    o()
                })
            }, SymbolBucket.prototype.addToDebugBuffers = function(e) {
                this.elementGroups.collisionBox = new ElementGroups(this.buffers.collisionBoxVertex), this.elementGroups.collisionBox.makeRoomFor(0);
                for (var t = this.buffers.collisionBoxVertex, o = -e.angle, i = e.yStretch, s = 0; s < this.symbolInstances.length; s++)
                    for (var n = 0; 2 > n; n++) {
                        var a = this.symbolInstances[s][0 === n ? "textCollisionFeature" : "iconCollisionFeature"];
                        if (a)
                            for (var l = a.boxes, r = 0; r < l.length; r++) {
                                var c = l[r],
                                    h = c.anchorPoint,
                                    u = new Point(c.x1, c.y1 * i)._rotate(o),
                                    m = new Point(c.x2, c.y1 * i)._rotate(o),
                                    p = new Point(c.x1, c.y2 * i)._rotate(o),
                                    x = new Point(c.x2, c.y2 * i)._rotate(o),
                                    y = Math.max(0, Math.min(25, this.zoom + Math.log(c.maxScale) / Math.LN2)),
                                    d = Math.max(0, Math.min(25, this.zoom + Math.log(c.placementScale) / Math.LN2));
                                t.add(h, u, y, d), t.add(h, m, y, d), t.add(h, m, y, d), t.add(h, x, y, d), t.add(h, x, y, d), t.add(h, p, y, d), t.add(h, p, y, d), t.add(h, u, y, d), this.elementGroups.collisionBox.current.vertexLength += 8
                            }
                    }
            };
        }, {
            "../symbol/anchor": 62,
            "../symbol/clip_line": 65,
            "../symbol/collision_feature": 67,
            "../symbol/get_anchors": 69,
            "../symbol/mergelines": 72,
            "../symbol/quads": 73,
            "../symbol/resolve_icons": 74,
            "../symbol/resolve_text": 75,
            "../symbol/shaping": 76,
            "../util/token": 105,
            "./element_groups": 14,
            "point-geometry": 137
        }],
        19: [function(require, module, exports) {
            "use strict";

            function Coordinate(o, t, n) {
                this.column = o, this.row = t, this.zoom = n
            }
            module.exports = Coordinate, Coordinate.prototype = {
                clone: function() {
                    return new Coordinate(this.column, this.row, this.zoom)
                },
                zoomTo: function(o) {
                    return this.clone()._zoomTo(o)
                },
                sub: function(o) {
                    return this.clone()._sub(o)
                },
                _zoomTo: function(o) {
                    var t = Math.pow(2, o - this.zoom);
                    return this.column *= t, this.row *= t, this.zoom = o, this
                },
                _sub: function(o) {
                    return o = o.zoomTo(this.zoom), this.column -= o.column, this.row -= o.row, this
                }
            };
        }, {}],
        20: [function(require, module, exports) {
            "use strict";

            function LngLat(t, n) {
                if (isNaN(t) || isNaN(n)) throw new Error("Invalid LngLat object: (" + t + ", " + n + ")");
                if (this.lng = +t, this.lat = +n, this.lat > 90 || this.lat < -90) throw new Error("Invalid LngLat latitude value: must be between -90 and 90")
            }
            module.exports = LngLat;
            var wrap = require("../util/util").wrap;
            LngLat.prototype.wrap = function() {
                return new LngLat(wrap(this.lng, -180, 180), this.lat)
            }, LngLat.convert = function(t) {
                return t instanceof LngLat ? t : Array.isArray(t) ? new LngLat(t[0], t[1]) : t
            };
        }, {
            "../util/util": 106
        }],
        21: [function(require, module, exports) {
            "use strict";

            function LngLatBounds(t, n) {
                if (t)
                    for (var e = n ? [t, n] : t, s = 0, i = e.length; i > s; s++) this.extend(e[s])
            }
            module.exports = LngLatBounds;
            var LngLat = require("./lng_lat");
            LngLatBounds.prototype = {
                extend: function(t) {
                    var n, e, s = this._sw,
                        i = this._ne;
                    if (t instanceof LngLat) n = t, e = t;
                    else {
                        if (!(t instanceof LngLatBounds)) return t ? this.extend(LngLat.convert(t) || LngLatBounds.convert(t)) : this;
                        if (n = t._sw, e = t._ne, !n || !e) return this
                    }
                    return s || i ? (s.lng = Math.min(n.lng, s.lng), s.lat = Math.min(n.lat, s.lat), i.lng = Math.max(e.lng, i.lng), i.lat = Math.max(e.lat, i.lat)) : (this._sw = new LngLat(n.lng, n.lat), this._ne = new LngLat(e.lng, e.lat)), this
                },
                getCenter: function() {
                    return new LngLat((this._sw.lng + this._ne.lng) / 2, (this._sw.lat + this._ne.lat) / 2)
                },
                getSouthWest: function() {
                    return this._sw
                },
                getNorthEast: function() {
                    return this._ne
                },
                getNorthWest: function() {
                    return new LngLat(this.getWest(), this.getNorth())
                },
                getSouthEast: function() {
                    return new LngLat(this.getEast(), this.getSouth())
                },
                getWest: function() {
                    return this._sw.lng
                },
                getSouth: function() {
                    return this._sw.lat
                },
                getEast: function() {
                    return this._ne.lng
                },
                getNorth: function() {
                    return this._ne.lat
                }
            }, LngLatBounds.convert = function(t) {
                return !t || t instanceof LngLatBounds ? t : new LngLatBounds(t)
            };
        }, {
            "./lng_lat": 20
        }],
        22: [function(require, module, exports) {
            "use strict";

            function Transform(t, i) {
                this.tileSize = 512, this._minZoom = t || 0, this._maxZoom = i || 22, this.latRange = [-85.05113, 85.05113], this.width = 0, this.height = 0, this.zoom = 0, this.center = new LngLat(0, 0), this.angle = 0, this._altitude = 1.5, this._pitch = 0
            }
            var LngLat = require("./lng_lat"),
                Point = require("point-geometry"),
                Coordinate = require("./coordinate"),
                wrap = require("../util/util").wrap,
                interp = require("../util/interpolate"),
                vec4 = require("gl-matrix").vec4,
                mat4 = require("gl-matrix").mat4;
            module.exports = Transform, Transform.prototype = {get minZoom() {
                    return this._minZoom
                },
                set minZoom(t) {
                    this._minZoom = t, this.zoom = Math.max(this.zoom, t)
                },
                get maxZoom() {
                    return this._maxZoom
                },
                set maxZoom(t) {
                    this._maxZoom = t, this.zoom = Math.min(this.zoom, t)
                },
                get worldSize() {
                    return this.tileSize * this.scale
                },
                get centerPoint() {
                    return this.size._div(2)
                },
                get size() {
                    return new Point(this.width, this.height)
                },
                get bearing() {
                    return -this.angle / Math.PI * 180
                },
                set bearing(t) {
                    this.angle = -wrap(t, -180, 180) * Math.PI / 180
                },
                get pitch() {
                    return this._pitch / Math.PI * 180
                },
                set pitch(t) {
                    this._pitch = Math.min(60, t) / 180 * Math.PI
                },
                get altitude() {
                    return this._altitude
                },
                set altitude(t) {
                    this._altitude = Math.max(.75, t)
                },
                get zoom() {
                    return this._zoom
                },
                set zoom(t) {
                    t = Math.min(Math.max(t, this.minZoom), this.maxZoom), this._zoom = t, this.scale = this.zoomScale(t), this.tileZoom = Math.floor(t), this.zoomFraction = t - this.tileZoom, this._constrain()
                },
                zoomScale: function(t) {
                    return Math.pow(2, t)
                },
                scaleZoom: function(t) {
                    return Math.log(t) / Math.LN2
                },
                project: function(t, i) {
                    return new Point(this.lngX(t.lng, i), this.latY(t.lat, i))
                },
                unproject: function(t, i) {
                    return new LngLat(this.xLng(t.x, i), this.yLat(t.y, i))
                },
                get x() {
                    return this.lngX(this.center.lng)
                },
                get y() {
                    return this.latY(this.center.lat)
                },
                get point() {
                    return new Point(this.x, this.y)
                },
                lngX: function(t, i) {
                    return (180 + t) * (i || this.worldSize) / 360
                },
                latY: function(t, i) {
                    var n = 180 / Math.PI * Math.log(Math.tan(Math.PI / 4 + t * Math.PI / 360));
                    return (180 - n) * (i || this.worldSize) / 360
                },
                xLng: function(t, i) {
                    return 360 * t / (i || this.worldSize) - 180
                },
                yLat: function(t, i) {
                    var n = 180 - 360 * t / (i || this.worldSize);
                    return 360 / Math.PI * Math.atan(Math.exp(n * Math.PI / 180)) - 90
                },
                panBy: function(t) {
                    var i = this.centerPoint._add(t);
                    this.center = this.pointLocation(i), this._constrain()
                },
                setLocationAtPoint: function(t, i) {
                    var n = this.locationCoordinate(t),
                        o = this.pointCoordinate(i),
                        e = this.pointCoordinate(this.centerPoint),
                        a = o._sub(n);
                    this.center = this.coordinateLocation(e._sub(a)), this._constrain()
                },
                setZoomAround: function(t, i) {
                    var n;
                    i && (n = this.locationPoint(i)), this.zoom = t, i && this.setLocationAtPoint(i, n)
                },
                setBearingAround: function(t, i) {
                    var n;
                    i && (n = this.locationPoint(i)), this.bearing = t, i && this.setLocationAtPoint(i, n)
                },
                locationPoint: function(t) {
                    return this.coordinatePoint(this.locationCoordinate(t))
                },
                pointLocation: function(t) {
                    return this.coordinateLocation(this.pointCoordinate(t))
                },
                locationCoordinate: function(t) {
                    var i = this.zoomScale(this.tileZoom) / this.worldSize,
                        n = LngLat.convert(t);
                    return new Coordinate(this.lngX(n.lng) * i, this.latY(n.lat) * i, this.tileZoom)
                },
                coordinateLocation: function(t) {
                    var i = this.zoomScale(t.zoom);
                    return new LngLat(this.xLng(t.column, i), this.yLat(t.row, i))
                },
                pointCoordinate: function(t, i) {
                    void 0 === i && (i = 0);
                    var n = this.coordinatePointMatrix(this.tileZoom),
                        o = mat4.invert(new Float64Array(16), n);
                    if (!o) throw "failed to invert matrix";
                    var e = vec4.transformMat4([], [t.x, t.y, 0, 1], o),
                        a = vec4.transformMat4([], [t.x, t.y, 1, 1], o),
                        r = e[3],
                        h = a[3],
                        s = e[0] / r,
                        c = a[0] / h,
                        u = e[1] / r,
                        l = a[1] / h,
                        m = e[2] / r,
                        g = a[2] / h,
                        f = m === g ? 0 : (i - m) / (g - m);
                    return new Coordinate(interp(s, c, f), interp(u, l, f), this.tileZoom)
                },
                coordinatePoint: function(t) {
                    var i = this.coordinatePointMatrix(t.zoom),
                        n = vec4.transformMat4([], [t.column, t.row, 0, 1], i);
                    return new Point(n[0] / n[3], n[1] / n[3])
                },
                coordinatePointMatrix: function(t) {
                    var i = this.getProjMatrix(),
                        n = this.worldSize / this.zoomScale(t);
                    return mat4.scale(i, i, [n, n, 1]), mat4.multiply(i, this.getPixelMatrix(), i), i
                },
                getPixelMatrix: function() {
                    var t = mat4.create();
                    return mat4.scale(t, t, [this.width / 2, -this.height / 2, 1]), mat4.translate(t, t, [1, -1, 0]), t
                },
                _constrain: function() {
                    if (this.center) {
                        var t, i, n, o, e, a, r, h, s = this.size;
                        this.latRange && (t = this.latY(this.latRange[1]), i = this.latY(this.latRange[0]), e = i - t < s.y ? s.y / (i - t) : 0), this.lngRange && (n = this.lngX(this.lngRange[0]), o = this.lngX(this.lngRange[1]), a = o - n < s.x ? s.x / (o - n) : 0);
                        var c = Math.max(a || 0, e || 0);
                        if (c) return this.center = this.unproject(new Point(a ? (o + n) / 2 : this.x, e ? (i + t) / 2 : this.y)), void(this.zoom += this.scaleZoom(c));
                        if (this.latRange) {
                            var u = this.y,
                                l = s.y / 2;
                            t > u - l && (h = t + l), u + l > i && (h = i - l)
                        }
                        if (this.lngRange) {
                            var m = this.x,
                                g = s.x / 2;
                            n > m - g && (r = n + g), m + g > o && (r = o - g)
                        }(void 0 !== r || void 0 !== h) && (this.center = this.unproject(new Point(void 0 !== r ? r : this.x, void 0 !== h ? h : this.y)))
                    }
                },
                getProjMatrix: function() {
                    var t = new Float64Array(16),
                        i = Math.atan(.5 / this.altitude),
                        n = Math.sin(i) * this.altitude / Math.sin(Math.PI / 2 - this._pitch - i),
                        o = Math.cos(Math.PI / 2 - this._pitch) * n + this.altitude;
                    return mat4.perspective(t, 2 * Math.atan(this.height / 2 / this.altitude), this.width / this.height, .1, o), mat4.translate(t, t, [0, 0, -this.altitude]), mat4.scale(t, t, [1, -1, 1 / this.height]), mat4.rotateX(t, t, this._pitch), mat4.rotateZ(t, t, this.angle), mat4.translate(t, t, [-this.x, -this.y, 0]), t
                }
            };
        }, {
            "../util/interpolate": 102,
            "../util/util": 106,
            "./coordinate": 19,
            "./lng_lat": 20,
            "gl-matrix": 119,
            "point-geometry": 137
        }],
        23: [function(require, module, exports) {
            "use strict";
            var simplexFont = {
                " ": [16, []],
                "!": [10, [5, 21, 5, 7, -1, -1, 5, 2, 4, 1, 5, 0, 6, 1, 5, 2]],
                '"': [16, [4, 21, 4, 14, -1, -1, 12, 21, 12, 14]],
                "#": [21, [11, 25, 4, -7, -1, -1, 17, 25, 10, -7, -1, -1, 4, 12, 18, 12, -1, -1, 3, 6, 17, 6]],
                $: [20, [8, 25, 8, -4, -1, -1, 12, 25, 12, -4, -1, -1, 17, 18, 15, 20, 12, 21, 8, 21, 5, 20, 3, 18, 3, 16, 4, 14, 5, 13, 7, 12, 13, 10, 15, 9, 16, 8, 17, 6, 17, 3, 15, 1, 12, 0, 8, 0, 5, 1, 3, 3]],
                "%": [24, [21, 21, 3, 0, -1, -1, 8, 21, 10, 19, 10, 17, 9, 15, 7, 14, 5, 14, 3, 16, 3, 18, 4, 20, 6, 21, 8, 21, 10, 20, 13, 19, 16, 19, 19, 20, 21, 21, -1, -1, 17, 7, 15, 6, 14, 4, 14, 2, 16, 0, 18, 0, 20, 1, 21, 3, 21, 5, 19, 7, 17, 7]],
                "&": [26, [23, 12, 23, 13, 22, 14, 21, 14, 20, 13, 19, 11, 17, 6, 15, 3, 13, 1, 11, 0, 7, 0, 5, 1, 4, 2, 3, 4, 3, 6, 4, 8, 5, 9, 12, 13, 13, 14, 14, 16, 14, 18, 13, 20, 11, 21, 9, 20, 8, 18, 8, 16, 9, 13, 11, 10, 16, 3, 18, 1, 20, 0, 22, 0, 23, 1, 23, 2]],
                "'": [10, [5, 19, 4, 20, 5, 21, 6, 20, 6, 18, 5, 16, 4, 15]],
                "(": [14, [11, 25, 9, 23, 7, 20, 5, 16, 4, 11, 4, 7, 5, 2, 7, -2, 9, -5, 11, -7]],
                ")": [14, [3, 25, 5, 23, 7, 20, 9, 16, 10, 11, 10, 7, 9, 2, 7, -2, 5, -5, 3, -7]],
                "*": [16, [8, 21, 8, 9, -1, -1, 3, 18, 13, 12, -1, -1, 13, 18, 3, 12]],
                "+": [26, [13, 18, 13, 0, -1, -1, 4, 9, 22, 9]],
                ",": [10, [6, 1, 5, 0, 4, 1, 5, 2, 6, 1, 6, -1, 5, -3, 4, -4]],
                "-": [26, [4, 9, 22, 9]],
                ".": [10, [5, 2, 4, 1, 5, 0, 6, 1, 5, 2]],
                "/": [22, [20, 25, 2, -7]],
                0: [20, [9, 21, 6, 20, 4, 17, 3, 12, 3, 9, 4, 4, 6, 1, 9, 0, 11, 0, 14, 1, 16, 4, 17, 9, 17, 12, 16, 17, 14, 20, 11, 21, 9, 21]],
                1: [20, [6, 17, 8, 18, 11, 21, 11, 0]],
                2: [20, [4, 16, 4, 17, 5, 19, 6, 20, 8, 21, 12, 21, 14, 20, 15, 19, 16, 17, 16, 15, 15, 13, 13, 10, 3, 0, 17, 0]],
                3: [20, [5, 21, 16, 21, 10, 13, 13, 13, 15, 12, 16, 11, 17, 8, 17, 6, 16, 3, 14, 1, 11, 0, 8, 0, 5, 1, 4, 2, 3, 4]],
                4: [20, [13, 21, 3, 7, 18, 7, -1, -1, 13, 21, 13, 0]],
                5: [20, [15, 21, 5, 21, 4, 12, 5, 13, 8, 14, 11, 14, 14, 13, 16, 11, 17, 8, 17, 6, 16, 3, 14, 1, 11, 0, 8, 0, 5, 1, 4, 2, 3, 4]],
                6: [20, [16, 18, 15, 20, 12, 21, 10, 21, 7, 20, 5, 17, 4, 12, 4, 7, 5, 3, 7, 1, 10, 0, 11, 0, 14, 1, 16, 3, 17, 6, 17, 7, 16, 10, 14, 12, 11, 13, 10, 13, 7, 12, 5, 10, 4, 7]],
                7: [20, [17, 21, 7, 0, -1, -1, 3, 21, 17, 21]],
                8: [20, [8, 21, 5, 20, 4, 18, 4, 16, 5, 14, 7, 13, 11, 12, 14, 11, 16, 9, 17, 7, 17, 4, 16, 2, 15, 1, 12, 0, 8, 0, 5, 1, 4, 2, 3, 4, 3, 7, 4, 9, 6, 11, 9, 12, 13, 13, 15, 14, 16, 16, 16, 18, 15, 20, 12, 21, 8, 21]],
                9: [20, [16, 14, 15, 11, 13, 9, 10, 8, 9, 8, 6, 9, 4, 11, 3, 14, 3, 15, 4, 18, 6, 20, 9, 21, 10, 21, 13, 20, 15, 18, 16, 14, 16, 9, 15, 4, 13, 1, 10, 0, 8, 0, 5, 1, 4, 3]],
                ":": [10, [5, 14, 4, 13, 5, 12, 6, 13, 5, 14, -1, -1, 5, 2, 4, 1, 5, 0, 6, 1, 5, 2]],
                ";": [10, [5, 14, 4, 13, 5, 12, 6, 13, 5, 14, -1, -1, 6, 1, 5, 0, 4, 1, 5, 2, 6, 1, 6, -1, 5, -3, 4, -4]],
                "<": [24, [20, 18, 4, 9, 20, 0]],
                "=": [26, [4, 12, 22, 12, -1, -1, 4, 6, 22, 6]],
                ">": [24, [4, 18, 20, 9, 4, 0]],
                "?": [18, [3, 16, 3, 17, 4, 19, 5, 20, 7, 21, 11, 21, 13, 20, 14, 19, 15, 17, 15, 15, 14, 13, 13, 12, 9, 10, 9, 7, -1, -1, 9, 2, 8, 1, 9, 0, 10, 1, 9, 2]],
                "@": [27, [18, 13, 17, 15, 15, 16, 12, 16, 10, 15, 9, 14, 8, 11, 8, 8, 9, 6, 11, 5, 14, 5, 16, 6, 17, 8, -1, -1, 12, 16, 10, 14, 9, 11, 9, 8, 10, 6, 11, 5, -1, -1, 18, 16, 17, 8, 17, 6, 19, 5, 21, 5, 23, 7, 24, 10, 24, 12, 23, 15, 22, 17, 20, 19, 18, 20, 15, 21, 12, 21, 9, 20, 7, 19, 5, 17, 4, 15, 3, 12, 3, 9, 4, 6, 5, 4, 7, 2, 9, 1, 12, 0, 15, 0, 18, 1, 20, 2, 21, 3, -1, -1, 19, 16, 18, 8, 18, 6, 19, 5]],
                A: [18, [9, 21, 1, 0, -1, -1, 9, 21, 17, 0, -1, -1, 4, 7, 14, 7]],
                B: [21, [4, 21, 4, 0, -1, -1, 4, 21, 13, 21, 16, 20, 17, 19, 18, 17, 18, 15, 17, 13, 16, 12, 13, 11, -1, -1, 4, 11, 13, 11, 16, 10, 17, 9, 18, 7, 18, 4, 17, 2, 16, 1, 13, 0, 4, 0]],
                C: [21, [18, 16, 17, 18, 15, 20, 13, 21, 9, 21, 7, 20, 5, 18, 4, 16, 3, 13, 3, 8, 4, 5, 5, 3, 7, 1, 9, 0, 13, 0, 15, 1, 17, 3, 18, 5]],
                D: [21, [4, 21, 4, 0, -1, -1, 4, 21, 11, 21, 14, 20, 16, 18, 17, 16, 18, 13, 18, 8, 17, 5, 16, 3, 14, 1, 11, 0, 4, 0]],
                E: [19, [4, 21, 4, 0, -1, -1, 4, 21, 17, 21, -1, -1, 4, 11, 12, 11, -1, -1, 4, 0, 17, 0]],
                F: [18, [4, 21, 4, 0, -1, -1, 4, 21, 17, 21, -1, -1, 4, 11, 12, 11]],
                G: [21, [18, 16, 17, 18, 15, 20, 13, 21, 9, 21, 7, 20, 5, 18, 4, 16, 3, 13, 3, 8, 4, 5, 5, 3, 7, 1, 9, 0, 13, 0, 15, 1, 17, 3, 18, 5, 18, 8, -1, -1, 13, 8, 18, 8]],
                H: [22, [4, 21, 4, 0, -1, -1, 18, 21, 18, 0, -1, -1, 4, 11, 18, 11]],
                I: [8, [4, 21, 4, 0]],
                J: [16, [12, 21, 12, 5, 11, 2, 10, 1, 8, 0, 6, 0, 4, 1, 3, 2, 2, 5, 2, 7]],
                K: [21, [4, 21, 4, 0, -1, -1, 18, 21, 4, 7, -1, -1, 9, 12, 18, 0]],
                L: [17, [4, 21, 4, 0, -1, -1, 4, 0, 16, 0]],
                M: [24, [4, 21, 4, 0, -1, -1, 4, 21, 12, 0, -1, -1, 20, 21, 12, 0, -1, -1, 20, 21, 20, 0]],
                N: [22, [4, 21, 4, 0, -1, -1, 4, 21, 18, 0, -1, -1, 18, 21, 18, 0]],
                O: [22, [9, 21, 7, 20, 5, 18, 4, 16, 3, 13, 3, 8, 4, 5, 5, 3, 7, 1, 9, 0, 13, 0, 15, 1, 17, 3, 18, 5, 19, 8, 19, 13, 18, 16, 17, 18, 15, 20, 13, 21, 9, 21]],
                P: [21, [4, 21, 4, 0, -1, -1, 4, 21, 13, 21, 16, 20, 17, 19, 18, 17, 18, 14, 17, 12, 16, 11, 13, 10, 4, 10]],
                Q: [22, [9, 21, 7, 20, 5, 18, 4, 16, 3, 13, 3, 8, 4, 5, 5, 3, 7, 1, 9, 0, 13, 0, 15, 1, 17, 3, 18, 5, 19, 8, 19, 13, 18, 16, 17, 18, 15, 20, 13, 21, 9, 21, -1, -1, 12, 4, 18, -2]],
                R: [21, [4, 21, 4, 0, -1, -1, 4, 21, 13, 21, 16, 20, 17, 19, 18, 17, 18, 15, 17, 13, 16, 12, 13, 11, 4, 11, -1, -1, 11, 11, 18, 0]],
                S: [20, [17, 18, 15, 20, 12, 21, 8, 21, 5, 20, 3, 18, 3, 16, 4, 14, 5, 13, 7, 12, 13, 10, 15, 9, 16, 8, 17, 6, 17, 3, 15, 1, 12, 0, 8, 0, 5, 1, 3, 3]],
                T: [16, [8, 21, 8, 0, -1, -1, 1, 21, 15, 21]],
                U: [22, [4, 21, 4, 6, 5, 3, 7, 1, 10, 0, 12, 0, 15, 1, 17, 3, 18, 6, 18, 21]],
                V: [18, [1, 21, 9, 0, -1, -1, 17, 21, 9, 0]],
                W: [24, [2, 21, 7, 0, -1, -1, 12, 21, 7, 0, -1, -1, 12, 21, 17, 0, -1, -1, 22, 21, 17, 0]],
                X: [20, [3, 21, 17, 0, -1, -1, 17, 21, 3, 0]],
                Y: [18, [1, 21, 9, 11, 9, 0, -1, -1, 17, 21, 9, 11]],
                Z: [20, [17, 21, 3, 0, -1, -1, 3, 21, 17, 21, -1, -1, 3, 0, 17, 0]],
                "[": [14, [4, 25, 4, -7, -1, -1, 5, 25, 5, -7, -1, -1, 4, 25, 11, 25, -1, -1, 4, -7, 11, -7]],
                "\\": [14, [0, 21, 14, -3]],
                "]": [14, [9, 25, 9, -7, -1, -1, 10, 25, 10, -7, -1, -1, 3, 25, 10, 25, -1, -1, 3, -7, 10, -7]],
                "^": [16, [6, 15, 8, 18, 10, 15, -1, -1, 3, 12, 8, 17, 13, 12, -1, -1, 8, 17, 8, 0]],
                _: [16, [0, -2, 16, -2]],
                "`": [10, [6, 21, 5, 20, 4, 18, 4, 16, 5, 15, 6, 16, 5, 17]],
                a: [19, [15, 14, 15, 0, -1, -1, 15, 11, 13, 13, 11, 14, 8, 14, 6, 13, 4, 11, 3, 8, 3, 6, 4, 3, 6, 1, 8, 0, 11, 0, 13, 1, 15, 3]],
                b: [19, [4, 21, 4, 0, -1, -1, 4, 11, 6, 13, 8, 14, 11, 14, 13, 13, 15, 11, 16, 8, 16, 6, 15, 3, 13, 1, 11, 0, 8, 0, 6, 1, 4, 3]],
                c: [18, [15, 11, 13, 13, 11, 14, 8, 14, 6, 13, 4, 11, 3, 8, 3, 6, 4, 3, 6, 1, 8, 0, 11, 0, 13, 1, 15, 3]],
                d: [19, [15, 21, 15, 0, -1, -1, 15, 11, 13, 13, 11, 14, 8, 14, 6, 13, 4, 11, 3, 8, 3, 6, 4, 3, 6, 1, 8, 0, 11, 0, 13, 1, 15, 3]],
                e: [18, [3, 8, 15, 8, 15, 10, 14, 12, 13, 13, 11, 14, 8, 14, 6, 13, 4, 11, 3, 8, 3, 6, 4, 3, 6, 1, 8, 0, 11, 0, 13, 1, 15, 3]],
                f: [12, [10, 21, 8, 21, 6, 20, 5, 17, 5, 0, -1, -1, 2, 14, 9, 14]],
                g: [19, [15, 14, 15, -2, 14, -5, 13, -6, 11, -7, 8, -7, 6, -6, -1, -1, 15, 11, 13, 13, 11, 14, 8, 14, 6, 13, 4, 11, 3, 8, 3, 6, 4, 3, 6, 1, 8, 0, 11, 0, 13, 1, 15, 3]],
                h: [19, [4, 21, 4, 0, -1, -1, 4, 10, 7, 13, 9, 14, 12, 14, 14, 13, 15, 10, 15, 0]],
                i: [8, [3, 21, 4, 20, 5, 21, 4, 22, 3, 21, -1, -1, 4, 14, 4, 0]],
                j: [10, [5, 21, 6, 20, 7, 21, 6, 22, 5, 21, -1, -1, 6, 14, 6, -3, 5, -6, 3, -7, 1, -7]],
                k: [17, [4, 21, 4, 0, -1, -1, 14, 14, 4, 4, -1, -1, 8, 8, 15, 0]],
                l: [8, [4, 21, 4, 0]],
                m: [30, [4, 14, 4, 0, -1, -1, 4, 10, 7, 13, 9, 14, 12, 14, 14, 13, 15, 10, 15, 0, -1, -1, 15, 10, 18, 13, 20, 14, 23, 14, 25, 13, 26, 10, 26, 0]],
                n: [19, [4, 14, 4, 0, -1, -1, 4, 10, 7, 13, 9, 14, 12, 14, 14, 13, 15, 10, 15, 0]],
                o: [19, [8, 14, 6, 13, 4, 11, 3, 8, 3, 6, 4, 3, 6, 1, 8, 0, 11, 0, 13, 1, 15, 3, 16, 6, 16, 8, 15, 11, 13, 13, 11, 14, 8, 14]],
                p: [19, [4, 14, 4, -7, -1, -1, 4, 11, 6, 13, 8, 14, 11, 14, 13, 13, 15, 11, 16, 8, 16, 6, 15, 3, 13, 1, 11, 0, 8, 0, 6, 1, 4, 3]],
                q: [19, [15, 14, 15, -7, -1, -1, 15, 11, 13, 13, 11, 14, 8, 14, 6, 13, 4, 11, 3, 8, 3, 6, 4, 3, 6, 1, 8, 0, 11, 0, 13, 1, 15, 3]],
                r: [13, [4, 14, 4, 0, -1, -1, 4, 8, 5, 11, 7, 13, 9, 14, 12, 14]],
                s: [17, [14, 11, 13, 13, 10, 14, 7, 14, 4, 13, 3, 11, 4, 9, 6, 8, 11, 7, 13, 6, 14, 4, 14, 3, 13, 1, 10, 0, 7, 0, 4, 1, 3, 3]],
                t: [12, [5, 21, 5, 4, 6, 1, 8, 0, 10, 0, -1, -1, 2, 14, 9, 14]],
                u: [19, [4, 14, 4, 4, 5, 1, 7, 0, 10, 0, 12, 1, 15, 4, -1, -1, 15, 14, 15, 0]],
                v: [16, [2, 14, 8, 0, -1, -1, 14, 14, 8, 0]],
                w: [22, [3, 14, 7, 0, -1, -1, 11, 14, 7, 0, -1, -1, 11, 14, 15, 0, -1, -1, 19, 14, 15, 0]],
                x: [17, [3, 14, 14, 0, -1, -1, 14, 14, 3, 0]],
                y: [16, [2, 14, 8, 0, -1, -1, 14, 14, 8, 0, 6, -4, 4, -6, 2, -7, 1, -7]],
                z: [17, [14, 14, 3, 0, -1, -1, 3, 14, 14, 14, -1, -1, 3, 0, 14, 0]],
                "{": [14, [9, 25, 7, 24, 6, 23, 5, 21, 5, 19, 6, 17, 7, 16, 8, 14, 8, 12, 6, 10, -1, -1, 7, 24, 6, 22, 6, 20, 7, 18, 8, 17, 9, 15, 9, 13, 8, 11, 4, 9, 8, 7, 9, 5, 9, 3, 8, 1, 7, 0, 6, -2, 6, -4, 7, -6, -1, -1, 6, 8, 8, 6, 8, 4, 7, 2, 6, 1, 5, -1, 5, -3, 6, -5, 7, -6, 9, -7]],
                "|": [8, [4, 25, 4, -7]],
                "}": [14, [5, 25, 7, 24, 8, 23, 9, 21, 9, 19, 8, 17, 7, 16, 6, 14, 6, 12, 8, 10, -1, -1, 7, 24, 8, 22, 8, 20, 7, 18, 6, 17, 5, 15, 5, 13, 6, 11, 10, 9, 6, 7, 5, 5, 5, 3, 6, 1, 7, 0, 8, -2, 8, -4, 7, -6, -1, -1, 8, 8, 6, 6, 6, 4, 7, 2, 8, 1, 9, -1, 9, -3, 8, -5, 7, -6, 5, -7]],
                "~": [24, [3, 6, 3, 8, 4, 11, 6, 12, 8, 12, 10, 11, 14, 8, 16, 7, 18, 7, 20, 8, 21, 10, -1, -1, 3, 8, 4, 10, 6, 11, 8, 11, 10, 10, 14, 7, 16, 6, 18, 6, 20, 7, 21, 10, 21, 12]]
            };
            module.exports = function(l, n, t, e) {
                e = e || 1;
                var r, o, u, s, i, x, f, p, h = [];
                for (r = 0, o = l.length; o > r; r++)
                    if (i = simplexFont[l[r]]) {
                        for (p = null, u = 0, s = i[1].length; s > u; u += 2) - 1 === i[1][u] && -1 === i[1][u + 1] ? p = null : (x = n + i[1][u] * e, f = t - i[1][u + 1] * e, p && h.push(p.x, p.y, x, f), p = {
                            x: x,
                            y: f
                        });
                        n += i[0] * e
                    }
                return h
            };
        }, {}],
        24: [function(require, module, exports) {
            "use strict";
            var mapboxgl = module.exports = {};
            mapboxgl.Map = require("./ui/map"), mapboxgl.Control = require("./ui/control/control"), mapboxgl.Navigation = require("./ui/control/navigation"), mapboxgl.Attribution = require("./ui/control/attribution"), mapboxgl.Popup = require("./ui/popup"), mapboxgl.GeoJSONSource = require("./source/geojson_source"), mapboxgl.VideoSource = require("./source/video_source"), mapboxgl.ImageSource = require("./source/image_source"), mapboxgl.Style = require("./style/style"), mapboxgl.LngLat = require("./geo/lng_lat"), mapboxgl.LngLatBounds = require("./geo/lng_lat_bounds"), mapboxgl.Point = require("point-geometry"), mapboxgl.Evented = require("./util/evented"), mapboxgl.util = require("./util/util"), mapboxgl.supported = require("./util/browser").supported;
            var ajax = require("./util/ajax");
            mapboxgl.util.getJSON = ajax.getJSON, mapboxgl.util.getArrayBuffer = ajax.getArrayBuffer;
            var config = require("./util/config");
            mapboxgl.config = config, Object.defineProperty(mapboxgl, "accessToken", {
                get: function() {
                    return config.ACCESS_TOKEN
                },
                set: function(e) {
                    config.ACCESS_TOKEN = e
                }
            });
        }, {
            "./geo/lng_lat": 20,
            "./geo/lng_lat_bounds": 21,
            "./source/geojson_source": 39,
            "./source/image_source": 41,
            "./source/video_source": 48,
            "./style/style": 56,
            "./ui/control/attribution": 79,
            "./ui/control/control": 80,
            "./ui/control/navigation": 81,
            "./ui/map": 91,
            "./ui/popup": 92,
            "./util/ajax": 94,
            "./util/browser": 95,
            "./util/config": 99,
            "./util/evented": 100,
            "./util/util": 106,
            "point-geometry": 137
        }],
        25: [function(require, module, exports) {
            "use strict";

            function drawBackground(t, a, r) {
                var e, i = t.gl,
                    o = a.paint["background-color"],
                    n = a.paint["background-pattern"],
                    l = a.paint["background-opacity"],
                    u = n ? t.spriteAtlas.getPosition(n.from, !0) : null,
                    m = n ? t.spriteAtlas.getPosition(n.to, !0) : null;
                if (u && m) {
                    e = t.patternShader, i.switchShader(e, r), i.uniform1i(e.u_image, 0), i.uniform2fv(e.u_pattern_tl_a, u.tl), i.uniform2fv(e.u_pattern_br_a, u.br), i.uniform2fv(e.u_pattern_tl_b, m.tl), i.uniform2fv(e.u_pattern_br_b, m.br), i.uniform1f(e.u_opacity, l);
                    var c = t.transform,
                        f = u.size,
                        s = m.size,
                        _ = c.locationCoordinate(c.center),
                        S = 1 / Math.pow(2, c.zoomFraction);
                    i.uniform1f(e.u_mix, n.t);
                    var d = mat3.create();
                    mat3.scale(d, d, [1 / (f[0] * n.fromScale), 1 / (f[1] * n.fromScale)]), mat3.translate(d, d, [_.column * c.tileSize % (f[0] * n.fromScale), _.row * c.tileSize % (f[1] * n.fromScale)]), mat3.rotate(d, d, -c.angle), mat3.scale(d, d, [S * c.width / 2, -S * c.height / 2]);
                    var p = mat3.create();
                    mat3.scale(p, p, [1 / (s[0] * n.toScale), 1 / (s[1] * n.toScale)]), mat3.translate(p, p, [_.column * c.tileSize % (s[0] * n.toScale), _.row * c.tileSize % (s[1] * n.toScale)]), mat3.rotate(p, p, -c.angle), mat3.scale(p, p, [S * c.width / 2, -S * c.height / 2]), i.uniformMatrix3fv(e.u_patternmatrix_a, !1, d), i.uniformMatrix3fv(e.u_patternmatrix_b, !1, p), t.spriteAtlas.bind(i, !0)
                } else e = t.fillShader, i.switchShader(e, r), i.uniform4fv(e.u_color, o);
                i.disable(i.STENCIL_TEST), i.bindBuffer(i.ARRAY_BUFFER, t.backgroundBuffer), i.vertexAttribPointer(e.a_pos, t.backgroundBuffer.itemSize, i.SHORT, !1, 0, 0), i.drawArrays(i.TRIANGLE_STRIP, 0, t.backgroundBuffer.itemCount), i.enable(i.STENCIL_TEST), i.stencilMask(0), i.stencilFunc(i.EQUAL, 128, 128)
            }
            var mat3 = require("gl-matrix").mat3;
            module.exports = drawBackground;
        }, {
            "gl-matrix": 119
        }],
        26: [function(require, module, exports) {
            "use strict";

            function drawCircles(e, r, i, a) {
                if (a.buffers) {
                    i = e.translateMatrix(i, a, r.paint["circle-translate"], r.paint["circle-translate-anchor"]);
                    var t = a.elementGroups[r.ref || r.id];
                    if (t) {
                        var l = e.gl;
                        l.disable(l.STENCIL_TEST), l.switchShader(e.circleShader, i, a.exMatrix);
                        var c = a.buffers.circleVertex,
                            n = e.circleShader,
                            s = a.buffers.circleElement,
                            u = 1 / browser.devicePixelRatio / r.paint["circle-radius"];
                        l.uniform4fv(n.u_color, r.paint["circle-color"]), l.uniform1f(n.u_blur, Math.max(r.paint["circle-blur"], u)), l.uniform1f(n.u_size, r.paint["circle-radius"]);
                        for (var o = 0; o < t.groups.length; o++) {
                            var f = t.groups[o],
                                d = f.vertexStartIndex * c.itemSize;
                            c.bind(l, n, d), s.bind(l, n, d);
                            var S = 3 * f.elementLength,
                                b = f.elementStartIndex * s.itemSize;
                            l.drawElements(l.TRIANGLES, S, l.UNSIGNED_SHORT, b)
                        }
                        l.enable(l.STENCIL_TEST)
                    }
                }
            }
            var browser = require("../util/browser.js");
            module.exports = drawCircles;
        }, {
            "../util/browser.js": 95
        }],
        27: [function(require, module, exports) {
            "use strict";

            function drawPlacementDebug(r, e, o, t) {
                var a = t.elementGroups[e.ref || e.id].collisionBox;
                if (a) {
                    var i = r.gl,
                        n = t.buffers.collisionBoxVertex,
                        s = r.collisionBoxShader;
                    i.enable(i.STENCIL_TEST), i.switchShader(s, o), n.bind(i, s), i.lineWidth(1);
                    var u = 12;
                    i.vertexAttribPointer(s.a_pos, 2, i.SHORT, !1, u, 0), i.vertexAttribPointer(s.a_extrude, 2, i.SHORT, !1, u, 4), i.vertexAttribPointer(s.a_data, 2, i.UNSIGNED_BYTE, !1, u, 8), i.uniform1f(s.u_scale, Math.pow(2, r.transform.zoom - t.coord.z)), i.uniform1f(s.u_zoom, 10 * r.transform.zoom), i.uniform1f(s.u_maxzoom, 10 * (t.coord.z + 1));
                    var d = a.groups[0].vertexStartIndex,
                        l = a.groups[0].vertexLength;
                    i.drawArrays(i.LINES, d, l), i.disable(i.STENCIL_TEST)
                }
            }
            module.exports = drawPlacementDebug;
        }, {}],
        28: [function(require, module, exports) {
            "use strict";

            function drawDebug(e, r) {
                var t = e.gl;
                t.blendFunc(t.ONE, t.ONE_MINUS_SRC_ALPHA), t.switchShader(e.debugShader, r.posMatrix), t.bindBuffer(t.ARRAY_BUFFER, e.debugBuffer), t.vertexAttribPointer(e.debugShader.a_pos, e.debugBuffer.itemSize, t.SHORT, !1, 0, 0), t.uniform4f(e.debugShader.u_color, 1, 0, 0, 1), t.lineWidth(4), t.drawArrays(t.LINE_STRIP, 0, e.debugBuffer.itemCount);
                var i = textVertices(r.coord.toString(), 50, 200, 5);
                t.bindBuffer(t.ARRAY_BUFFER, e.debugTextBuffer), t.bufferData(t.ARRAY_BUFFER, new Int16Array(i), t.STREAM_DRAW), t.vertexAttribPointer(e.debugShader.a_pos, e.debugTextBuffer.itemSize, t.SHORT, !1, 0, 0), t.lineWidth(8 * browser.devicePixelRatio), t.uniform4f(e.debugShader.u_color, 1, 1, 1, 1), t.drawArrays(t.LINES, 0, i.length / e.debugTextBuffer.itemSize), t.lineWidth(2 * browser.devicePixelRatio), t.uniform4f(e.debugShader.u_color, 0, 0, 0, 1), t.drawArrays(t.LINES, 0, i.length / e.debugTextBuffer.itemSize), t.blendFunc(t.ONE_MINUS_DST_ALPHA, t.ONE)
            }
            var textVertices = require("../lib/debugtext"),
                browser = require("../util/browser");
            module.exports = drawDebug;
        }, {
            "../lib/debugtext": 23,
            "../util/browser": 95
        }],
        29: [function(require, module, exports) {
            "use strict";

            function drawFill(e, t, r, i) {
                if (i.buffers) {
                    var a = i.elementGroups[t.ref || t.id];
                    if (a) {
                        var l, n, o, f, s = e.gl,
                            u = e.translateMatrix(r, i, t.paint["fill-translate"], t.paint["fill-translate-anchor"]),
                            c = t.paint["fill-color"];
                        s.stencilMask(63), s.clear(s.STENCIL_BUFFER_BIT), s.stencilFunc(s.NOTEQUAL, 128, 128), s.stencilOpSeparate(s.FRONT, s.INCR_WRAP, s.KEEP, s.KEEP), s.stencilOpSeparate(s.BACK, s.DECR_WRAP, s.KEEP, s.KEEP), s.colorMask(!1, !1, !1, !1), s.switchShader(e.fillShader, u), l = i.buffers.fillVertex, l.bind(s), n = i.buffers.fillElement, n.bind(s);
                        for (var m, S, E = 0; E < a.groups.length; E++) o = a.groups[E], m = o.vertexStartIndex * l.itemSize, s.vertexAttribPointer(e.fillShader.a_pos, 2, s.SHORT, !1, 4, m + 0), f = 3 * o.elementLength, S = o.elementStartIndex * n.itemSize, s.drawElements(s.TRIANGLES, f, s.UNSIGNED_SHORT, S);
                        s.colorMask(!0, !0, !0, !0), s.stencilOp(s.KEEP, s.KEEP, s.KEEP), s.stencilMask(0);
                        var d = t.paint["fill-outline-color"];
                        if (t.paint["fill-antialias"] === !0 && (!t.paint["fill-pattern"] || d)) {
                            s.switchShader(e.outlineShader, u), s.lineWidth(2 * browser.devicePixelRatio), d ? s.stencilFunc(s.EQUAL, 128, 128) : s.stencilFunc(s.EQUAL, 128, 191), s.uniform2f(e.outlineShader.u_world, s.drawingBufferWidth, s.drawingBufferHeight), s.uniform4fv(e.outlineShader.u_color, d ? d : c), l = i.buffers.fillVertex, n = i.buffers.outlineElement, n.bind(s);
                            for (var p = 0; p < a.groups.length; p++) o = a.groups[p], m = o.vertexStartIndex * l.itemSize, s.vertexAttribPointer(e.outlineShader.a_pos, 2, s.SHORT, !1, 4, m + 0), f = 2 * o.secondElementLength, S = o.secondElementStartIndex * n.itemSize, s.drawElements(s.LINES, f, s.UNSIGNED_SHORT, S)
                        }
                        var _, h = t.paint["fill-pattern"],
                            v = t.paint["fill-opacity"] || 1;
                        if (h) {
                            var x = e.spriteAtlas.getPosition(h.from, !0),
                                b = e.spriteAtlas.getPosition(h.to, !0);
                            if (!x || !b) return;
                            _ = e.patternShader, s.switchShader(_, r), s.uniform1i(_.u_image, 0), s.uniform2fv(_.u_pattern_tl_a, x.tl), s.uniform2fv(_.u_pattern_br_a, x.br), s.uniform2fv(_.u_pattern_tl_b, b.tl), s.uniform2fv(_.u_pattern_br_b, b.br), s.uniform1f(_.u_opacity, v), s.uniform1f(_.u_mix, h.t);
                            var A = i.tileExtent / i.tileSize / Math.pow(2, e.transform.tileZoom - i.coord.z),
                                R = mat3.create();
                            mat3.scale(R, R, [1 / (x.size[0] * A * h.fromScale), 1 / (x.size[1] * A * h.fromScale)]);
                            var g = mat3.create();
                            mat3.scale(g, g, [1 / (b.size[0] * A * h.toScale), 1 / (b.size[1] * A * h.toScale)]), s.uniformMatrix3fv(_.u_patternmatrix_a, !1, R), s.uniformMatrix3fv(_.u_patternmatrix_b, !1, g), e.spriteAtlas.bind(s, !0)
                        } else _ = e.fillShader, s.switchShader(_, r), s.uniform4fv(_.u_color, c);
                        s.stencilFunc(s.NOTEQUAL, 0, 63), s.bindBuffer(s.ARRAY_BUFFER, e.tileExtentBuffer), s.vertexAttribPointer(_.a_pos, e.tileExtentBuffer.itemSize, s.SHORT, !1, 0, 0), s.drawArrays(s.TRIANGLE_STRIP, 0, e.tileExtentBuffer.itemCount), s.stencilMask(0), s.stencilFunc(s.EQUAL, 128, 128)
                    }
                }
            }
            var browser = require("../util/browser"),
                mat3 = require("gl-matrix").mat3;
            module.exports = drawFill;
        }, {
            "../util/browser": 95,
            "gl-matrix": 119
        }],
        30: [function(require, module, exports) {
            "use strict";
            var browser = require("../util/browser"),
                mat2 = require("gl-matrix").mat2;
            module.exports = function(t, i, e, r) {
                if (r.buffers) {
                    var a = r.elementGroups[i.ref || i.id];
                    if (a) {
                        var n = t.gl;
                        if (!(i.paint["line-width"] <= 0)) {
                            var o = 1 / browser.devicePixelRatio,
                                f = i.paint["line-blur"] + o,
                                l = i.paint["line-width"] / 2,
                                u = -1,
                                m = 0,
                                s = 0;
                            i.paint["line-gap-width"] > 0 && (u = i.paint["line-gap-width"] / 2 + .5 * o, l = i.paint["line-width"], m = u - o / 2);
                            var _ = m + l + o / 2 + s,
                                h = i.paint["line-color"],
                                d = t.transform.scale / (1 << r.coord.z) / (r.tileExtent / r.tileSize),
                                p = t.translateMatrix(e, r, i.paint["line-translate"], i.paint["line-translate-anchor"]),
                                v = t.transform,
                                c = mat2.create();
                            mat2.scale(c, c, [1, Math.cos(v._pitch)]), mat2.rotate(c, c, t.transform.angle);
                            var x, b = Math.sqrt(v.height * v.height / 4 * (1 + v.altitude * v.altitude)),
                                w = v.height / 2 * Math.tan(v._pitch),
                                g = (b + w) / b - 1,
                                S = r.tileSize / t.transform.tileSize,
                                M = i.paint["line-dasharray"],
                                z = i.paint["line-pattern"];
                            if (M) {
                                x = t.linesdfpatternShader, n.switchShader(x, p, r.exMatrix), n.uniform2fv(x.u_linewidth, [_, u]), n.uniform1f(x.u_ratio, d), n.uniform1f(x.u_blur, f), n.uniform4fv(x.u_color, h);
                                var A = t.lineAtlas.getDash(M.from, "round" === i.layout["line-cap"]),
                                    y = t.lineAtlas.getDash(M.to, "round" === i.layout["line-cap"]);
                                t.lineAtlas.bind(n);
                                var E = Math.pow(2, Math.floor(Math.log(t.transform.scale) / Math.LN2) - r.coord.z) / 8 * S,
                                    P = [E / A.width / M.fromScale, -A.height / 2],
                                    R = t.lineAtlas.width / (M.fromScale * A.width * 256 * browser.devicePixelRatio) / 2,
                                    I = [E / y.width / M.toScale, -y.height / 2],
                                    N = t.lineAtlas.width / (M.toScale * y.width * 256 * browser.devicePixelRatio) / 2;
                                n.uniform2fv(x.u_patternscale_a, P), n.uniform1f(x.u_tex_y_a, A.y), n.uniform2fv(x.u_patternscale_b, I), n.uniform1f(x.u_tex_y_b, y.y), n.uniform1i(x.u_image, 0), n.uniform1f(x.u_sdfgamma, Math.max(R, N)), n.uniform1f(x.u_mix, M.t), n.uniform1f(x.u_extra, g), n.uniformMatrix2fv(x.u_antialiasingmatrix, !1, c)
                            } else if (z) {
                                var T = t.spriteAtlas.getPosition(z.from, !0),
                                    q = t.spriteAtlas.getPosition(z.to, !0);
                                if (!T || !q) return;
                                var D = r.tileExtent / r.tileSize / Math.pow(2, t.transform.tileZoom - r.coord.z) * S;
                                t.spriteAtlas.bind(n, !0), x = t.linepatternShader, n.switchShader(x, p, r.exMatrix), n.uniform2fv(x.u_linewidth, [_, u]), n.uniform1f(x.u_ratio, d), n.uniform1f(x.u_blur, f), n.uniform2fv(x.u_pattern_size_a, [T.size[0] * D * z.fromScale, q.size[1]]), n.uniform2fv(x.u_pattern_size_b, [q.size[0] * D * z.toScale, q.size[1]]), n.uniform2fv(x.u_pattern_tl_a, T.tl), n.uniform2fv(x.u_pattern_br_a, T.br), n.uniform2fv(x.u_pattern_tl_b, q.tl), n.uniform2fv(x.u_pattern_br_b, q.br), n.uniform1f(x.u_fade, z.t), n.uniform1f(x.u_opacity, i.paint["line-opacity"]), n.uniform1f(x.u_extra, g), n.uniformMatrix2fv(x.u_antialiasingmatrix, !1, c)
                            } else x = t.lineShader, n.switchShader(x, p, r.exMatrix), n.uniform2fv(x.u_linewidth, [_, u]), n.uniform1f(x.u_ratio, d), n.uniform1f(x.u_blur, f), n.uniform1f(x.u_extra, g), n.uniformMatrix2fv(x.u_antialiasingmatrix, !1, c), n.uniform4fv(x.u_color, h);
                            var G = r.buffers.lineVertex;
                            G.bind(n);
                            var L = r.buffers.lineElement;
                            L.bind(n);
                            for (var H = 0; H < a.groups.length; H++) {
                                var O = a.groups[H],
                                    B = O.vertexStartIndex * G.itemSize;
                                n.vertexAttribPointer(x.a_pos, 2, n.SHORT, !1, 8, B + 0), n.vertexAttribPointer(x.a_data, 4, n.BYTE, !1, 8, B + 4);
                                var U = 3 * O.elementLength,
                                    V = O.elementStartIndex * L.itemSize;
                                n.drawElements(n.TRIANGLES, U, n.UNSIGNED_SHORT, V)
                            }
                        }
                    }
                }
            };
        }, {
            "../util/browser": 95,
            "gl-matrix": 119
        }],
        31: [function(require, module, exports) {
            "use strict";

            function drawRaster(t, r, e, a) {
                var i = t.gl;
                i.disable(i.STENCIL_TEST);
                var o = t.rasterShader;
                i.switchShader(o, e), i.uniform1f(o.u_brightness_low, r.paint["raster-brightness-min"]), i.uniform1f(o.u_brightness_high, r.paint["raster-brightness-max"]), i.uniform1f(o.u_saturation_factor, saturationFactor(r.paint["raster-saturation"])), i.uniform1f(o.u_contrast_factor, contrastFactor(r.paint["raster-contrast"])), i.uniform3fv(o.u_spin_weights, spinWeights(r.paint["raster-hue-rotate"]));
                var n, u, s = a.source && a.source._pyramid.findLoadedParent(a.coord, 0, {}),
                    c = getOpacities(a, s, r, t.transform);
                i.activeTexture(i.TEXTURE0), i.bindTexture(i.TEXTURE_2D, a.texture), s ? (i.activeTexture(i.TEXTURE1), i.bindTexture(i.TEXTURE_2D, s.texture), n = Math.pow(2, s.coord.z - a.coord.z), u = [a.coord.x * n % 1, a.coord.y * n % 1]) : c[1] = 0, i.uniform2fv(o.u_tl_parent, u || [0, 0]), i.uniform1f(o.u_scale_parent, n || 1), i.uniform1f(o.u_buffer_scale, 1), i.uniform1f(o.u_opacity0, c[0]), i.uniform1f(o.u_opacity1, c[1]), i.uniform1i(o.u_image0, 0), i.uniform1i(o.u_image1, 1), i.bindBuffer(i.ARRAY_BUFFER, a.boundsBuffer || t.tileExtentBuffer), i.vertexAttribPointer(o.a_pos, 2, i.SHORT, !1, 8, 0), i.vertexAttribPointer(o.a_texture_pos, 2, i.SHORT, !1, 8, 4), i.drawArrays(i.TRIANGLE_STRIP, 0, 4), i.enable(i.STENCIL_TEST)
            }

            function spinWeights(t) {
                t *= Math.PI / 180;
                var r = Math.sin(t),
                    e = Math.cos(t);
                return [(2 * e + 1) / 3, (-Math.sqrt(3) * r - e + 1) / 3, (Math.sqrt(3) * r - e + 1) / 3]
            }

            function contrastFactor(t) {
                return t > 0 ? 1 / (1 - t) : 1 + t
            }

            function saturationFactor(t) {
                return t > 0 ? 1 - 1 / (1.001 - t) : -t
            }

            function getOpacities(t, r, e, a) {
                if (!t.source) return [1, 0];
                var i = (new Date).getTime(),
                    o = e.paint["raster-fade-duration"],
                    n = (i - t.timeAdded) / o,
                    u = r ? (i - r.timeAdded) / o : -1,
                    s = t.source._pyramid.coveringZoomLevel(a),
                    c = r ? Math.abs(r.coord.z - s) > Math.abs(t.coord.z - s) : !1,
                    f = [];
                !r || c ? (f[0] = util.clamp(n, 0, 1), f[1] = 1 - f[0]) : (f[0] = util.clamp(1 - u, 0, 1), f[1] = 1 - f[0]);
                var d = e.paint["raster-opacity"];
                return f[0] *= d, f[1] *= d, f
            }
            var util = require("../util/util");
            module.exports = drawRaster;
        }, {
            "../util/util": 106
        }],
        32: [function(require, module, exports) {
            "use strict";

            function drawSymbols(e, t, r, a) {
                if (a.buffers) {
                    var o = a.elementGroups[t.ref || t.id];
                    if (o) {
                        var i = !(t.layout["text-allow-overlap"] || t.layout["icon-allow-overlap"] || t.layout["text-ignore-placement"] || t.layout["icon-ignore-placement"]),
                            n = e.gl;
                        i && n.disable(n.STENCIL_TEST), o.text.groups.length && drawSymbol(e, t, r, a, o.text, "text", !0), o.icon.groups.length && drawSymbol(e, t, r, a, o.icon, "icon", o.sdfIcons), drawCollisionDebug(e, t, r, a), i && n.enable(n.STENCIL_TEST)
                    }
                }
            }

            function drawSymbol(e, t, r, a, o, i, n) {
                var l = e.gl;
                r = e.translateMatrix(r, a, t.paint[i + "-translate"], t.paint[i + "-translate-anchor"]);
                var m, f, u, s = e.transform,
                    d = "map" === t.layout[i + "-rotation-alignment"],
                    h = d;
                h ? (m = mat4.create(), f = a.tileExtent / a.tileSize / Math.pow(2, e.transform.zoom - a.coord.z), u = 1 / Math.cos(s._pitch)) : (m = mat4.clone(a.exMatrix), f = e.transform.altitude, u = 1), mat4.scale(m, m, [f, f, 1]);
                var p = t.paint[i + "-size"],
                    g = p / defaultSizes[i];
                mat4.scale(m, m, [g, g, 1]);
                var S, c, x, b, v = Math.sqrt(s.height * s.height / 4 * (1 + s.altitude * s.altitude)),
                    _ = s.height / 2 * Math.tan(s._pitch),
                    z = (v + _) / v - 1,
                    w = "text" === i;
                if (w || e.style.sprite.loaded()) {
                    l.activeTexture(l.TEXTURE0), S = n ? e.sdfShader : e.iconShader, w ? (e.glyphAtlas.updateTexture(l), c = a.buffers.glyphVertex, x = a.buffers.glyphElement, b = [e.glyphAtlas.width / 4, e.glyphAtlas.height / 4]) : (e.spriteAtlas.bind(l, d || e.options.rotating || e.options.zooming || 1 !== g || n || e.transform.pitch), c = a.buffers.iconVertex, x = a.buffers.iconElement, b = [e.spriteAtlas.width / 4, e.spriteAtlas.height / 4]), l.switchShader(S, r, m), l.uniform1i(S.u_texture, 0), l.uniform2fv(S.u_texsize, b), l.uniform1i(S.u_skewed, h), l.uniform1f(S.u_extra, z);
                    var y = Math.log(p / o[i + "-size"]) / Math.LN2 || 0;
                    l.uniform1f(S.u_zoom, 10 * (e.transform.zoom - y));
                    var E = e.frameHistory.getFadeProperties(300);
                    l.uniform1f(S.u_fadedist, 10 * E.fadedist), l.uniform1f(S.u_minfadezoom, Math.floor(10 * E.minfadezoom)), l.uniform1f(S.u_maxfadezoom, Math.floor(10 * E.maxfadezoom)), l.uniform1f(S.u_fadezoom, 10 * (e.transform.zoom + E.bump));
                    var T, I, N, M;
                    if (x.bind(l), n) {
                        var A = 8,
                            L = 1.19,
                            R = 6,
                            G = .105 * defaultSizes[i] / p / browser.devicePixelRatio;
                        l.uniform1f(S.u_gamma, G * u), l.uniform4fv(S.u_color, t.paint[i + "-color"]), l.uniform1f(S.u_buffer, .75);
                        for (var D = 0; D < o.groups.length; D++) T = o.groups[D], I = T.vertexStartIndex * c.itemSize, c.bind(l, S, I), N = 3 * T.elementLength, M = T.elementStartIndex * x.itemSize, l.drawElements(l.TRIANGLES, N, l.UNSIGNED_SHORT, M);
                        if (t.paint[i + "-halo-width"]) {
                            l.uniform1f(S.u_gamma, (t.paint[i + "-halo-blur"] * L / g / A + G) * u), l.uniform4fv(S.u_color, t.paint[i + "-halo-color"]), l.uniform1f(S.u_buffer, (R - t.paint[i + "-halo-width"] / g) / A);
                            for (var q = 0; q < o.groups.length; q++) T = o.groups[q], I = T.vertexStartIndex * c.itemSize, c.bind(l, S, I), N = 3 * T.elementLength, M = T.elementStartIndex * x.itemSize, l.drawElements(l.TRIANGLES, N, l.UNSIGNED_SHORT, M)
                        }
                    } else {
                        l.uniform1f(S.u_opacity, t.paint["icon-opacity"]);
                        for (var C = 0; C < o.groups.length; C++) T = o.groups[C], I = T.vertexStartIndex * c.itemSize, c.bind(l, S, I), N = 3 * T.elementLength, M = T.elementStartIndex * x.itemSize, l.drawElements(l.TRIANGLES, N, l.UNSIGNED_SHORT, M)
                    }
                }
            }
            var browser = require("../util/browser"),
                mat4 = require("gl-matrix").mat4,
                drawCollisionDebug = require("./draw_collision_debug");
            module.exports = drawSymbols;
            var defaultSizes = {
                icon: 1,
                text: 24
            };
        }, {
            "../util/browser": 95,
            "./draw_collision_debug": 27,
            "gl-matrix": 119
        }],
        33: [function(require, module, exports) {
            "use strict";

            function drawVertices(e, r, t, i) {
                function o(r, t, i, o) {
                    f.switchShader(e.dotShader, i), f.uniform1f(e.dotShader.u_size, 4 * browser.devicePixelRatio), f.uniform1f(e.dotShader.u_blur, .25), f.uniform4fv(e.dotShader.u_color, [.1, 0, 0, .1]), r.bind(f, e.dotShader, 0);
                    for (var a = 0; a < t.length; a++) {
                        var s = t[a],
                            u = s.vertexStartIndex,
                            d = s.vertexLength;
                        f.vertexAttribPointer(e.dotShader.a_pos, 2, f.SHORT, !1, o, 0), f.drawArrays(f.POINTS, u, d)
                    }
                }
                var f = e.gl;
                if (i && i.buffers) {
                    var a = i.elementGroups[r.ref || r.id];
                    if (a) {
                        if (f.blendFunc(f.ONE, f.ONE_MINUS_SRC_ALPHA), "fill" === r.type) o(i.buffers.fillVertex, a.groups, t, 4);
                        else if ("symbol" === r.type) o(i.buffers.iconVertex, a.icon.groups, t, 16), o(i.buffers.glyphVertex, a.text.groups, t, 16);
                        else if ("line" === r.type) {
                            var s = mat4.clone(t);
                            mat4.scale(s, s, [.5, .5, 1]), o(i.buffers.lineVertex, a.groups, s, 8)
                        }
                        f.blendFunc(f.ONE_MINUS_DST_ALPHA, f.ONE)
                    }
                }
            }
            var browser = require("../util/browser"),
                mat4 = require("gl-matrix").mat4;
            module.exports = drawVertices;
        }, {
            "../util/browser": 95,
            "gl-matrix": 119
        }],
        34: [function(require, module, exports) {
            "use strict";

            function FrameHistory() {
                this.frameHistory = []
            }
            module.exports = FrameHistory, FrameHistory.prototype.getFadeProperties = function(t) {
                void 0 === t && (t = 300);
                for (var e = (new Date).getTime(); this.frameHistory.length > 3 && this.frameHistory[1].time + t < e;) this.frameHistory.shift();
                this.frameHistory[1].time + t < e && (this.frameHistory[0].z = this.frameHistory[1].z);
                var r = this.frameHistory.length;
                3 > r && console.warn("there should never be less than three frames in the history");
                var i = this.frameHistory[0].z,
                    s = this.frameHistory[r - 1],
                    o = s.z,
                    a = Math.min(i, o),
                    m = Math.max(i, o),
                    h = s.z - this.frameHistory[1].z,
                    f = s.time - this.frameHistory[1].time,
                    y = h / (f / t);
                isNaN(y) && console.warn("fadedist should never be NaN");
                var n = (e - s.time) / t * y;
                return {
                    fadedist: y,
                    minfadezoom: a,
                    maxfadezoom: m,
                    bump: n
                }
            }, FrameHistory.prototype.record = function(t) {
                var e = (new Date).getTime();
                this.frameHistory.length || this.frameHistory.push({
                    time: 0,
                    z: t
                }, {
                    time: 0,
                    z: t
                }), (2 === this.frameHistory.length || this.frameHistory[this.frameHistory.length - 1].z !== t) && this.frameHistory.push({
                    time: e,
                    z: t
                })
            };
        }, {}],
        35: [function(require, module, exports) {
            "use strict";
            var shaders = require("./shaders"),
                util = require("../util/util");
            exports.extend = function(r) {
                var t = r.lineWidth,
                    e = r.getParameter(r.ALIASED_LINE_WIDTH_RANGE);
                return r.lineWidth = function(i) {
                    t.call(r, util.clamp(i, e[0], e[1]))
                }, r.getShader = function(r, t) {
                    var e = t === this.FRAGMENT_SHADER ? "fragment" : "vertex";
                    if (!shaders[r] || !shaders[r][e]) throw new Error("Could not find shader " + r);
                    var i = this.createShader(t),
                        a = shaders[r][e];
                    if ("undefined" == typeof orientation && (a = a.replace(/ highp /g, " ")), this.shaderSource(i, a), this.compileShader(i), !this.getShaderParameter(i, this.COMPILE_STATUS)) throw new Error(this.getShaderInfoLog(i));
                    return i
                }, r.initializeShader = function(r, t, e) {
                    var i = {
                        program: this.createProgram(),
                        fragment: this.getShader(r, this.FRAGMENT_SHADER),
                        vertex: this.getShader(r, this.VERTEX_SHADER),
                        attributes: []
                    };
                    if (this.attachShader(i.program, i.vertex), this.attachShader(i.program, i.fragment), this.linkProgram(i.program), this.getProgramParameter(i.program, this.LINK_STATUS)) {
                        for (var a = 0; a < t.length; a++) i[t[a]] = this.getAttribLocation(i.program, t[a]), i.attributes.push(i[t[a]]);
                        for (var h = 0; h < e.length; h++) i[e[h]] = this.getUniformLocation(i.program, e[h])
                    } else console.error(this.getProgramInfoLog(i.program));
                    return i
                }, r.switchShader = function(r, t, e) {
                    if (t || console.trace("posMatrix does not have required argument"), this.currentShader !== r) {
                        this.useProgram(r.program);
                        for (var i = this.currentShader ? this.currentShader.attributes : [], a = r.attributes, h = 0; h < i.length; h++) a.indexOf(i[h]) < 0 && this.disableVertexAttribArray(i[h]);
                        for (var o = 0; o < a.length; o++) i.indexOf(a[o]) < 0 && this.enableVertexAttribArray(a[o]);
                        this.currentShader = r
                    }
                    r.posMatrix !== t && (this.uniformMatrix4fv(r.u_matrix, !1, t), r.posMatrix = t), e && r.exMatrix !== e && r.u_exmatrix && (this.uniformMatrix4fv(r.u_exmatrix, !1, e), r.exMatrix = e)
                }, r.vertexAttrib2fv = function(t, e) {
                    r.vertexAttrib2f(t, e[0], e[1])
                }, r.vertexAttrib3fv = function(t, e) {
                    r.vertexAttrib3f(t, e[0], e[1], e[2])
                }, r.vertexAttrib4fv = function(t, e) {
                    r.vertexAttrib4f(t, e[0], e[1], e[2], e[3])
                }, r
            };
        }, {
            "../util/util": 106,
            "./shaders": 38
        }],
        36: [function(require, module, exports) {
            "use strict";

            function LineAtlas(t, i) {
                this.width = t, this.height = i, this.nextRow = 0, this.bytes = 4, this.data = new Uint8Array(this.width * this.height * this.bytes), this.positions = {}
            }
            module.exports = LineAtlas, LineAtlas.prototype.setSprite = function(t) {
                this.sprite = t
            }, LineAtlas.prototype.getDash = function(t, i) {
                var e = t.join(",") + i;
                return this.positions[e] || (this.positions[e] = this.addDash(t, i)), this.positions[e]
            }, LineAtlas.prototype.addDash = function(t, i) {
                var e = i ? 7 : 0,
                    h = 2 * e + 1,
                    s = 128;
                if (this.nextRow + h > this.height) return console.warn("LineAtlas out of space"), null;
                for (var a = 0, r = 0; r < t.length; r++) a += t[r];
                for (var n = this.width / a, o = n / 2, d = t.length % 2 === 1, E = -e; e >= E; E++)
                    for (var T = this.nextRow + e + E, l = this.width * T, R = d ? -t[t.length - 1] : 0, u = t[0], g = 1, p = 0; p < this.width; p++) {
                        for (; p / n > u;) R = u, u += t[g], d && g === t.length - 1 && (u += t[0]), g++;
                        var x, f = Math.abs(p - R * n),
                            A = Math.abs(p - u * n),
                            w = Math.min(f, A),
                            _ = g % 2 === 1;
                        if (i) {
                            var y = e ? E / e * (o + 1) : 0;
                            if (_) {
                                var D = o - Math.abs(y);
                                x = Math.sqrt(w * w + D * D)
                            } else x = o - Math.sqrt(w * w + y * y)
                        } else x = (_ ? 1 : -1) * w;
                        this.data[3 + 4 * (l + p)] = Math.max(0, Math.min(255, x + s))
                    }
                var c = {
                    y: (this.nextRow + e + .5) / this.height,
                    height: 2 * e / this.height,
                    width: a
                };
                return this.nextRow += h, this.dirty = !0, c
            }, LineAtlas.prototype.bind = function(t) {
                this.texture ? (t.bindTexture(t.TEXTURE_2D, this.texture), this.dirty && (this.dirty = !1, t.texSubImage2D(t.TEXTURE_2D, 0, 0, 0, this.width, this.height, t.RGBA, t.UNSIGNED_BYTE, this.data))) : (this.texture = t.createTexture(), t.bindTexture(t.TEXTURE_2D, this.texture), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_S, t.REPEAT), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_T, t.REPEAT), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MIN_FILTER, t.LINEAR), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MAG_FILTER, t.LINEAR), t.texImage2D(t.TEXTURE_2D, 0, t.RGBA, this.width, this.height, 0, t.RGBA, t.UNSIGNED_BYTE, this.data))
            }, LineAtlas.prototype.debug = function() {
                var t = document.createElement("canvas");
                document.body.appendChild(t), t.style.position = "absolute", t.style.top = 0, t.style.left = 0, t.style.background = "#ff0", t.width = this.width, t.height = this.height;
                for (var i = t.getContext("2d"), e = i.getImageData(0, 0, this.width, this.height), h = 0; h < this.data.length; h++)
                    if (this.sdf) {
                        var s = 4 * h;
                        e.data[s] = e.data[s + 1] = e.data[s + 2] = 0, e.data[s + 3] = this.data[h]
                    } else e.data[h] = this.data[h];
                i.putImageData(e, 0, 0)
            };
        }, {}],
        37: [function(require, module, exports) {
            "use strict";

            function Painter(t, e) {
                this.gl = glutil.extend(t), this.transform = e, this.reusableTextures = {}, this.preFbos = {}, this.frameHistory = new FrameHistory, this.setup()
            }
            var glutil = require("./gl_util"),
                browser = require("../util/browser"),
                mat4 = require("gl-matrix").mat4,
                FrameHistory = require("./frame_history");
            module.exports = Painter, Painter.prototype.resize = function(t, e) {
                var i = this.gl;
                this.width = t * browser.devicePixelRatio, this.height = e * browser.devicePixelRatio, i.viewport(0, 0, this.width, this.height)
            }, Painter.prototype.setup = function() {
                var t = this.gl;
                t.verbose = !0, t.enable(t.BLEND), t.blendFunc(t.ONE_MINUS_DST_ALPHA, t.ONE), t.enable(t.STENCIL_TEST), this.debugShader = t.initializeShader("debug", ["a_pos"], ["u_matrix", "u_color"]), this.rasterShader = t.initializeShader("raster", ["a_pos", "a_texture_pos"], ["u_matrix", "u_brightness_low", "u_brightness_high", "u_saturation_factor", "u_spin_weights", "u_contrast_factor", "u_opacity0", "u_opacity1", "u_image0", "u_image1", "u_tl_parent", "u_scale_parent", "u_buffer_scale"]), this.circleShader = t.initializeShader("circle", ["a_pos"], ["u_matrix", "u_exmatrix", "u_blur", "u_size", "u_color"]), this.lineShader = t.initializeShader("line", ["a_pos", "a_data"], ["u_matrix", "u_linewidth", "u_color", "u_ratio", "u_blur", "u_extra", "u_antialiasingmatrix"]), this.linepatternShader = t.initializeShader("linepattern", ["a_pos", "a_data"], ["u_matrix", "u_linewidth", "u_ratio", "u_pattern_size_a", "u_pattern_size_b", "u_pattern_tl_a", "u_pattern_br_a", "u_pattern_tl_b", "u_pattern_br_b", "u_blur", "u_fade", "u_opacity", "u_extra", "u_antialiasingmatrix"]), this.linesdfpatternShader = t.initializeShader("linesdfpattern", ["a_pos", "a_data"], ["u_matrix", "u_linewidth", "u_color", "u_ratio", "u_blur", "u_patternscale_a", "u_tex_y_a", "u_patternscale_b", "u_tex_y_b", "u_image", "u_sdfgamma", "u_mix", "u_extra", "u_antialiasingmatrix"]), this.dotShader = t.initializeShader("dot", ["a_pos"], ["u_matrix", "u_size", "u_color", "u_blur"]), this.sdfShader = t.initializeShader("sdf", ["a_pos", "a_offset", "a_data1", "a_data2"], ["u_matrix", "u_exmatrix", "u_texture", "u_texsize", "u_color", "u_gamma", "u_buffer", "u_zoom", "u_fadedist", "u_minfadezoom", "u_maxfadezoom", "u_fadezoom", "u_skewed", "u_extra"]), this.iconShader = t.initializeShader("icon", ["a_pos", "a_offset", "a_data1", "a_data2"], ["u_matrix", "u_exmatrix", "u_texture", "u_texsize", "u_zoom", "u_fadedist", "u_minfadezoom", "u_maxfadezoom", "u_fadezoom", "u_opacity", "u_skewed", "u_extra"]), this.outlineShader = t.initializeShader("outline", ["a_pos"], ["u_matrix", "u_color", "u_world"]), this.patternShader = t.initializeShader("pattern", ["a_pos"], ["u_matrix", "u_pattern_tl_a", "u_pattern_br_a", "u_pattern_tl_b", "u_pattern_br_b", "u_mix", "u_patternmatrix_a", "u_patternmatrix_b", "u_opacity", "u_image"]), this.fillShader = t.initializeShader("fill", ["a_pos"], ["u_matrix", "u_color"]), this.collisionBoxShader = t.initializeShader("collisionbox", ["a_pos", "a_extrude", "a_data"], ["u_matrix", "u_scale", "u_zoom", "u_maxzoom"]), this.identityMatrix = mat4.create(), this.backgroundBuffer = t.createBuffer(), this.backgroundBuffer.itemSize = 2, this.backgroundBuffer.itemCount = 4, t.bindBuffer(t.ARRAY_BUFFER, this.backgroundBuffer), t.bufferData(t.ARRAY_BUFFER, new Int16Array([-1, -1, 1, -1, -1, 1, 1, 1]), t.STATIC_DRAW), this.setExtent(4096), this.debugTextBuffer = t.createBuffer(), this.debugTextBuffer.itemSize = 2
            }, Painter.prototype.setExtent = function(t) {
                if (t && t !== this.tileExtent) {
                    this.tileExtent = t;
                    var e = this.gl;
                    this.tileExtentBuffer = e.createBuffer(), this.tileExtentBuffer.itemSize = 4, this.tileExtentBuffer.itemCount = 4, e.bindBuffer(e.ARRAY_BUFFER, this.tileExtentBuffer), e.bufferData(e.ARRAY_BUFFER, new Int16Array([0, 0, 0, 0, this.tileExtent, 0, 32767, 0, 0, this.tileExtent, 0, 32767, this.tileExtent, this.tileExtent, 32767, 32767]), e.STATIC_DRAW), this.debugBuffer = e.createBuffer(), this.debugBuffer.itemSize = 2, this.debugBuffer.itemCount = 5, e.bindBuffer(e.ARRAY_BUFFER, this.debugBuffer), e.bufferData(e.ARRAY_BUFFER, new Int16Array([0, 0, this.tileExtent - 1, 0, this.tileExtent - 1, this.tileExtent - 1, 0, this.tileExtent - 1, 0, 0]), e.STATIC_DRAW)
                }
            }, Painter.prototype.clearColor = function() {
                var t = this.gl;
                t.clearColor(0, 0, 0, 0), t.clear(t.COLOR_BUFFER_BIT)
            }, Painter.prototype.clearStencil = function() {
                var t = this.gl;
                t.clearStencil(0), t.stencilMask(255), t.clear(t.STENCIL_BUFFER_BIT)
            }, Painter.prototype.drawClippingMask = function(t) {
                var e = this.gl;
                e.switchShader(this.fillShader, t.posMatrix), e.colorMask(!1, !1, !1, !1), e.clearStencil(0), e.stencilMask(191), e.clear(e.STENCIL_BUFFER_BIT), e.stencilFunc(e.EQUAL, 192, 64), e.stencilMask(192), e.stencilOp(e.REPLACE, e.KEEP, e.KEEP), e.bindBuffer(e.ARRAY_BUFFER, this.tileExtentBuffer), e.vertexAttribPointer(this.fillShader.a_pos, this.tileExtentBuffer.itemSize, e.SHORT, !1, 8, 0), e.drawArrays(e.TRIANGLE_STRIP, 0, this.tileExtentBuffer.itemCount), e.stencilFunc(e.EQUAL, 128, 128), e.stencilOp(e.KEEP, e.KEEP, e.REPLACE), e.stencilMask(0), e.colorMask(!0, !0, !0, !0)
            }, Painter.prototype.prepareBuffers = function() {}, Painter.prototype.bindDefaultFramebuffer = function() {
                var t = this.gl;
                t.bindFramebuffer(t.FRAMEBUFFER, null)
            };
            var draw = {
                symbol: require("./draw_symbol"),
                circle: require("./draw_circle"),
                line: require("./draw_line"),
                fill: require("./draw_fill"),
                raster: require("./draw_raster"),
                background: require("./draw_background"),
                debug: require("./draw_debug"),
                vertices: require("./draw_vertices")
            };
            Painter.prototype.render = function(t, e) {
                this.style = t, this.options = e, this.lineAtlas = t.lineAtlas, this.spriteAtlas = t.spriteAtlas, this.spriteAtlas.setSprite(t.sprite), this.glyphAtlas = t.glyphAtlas, this.glyphAtlas.bind(this.gl), this.frameHistory.record(this.transform.zoom), this.prepareBuffers(), this.clearColor();
                for (var i = t._groups.length - 1; i >= 0; i--) {
                    var r = t._groups[i],
                        a = t.sources[r.source];
                    a ? (this.clearStencil(), a.render(r, this)) : void 0 === r.source && this.drawLayers(r, this.identityMatrix)
                }
            }, Painter.prototype.drawTile = function(t, e) {
                this.setExtent(t.tileExtent), this.drawClippingMask(t), this.drawLayers(e, t.posMatrix, t), this.options.debug && draw.debug(this, t)
            }, Painter.prototype.drawLayers = function(t, e, i) {
                for (var r = t.length - 1; r >= 0; r--) {
                    var a = t[r];
                    a.hidden || (draw[a.type](this, a, e, i), this.options.vertices && draw.vertices(this, a, e, i))
                }
            }, Painter.prototype.drawStencilBuffer = function() {
                var t = this.gl;
                t.switchShader(this.fillShader, this.identityMatrix), t.blendFunc(t.ONE, t.ONE_MINUS_SRC_ALPHA), t.stencilMask(0), t.stencilFunc(t.EQUAL, 128, 128), t.bindBuffer(t.ARRAY_BUFFER, this.backgroundBuffer), t.vertexAttribPointer(this.fillShader.a_pos, this.backgroundBuffer.itemSize, t.SHORT, !1, 0, 0), t.uniform4fv(this.fillShader.u_color, [0, 0, 0, .5]), t.drawArrays(t.TRIANGLE_STRIP, 0, this.tileExtentBuffer.itemCount), t.blendFunc(t.ONE_MINUS_DST_ALPHA, t.ONE)
            }, Painter.prototype.translateMatrix = function(t, e, i, r) {
                if (!i[0] && !i[1]) return t;
                if ("viewport" === r) {
                    var a = Math.sin(-this.transform.angle),
                        s = Math.cos(-this.transform.angle);
                    i = [i[0] * s - i[1] * a, i[0] * a + i[1] * s]
                }
                var u = this.transform.scale / (1 << e.coord.z) / (e.tileExtent / e.tileSize),
                    n = [i[0] / u, i[1] / u, 0],
                    _ = new Float32Array(16);
                return mat4.translate(_, t, n), _
            }, Painter.prototype.saveTexture = function(t) {
                var e = this.reusableTextures[t.size];
                e ? e.push(t) : this.reusableTextures[t.size] = [t]
            }, Painter.prototype.getTexture = function(t) {
                var e = this.reusableTextures[t];
                return e && e.length > 0 ? e.pop() : null
            };
        }, {
            "../util/browser": 95,
            "./draw_background": 25,
            "./draw_circle": 26,
            "./draw_debug": 28,
            "./draw_fill": 29,
            "./draw_line": 30,
            "./draw_raster": 31,
            "./draw_symbol": 32,
            "./draw_vertices": 33,
            "./frame_history": 34,
            "./gl_util": 35,
            "gl-matrix": 119
        }],
        38: [function(require, module, exports) {
            "use strict";
            var glify = void 0;
            module.exports = {
                debug: {
                    vertex: "precision mediump float;attribute vec2 a_pos;uniform mat4 u_matrix;void main(){gl_Position=u_matrix*vec4(a_pos,step(32767.,a_pos.x),1);}",
                    fragment: "precision mediump float;uniform vec4 u_color;void main(){gl_FragColor=u_color;}"
                },
                dot: {
                    vertex: "precision mediump float;uniform mat4 u_matrix;uniform float u_size;attribute vec2 a_pos;void main(){gl_Position=u_matrix*vec4(a_pos,0,1);gl_PointSize=u_size;}",
                    fragment: "precision mediump float;uniform vec4 u_color;uniform float u_blur;void main(){float a,b;a=length(gl_PointCoord-.5);b=smoothstep(.5,.5-u_blur,a);gl_FragColor=u_color*b;}"
                },
                fill: {
                    vertex: "precision mediump float;attribute vec2 a_pos;uniform mat4 u_matrix;void main(){gl_Position=u_matrix*vec4(a_pos,0,1);}",
                    fragment: "precision mediump float;uniform vec4 u_color;void main(){gl_FragColor=u_color;}"
                },
                circle: {
                    vertex: "precision mediump float;uniform float u_size;attribute vec2 a_pos;uniform mat4 u_matrix,u_exmatrix;varying vec2 a;void main(){a=vec2(mod(a_pos,2.)*2.-1.);vec4 b=u_exmatrix*vec4(a*u_size,0,0);gl_Position=u_matrix*vec4(floor(a_pos*.5),0,1);gl_Position+=b*gl_Position.w;}",
                    fragment: "precision mediump float;uniform vec4 u_color;uniform float u_blur,u_size;varying vec2 a;void main(){float b=smoothstep(1.-u_blur,1.,length(a));gl_FragColor=u_color*(1.-b);}"
                },
                line: {
                    vertex: "precision mediump float;attribute vec2 a_pos;attribute vec4 a_data;uniform highp mat4 u_matrix;uniform float u_ratio,u_extra;uniform vec2 u_linewidth;uniform mat2 u_antialiasingmatrix;varying vec2 a;varying float b,c;void main(){vec2 d,e;d=a_data.xy;e=mod(a_pos,2.);e.y=sign(e.y-.5);a=e;vec4 f=vec4(u_linewidth.s*d*.015873016,0,0);gl_Position=u_matrix*vec4(floor(a_pos*.5)+f.xy/u_ratio,0,1);float g,h,i;g=gl_Position.y/gl_Position.w;h=length(d)/length(u_antialiasingmatrix*d);i=1./(1.-min(g*u_extra,.9));c=i*h;}",
                    fragment: "precision mediump float;uniform vec2 u_linewidth;uniform vec4 u_color;uniform float u_blur;varying vec2 a;varying float b,c;void main(){float d,e,f;d=length(a)*u_linewidth.s;e=u_blur*c;f=clamp(min(d-(u_linewidth.t-e),u_linewidth.s-d)/e,0.,1.);gl_FragColor=u_color*f;}"
                },
                linepattern: {
                    vertex: "precision mediump float;attribute vec2 a_pos;attribute vec4 a_data;uniform highp mat4 u_matrix;uniform float u_ratio,u_extra;uniform vec2 u_linewidth;uniform vec4 u_color;uniform mat2 u_antialiasingmatrix;varying vec2 a;varying float b,c;void main(){vec2 d,f,g,h;d=a_data.xy;float e,i,j,k;e=a_data.z*128.+a_data.w;f=mod(a_pos,2.);f.y=sign(f.y-.5);a=f;g=d*.015873016;h=u_linewidth.s*g;gl_Position=u_matrix*vec4(floor(a_pos*.5)+h.xy/u_ratio,0,1);b=e;i=gl_Position.y/gl_Position.w;j=length(d)/length(u_antialiasingmatrix*d);k=1./(1.-min(i*u_extra,.9));c=k*j;}",
                    fragment: "precision mediump float;uniform vec2 u_linewidth,u_pattern_size_a,u_pattern_size_b,u_pattern_tl_a,u_pattern_br_a,u_pattern_tl_b,u_pattern_br_b;uniform float u_point,u_blur,u_fade,u_opacity;uniform sampler2D u_image;varying vec2 a;varying float b,c;void main(){float d,e,f,g,h,i,j;d=length(a)*u_linewidth.s;e=u_blur*c;f=clamp(min(d-(u_linewidth.t-e),u_linewidth.s-d)/e,0.,1.);g=mod(b/u_pattern_size_a.x,1.);h=mod(b/u_pattern_size_b.x,1.);i=.5+a.y*u_linewidth.s/u_pattern_size_a.y;j=.5+a.y*u_linewidth.s/u_pattern_size_b.y;vec2 k,l;k=mix(u_pattern_tl_a,u_pattern_br_a,vec2(g,i));l=mix(u_pattern_tl_b,u_pattern_br_b,vec2(h,j));vec4 m=mix(texture2D(u_image,k),texture2D(u_image,l),u_fade);f*=u_opacity;gl_FragColor=m*f;}"
                },
                linesdfpattern: {
                    vertex: "precision mediump float;attribute vec2 a_pos;attribute vec4 a_data;uniform highp mat4 u_matrix;uniform vec2 u_linewidth,u_patternscale_a,u_patternscale_b;uniform float u_ratio,u_tex_y_a,u_tex_y_b,u_extra;uniform mat2 u_antialiasingmatrix;varying vec2 a,b,c;varying float d;void main(){vec2 e,g;e=a_data.xy;float f,i,j,k;f=a_data.z*128.+a_data.w;g=mod(a_pos,2.);g.y=sign(g.y-.5);a=g;vec4 h=vec4(u_linewidth.s*e*.015873016,0,0);gl_Position=u_matrix*vec4(floor(a_pos*.5)+h.xy/u_ratio,0,1);b=vec2(f*u_patternscale_a.x,g.y*u_patternscale_a.y+u_tex_y_a);c=vec2(f*u_patternscale_b.x,g.y*u_patternscale_b.y+u_tex_y_b);i=gl_Position.y/gl_Position.w;j=length(e)/length(u_antialiasingmatrix*e);k=1./(1.-min(i*u_extra,.9));d=k*j;}",
                    fragment: "precision mediump float;uniform vec2 u_linewidth;uniform vec4 u_color;uniform float u_blur,u_sdfgamma,u_mix;uniform sampler2D u_image;varying vec2 a,b,c;varying float d;void main(){float e,f,g,h,i,j;e=length(a)*u_linewidth.s;f=u_blur*d;g=clamp(min(e-(u_linewidth.t-f),u_linewidth.s-e)/f,0.,1.);h=texture2D(u_image,b).a;i=texture2D(u_image,c).a;j=mix(h,i,u_mix);g*=smoothstep(.5-u_sdfgamma,.5+u_sdfgamma,j);gl_FragColor=u_color*g;}"
                },
                outline: {
                    vertex: "precision mediump float;attribute vec2 a_pos;uniform highp mat4 u_matrix;uniform vec2 u_world;varying vec2 a;void main(){gl_Position=u_matrix*vec4(a_pos,0,1);a=(gl_Position.xy/gl_Position.w+1.)/2.*u_world;}",
                    fragment: "precision mediump float;uniform vec4 u_color;varying vec2 a;void main(){float b,c;b=length(a-gl_FragCoord.xy);c=smoothstep(1.,0.,b);gl_FragColor=u_color*c;}"
                },
                pattern: {
                    vertex: "precision mediump float;uniform mat4 u_matrix;uniform mat3 u_patternmatrix_a,u_patternmatrix_b;attribute vec2 a_pos;varying vec2 a,b;void main(){gl_Position=u_matrix*vec4(a_pos,0,1);a=(u_patternmatrix_a*vec3(a_pos,1)).xy;b=(u_patternmatrix_b*vec3(a_pos,1)).xy;}",
                    fragment: "precision mediump float;uniform float u_opacity,u_mix;uniform vec2 u_pattern_tl_a,u_pattern_br_a,u_pattern_tl_b,u_pattern_br_b;uniform sampler2D u_image;varying vec2 a,b;void main(){vec2 c,d,f,g;c=mod(a,1.);d=mix(u_pattern_tl_a,u_pattern_br_a,c);vec4 e,h;e=texture2D(u_image,d);f=mod(b,1.);g=mix(u_pattern_tl_b,u_pattern_br_b,f);h=texture2D(u_image,g);gl_FragColor=mix(e,h,u_mix)*u_opacity;}"
                },
                raster: {
                    vertex: "precision mediump float;uniform mat4 u_matrix;uniform vec2 u_tl_parent;uniform float u_scale_parent,u_buffer_scale;attribute vec2 a_pos,a_texture_pos;varying vec2 a,b;void main(){gl_Position=u_matrix*vec4(a_pos,0,1);a=(a_texture_pos/32767.-.5)/u_buffer_scale+.5;b=a*u_scale_parent+u_tl_parent;}",
                    fragment: "precision mediump float;uniform float u_opacity0,u_opacity1,u_brightness_low,u_brightness_high,u_saturation_factor,u_contrast_factor;uniform sampler2D u_image0,u_image1;varying vec2 a,b;uniform vec3 u_spin_weights;void main(){vec4 c,d,e;c=texture2D(u_image0,a);d=texture2D(u_image1,b);e=c*u_opacity0+d*u_opacity1;vec3 f,h,i;f=e.rgb;f=vec3(dot(f,u_spin_weights.xyz),dot(f,u_spin_weights.zxy),dot(f,u_spin_weights.yzx));float g=(e.r+e.g+e.b)/3.;f+=(g-f)*u_saturation_factor;f=(f-.5)*u_contrast_factor+.5;h=vec3(u_brightness_low);i=vec3(u_brightness_high);gl_FragColor=vec4(mix(h,i,f),e.a);}"
                },
                icon: {
                    vertex: "precision mediump float;attribute vec2 a_pos,a_offset;attribute vec4 a_data1,a_data2;uniform highp mat4 u_matrix;uniform mat4 u_exmatrix;uniform float u_zoom,u_fadedist,u_minfadezoom,u_maxfadezoom,u_fadezoom,u_opacity,u_extra;uniform bool u_skewed;uniform vec2 u_texsize;varying vec2 a;varying float b;void main(){vec2 c,e;c=a_data1.xy;float d,f,g,h,i,j;d=a_data1[2];e=a_data2.st;f=e[0];g=e[1];h=10.;i=2.-step(f,u_zoom)-(1.-step(g,u_zoom));j=clamp((u_fadezoom-d)/u_fadedist,0.,1.);if(u_fadedist>=0.)b=j;else b=1.-j;if(u_maxfadezoom<d)b=0.;if(u_minfadezoom>=d)b=1.;i+=step(b,0.);if(u_skewed){vec4 k=u_exmatrix*vec4(a_offset/64.,0,0);gl_Position=u_matrix*vec4(a_pos+k.xy,0,1);gl_Position.z+=i*gl_Position.w;}else{vec4 k=u_exmatrix*vec4(a_offset/64.,i,0);gl_Position=u_matrix*vec4(a_pos,0,1)+k;}a=c/u_texsize;b*=u_opacity;}",
                    fragment: "precision mediump float;uniform sampler2D u_texture;varying vec2 a;varying float b;void main(){gl_FragColor=texture2D(u_texture,a)*b;}"
                },
                sdf: {
                    vertex: "precision mediump float;attribute vec2 a_pos,a_offset;attribute vec4 a_data1,a_data2;uniform highp mat4 u_matrix;uniform mat4 u_exmatrix;uniform float u_zoom,u_fadedist,u_minfadezoom,u_maxfadezoom,u_fadezoom,u_extra;uniform bool u_skewed;uniform vec2 u_texsize;varying vec2 a;varying float b,c;void main(){vec2 d,f;d=a_data1.xy;float e,g,h,i,j,k,l;e=a_data1[2];f=a_data2.st;g=f[0];h=f[1];i=2.-step(g,u_zoom)-(1.-step(h,u_zoom));j=clamp((u_fadezoom-e)/u_fadedist,0.,1.);if(u_fadedist>=0.)b=j;else b=1.-j;if(u_maxfadezoom<e)b=0.;if(u_minfadezoom>=e)b=1.;i+=step(b,0.);if(u_skewed){vec4 k=u_exmatrix*vec4(a_offset/64.,0,0);gl_Position=u_matrix*vec4(a_pos+k.xy,0,1);gl_Position.z+=i*gl_Position.w;}else{vec4 k=u_exmatrix*vec4(a_offset/64.,i,0);gl_Position=u_matrix*vec4(a_pos,0,1)+k;}k=gl_Position.y/gl_Position.w;l=1./(1.-k*u_extra);c=l;a=d/u_texsize;}",
                    fragment: "precision mediump float;uniform sampler2D u_texture;uniform vec4 u_color;uniform float u_buffer,u_gamma;varying vec2 a;varying float b,c;void main(){float d,e,f;d=u_gamma*c;e=texture2D(u_texture,a).a;f=smoothstep(u_buffer-d,u_buffer+d,e)*b;gl_FragColor=u_color*f;}"
                },
                collisionbox: {
                    vertex: "precision mediump float;attribute vec2 a_pos,a_extrude,a_data;uniform mat4 u_matrix;uniform float u_scale;varying float a,b;void main(){gl_Position=u_matrix*vec4(a_pos+a_extrude/u_scale,0,1);a=a_data.x;b=a_data.y;}",
                    fragment: "precision mediump float;uniform float u_zoom,u_maxzoom;varying float a,b;void main(){float c=.5;gl_FragColor=vec4(0,1,0,1)*c;if(b>u_zoom)gl_FragColor=vec4(1,0,0,1)*c;if(u_zoom>=a)gl_FragColor=vec4(0,0,0,1)*c*.25;if(b>=u_maxzoom)gl_FragColor=vec4(0,0,1,1)*c*.2;}"
                }
            };
        }, {}],
        39: [function(require, module, exports) {
            "use strict";

            function GeoJSONSource(i) {
                i = i || {}, this._data = i.data, void 0 !== i.maxzoom && (this.maxzoom = i.maxzoom), this.geojsonVtOptions = {
                    maxZoom: this.maxzoom
                }, void 0 !== i.buffer && (this.geojsonVtOptions.buffer = i.buffer), void 0 !== i.tolerance && (this.geojsonVtOptions.tolerance = i.tolerance), this._pyramid = new TilePyramid({
                    tileSize: 512,
                    minzoom: this.minzoom,
                    maxzoom: this.maxzoom,
                    cacheSize: 20,
                    load: this._loadTile.bind(this),
                    abort: this._abortTile.bind(this),
                    unload: this._unloadTile.bind(this),
                    add: this._addTile.bind(this),
                    remove: this._removeTile.bind(this)
                })
            }
            var util = require("../util/util"),
                Evented = require("../util/evented"),
                TilePyramid = require("./tile_pyramid"),
                Source = require("./source"),
                urlResolve = require("resolve-url");
            module.exports = GeoJSONSource, GeoJSONSource.prototype = util.inherit(Evented, {
                minzoom: 0,
                maxzoom: 14,
                _dirty: !0,
                setData: function(i) {
                    return this._data = i, this._dirty = !0, this.fire("change"), this.map && this.update(this.map.transform), this
                },
                onAdd: function(i) {
                    this.map = i
                },
                loaded: function() {
                    return this._loaded && this._pyramid.loaded()
                },
                update: function(i) {
                    this._dirty && this._updateData(), this._loaded && this._pyramid.update(this.used, i)
                },
                reload: function() {
                    this._loaded && this._pyramid.reload()
                },
                render: Source._renderTiles,
                featuresAt: Source._vectorFeaturesAt,
                featuresIn: Source._vectorFeaturesIn,
                _updateData: function() {
                    this._dirty = !1;
                    var i = this._data;
                    "string" == typeof i && (i = urlResolve(window.location.href, i)), this.workerID = this.dispatcher.send("parse geojson", {
                        data: i,
                        tileSize: 512,
                        source: this.id,
                        geojsonVtOptions: this.geojsonVtOptions
                    }, function(i) {
                        return i ? void this.fire("error", {
                            error: i
                        }) : (this._loaded = !0, this._pyramid.reload(), void this.fire("change"))
                    }.bind(this))
                },
                _loadTile: function(i) {
                    var t = i.coord.z > this.maxzoom ? Math.pow(2, i.coord.z - this.maxzoom) : 1,
                        e = {
                            uid: i.uid,
                            coord: i.coord,
                            zoom: i.coord.z,
                            maxZoom: this.maxzoom,
                            tileSize: 512,
                            source: this.id,
                            overscaling: t,
                            angle: this.map.transform.angle,
                            pitch: this.map.transform.pitch,
                            collisionDebug: this.map.collisionDebug
                        };
                    i.workerID = this.dispatcher.send("load geojson tile", e, function(t, e) {
                        if (i.unloadVectorData(this.map.painter), !i.aborted) {
                            if (t) return void this.fire("tile.error", {
                                tile: i
                            });
                            i.loadVectorData(e), this.fire("tile.load", {
                                tile: i
                            })
                        }
                    }.bind(this), this.workerID)
                },
                _abortTile: function(i) {
                    i.aborted = !0
                },
                _addTile: function(i) {
                    this.fire("tile.add", {
                        tile: i
                    })
                },
                _removeTile: function(i) {
                    this.fire("tile.remove", {
                        tile: i
                    })
                },
                _unloadTile: function(i) {
                    i.unloadVectorData(this.map.painter), this.glyphAtlas.removeGlyphs(i.uid), this.dispatcher.send("remove tile", {
                        uid: i.uid,
                        source: this.id
                    }, null, i.workerID)
                }
            });
        }, {
            "../util/evented": 100,
            "../util/util": 106,
            "./source": 43,
            "./tile_pyramid": 46,
            "resolve-url": 139
        }],
        40: [function(require, module, exports) {
            "use strict";

            function GeoJSONWrapper(e) {
                this.features = e, this.length = e.length
            }

            function FeatureWrapper(e) {
                this.type = e.type, this.rawGeometry = 1 === e.type ? [e.geometry] : e.geometry, this.properties = e.tags, this.extent = 4096
            }
            var Point = require("point-geometry"),
                VectorTileFeature = require("vector-tile").VectorTileFeature;
            module.exports = GeoJSONWrapper, GeoJSONWrapper.prototype.feature = function(e) {
                return new FeatureWrapper(this.features[e])
            }, FeatureWrapper.prototype.loadGeometry = function() {
                var e = this.rawGeometry;
                this.geometry = [];
                for (var t = 0; t < e.length; t++) {
                    for (var r = e[t], o = [], a = 0; a < r.length; a++) o.push(new Point(r[a][0], r[a][1]));
                    this.geometry.push(o)
                }
                return this.geometry
            }, FeatureWrapper.prototype.bbox = function() {
                this.geometry || this.loadGeometry();
                for (var e = this.geometry, t = 1 / 0, r = -(1 / 0), o = 1 / 0, a = -(1 / 0), p = 0; p < e.length; p++)
                    for (var i = e[p], n = 0; n < i.length; n++) {
                        var h = i[n];
                        t = Math.min(t, h.x), r = Math.max(r, h.x), o = Math.min(o, h.y), a = Math.max(a, h.y)
                    }
                return [t, o, r, a]
            }, FeatureWrapper.prototype.toGeoJSON = VectorTileFeature.prototype.toGeoJSON;
        }, {
            "point-geometry": 137,
            "vector-tile": 141
        }],
        41: [function(require, module, exports) {
            "use strict";

            function ImageSource(e) {
                this.coordinates = e.coordinates, ajax.getImage(e.url, function(e, t) {
                    e || (this.image = t, this.image.addEventListener("load", function() {
                        this.map._rerender()
                    }.bind(this)), this._loaded = !0, this.map && (this.createTile(), this.fire("change")))
                }.bind(this))
            }
            var util = require("../util/util"),
                Tile = require("./tile"),
                LngLat = require("../geo/lng_lat"),
                Point = require("point-geometry"),
                Evented = require("../util/evented"),
                ajax = require("../util/ajax");
            module.exports = ImageSource, ImageSource.prototype = util.inherit(Evented, {
                onAdd: function(e) {
                    this.map = e, this.image && this.createTile()
                },
                createTile: function() {
                    var e = this.map,
                        t = this.coordinates.map(function(t) {
                            var i = LngLat.convert(t);
                            return e.transform.locationCoordinate(i).zoomTo(0)
                        }),
                        i = util.getCoordinatesCenter(t),
                        r = 4096,
                        a = t.map(function(e) {
                            var t = e.zoomTo(i.zoom);
                            return new Point(Math.round((t.column - i.column) * r), Math.round((t.row - i.row) * r))
                        }),
                        n = e.painter.gl,
                        o = 32767,
                        u = new Int16Array([a[0].x, a[0].y, 0, 0, a[1].x, a[1].y, o, 0, a[3].x, a[3].y, 0, o, a[2].x, a[2].y, o, o]);
                    this.tile = new Tile, this.tile.buckets = {}, this.tile.boundsBuffer = n.createBuffer(), n.bindBuffer(n.ARRAY_BUFFER, this.tile.boundsBuffer), n.bufferData(n.ARRAY_BUFFER, u, n.STATIC_DRAW), this.center = i
                },
                loaded: function() {
                    return this.image && this.image.complete
                },
                update: function() {},
                render: function(e, t) {
                    if (this._loaded && this.loaded()) {
                        var i = this.center;
                        this.tile.calculateMatrices(i.zoom, i.column, i.row, this.map.transform, t);
                        var r = t.gl;
                        this.tile.texture ? (r.bindTexture(r.TEXTURE_2D, this.tile.texture), r.texSubImage2D(r.TEXTURE_2D, 0, 0, 0, r.RGBA, r.UNSIGNED_BYTE, this.image)) : (this.tile.texture = r.createTexture(), r.bindTexture(r.TEXTURE_2D, this.tile.texture), r.texParameteri(r.TEXTURE_2D, r.TEXTURE_WRAP_S, r.CLAMP_TO_EDGE), r.texParameteri(r.TEXTURE_2D, r.TEXTURE_WRAP_T, r.CLAMP_TO_EDGE), r.texParameteri(r.TEXTURE_2D, r.TEXTURE_MIN_FILTER, r.LINEAR), r.texParameteri(r.TEXTURE_2D, r.TEXTURE_MAG_FILTER, r.LINEAR), r.texImage2D(r.TEXTURE_2D, 0, r.RGBA, r.RGBA, r.UNSIGNED_BYTE, this.image)), t.drawLayers(e, this.tile.posMatrix, this.tile)
                    }
                },
                featuresAt: function(e, t, i) {
                    return i(null, [])
                }
            });
        }, {
            "../geo/lng_lat": 20,
            "../util/ajax": 94,
            "../util/evented": 100,
            "../util/util": 106,
            "./tile": 44,
            "point-geometry": 137
        }],
        42: [function(require, module, exports) {
            "use strict";

            function RasterTileSource(e) {
                util.extend(this, util.pick(e, ["url", "tileSize"])), Source._loadTileJSON.call(this, e)
            }
            var util = require("../util/util"),
                ajax = require("../util/ajax"),
                Evented = require("../util/evented"),
                Source = require("./source"),
                normalizeURL = require("../util/mapbox").normalizeTileURL;
            module.exports = RasterTileSource, RasterTileSource.prototype = util.inherit(Evented, {
                minzoom: 0,
                maxzoom: 22,
                roundZoom: !0,
                tileSize: 512,
                _loaded: !1,
                onAdd: function(e) {
                    this.map = e
                },
                loaded: function() {
                    return this._pyramid && this._pyramid.loaded()
                },
                update: function(e) {
                    this._pyramid && this._pyramid.update(this.used, e, this.map.style.rasterFadeDuration)
                },
                reload: function() {},
                render: Source._renderTiles,
                _loadTile: function(e) {
                    ajax.getImage(normalizeURL(e.coord.url(this.tiles), this.url), function(t, i) {
                        if (!e.aborted) {
                            if (t) return void this.fire("tile.error", {
                                tile: e
                            });
                            var r = this.map.painter.gl;
                            e.texture = this.map.painter.getTexture(i.width), e.texture ? (r.bindTexture(r.TEXTURE_2D, e.texture), r.texSubImage2D(r.TEXTURE_2D, 0, 0, 0, r.RGBA, r.UNSIGNED_BYTE, i)) : (e.texture = r.createTexture(), r.bindTexture(r.TEXTURE_2D, e.texture), r.texParameteri(r.TEXTURE_2D, r.TEXTURE_MIN_FILTER, r.LINEAR_MIPMAP_NEAREST), r.texParameteri(r.TEXTURE_2D, r.TEXTURE_MAG_FILTER, r.LINEAR), r.texParameteri(r.TEXTURE_2D, r.TEXTURE_WRAP_S, r.CLAMP_TO_EDGE), r.texParameteri(r.TEXTURE_2D, r.TEXTURE_WRAP_T, r.CLAMP_TO_EDGE), r.texImage2D(r.TEXTURE_2D, 0, r.RGBA, r.RGBA, r.UNSIGNED_BYTE, i), e.texture.size = i.width), r.generateMipmap(r.TEXTURE_2D), e.timeAdded = (new Date).getTime(), this.map.animationLoop.set(this.style.rasterFadeDuration), e.source = this, e.loaded = !0, this.fire("tile.load", {
                                tile: e
                            })
                        }
                    }.bind(this))
                },
                _abortTile: function(e) {
                    e.aborted = !0
                },
                _addTile: function(e) {
                    this.fire("tile.add", {
                        tile: e
                    })
                },
                _removeTile: function(e) {
                    this.fire("tile.remove", {
                        tile: e
                    })
                },
                _unloadTile: function(e) {
                    e.texture && this.map.painter.saveTexture(e.texture)
                },
                featuresAt: function(e, t, i) {
                    i(null, [])
                },
                featuresIn: function(e, t, i) {
                    i(null, [])
                }
            });
        }, {
            "../util/ajax": 94,
            "../util/evented": 100,
            "../util/mapbox": 103,
            "../util/util": 106,
            "./source": 43
        }],
        43: [function(require, module, exports) {
            "use strict";
            var util = require("../util/util"),
                ajax = require("../util/ajax"),
                browser = require("../util/browser"),
                TilePyramid = require("./tile_pyramid"),
                TileCoord = require("./tile_coord"),
                normalizeURL = require("../util/mapbox").normalizeSourceURL;
            exports._loadTileJSON = function(i) {
                var e = function(i, e) {
                    return i ? void this.fire("error", {
                        error: i
                    }) : (util.extend(this, util.pick(e, ["tiles", "minzoom", "maxzoom", "attribution"])), this._pyramid = new TilePyramid({
                        tileSize: this.tileSize,
                        cacheSize: 20,
                        minzoom: this.minzoom,
                        maxzoom: this.maxzoom,
                        roundZoom: this.roundZoom,
                        reparseOverscaled: this.reparseOverscaled,
                        load: this._loadTile.bind(this),
                        abort: this._abortTile.bind(this),
                        unload: this._unloadTile.bind(this),
                        add: this._addTile.bind(this),
                        remove: this._removeTile.bind(this),
                        redoPlacement: this._redoTilePlacement ? this._redoTilePlacement.bind(this) : void 0
                    }), void this.fire("load"))
                }.bind(this);
                i.url ? ajax.getJSON(normalizeURL(i.url), e) : browser.frame(e.bind(this, null, i))
            }, exports._renderTiles = function(i, e) {
                if (this._pyramid)
                    for (var r = this._pyramid.renderedIDs(), t = 0; t < r.length; t++) {
                        var o = this._pyramid.getTile(r[t]),
                            a = TileCoord.fromID(r[t]),
                            s = a.z,
                            n = a.x,
                            l = a.y,
                            u = a.w;
                        s = Math.min(s, this.maxzoom), n += u * (1 << s), o.calculateMatrices(s, n, l, e.transform, e), e.drawTile(o, i)
                    }
            }, exports._vectorFeaturesAt = function(i, e, r) {
                if (!this._pyramid) return r(null, []);
                var t = this._pyramid.tileAt(i);
                return t ? void this.dispatcher.send("query features", {
                    uid: t.tile.uid,
                    x: t.x,
                    y: t.y,
                    scale: t.scale,
                    source: this.id,
                    params: e
                }, r, t.tile.workerID) : r(null, [])
            }, exports._vectorFeaturesIn = function(i, e, r) {
                if (!this._pyramid) return r(null, []);
                var t = this._pyramid.tilesIn(i);
                return t ? void util.asyncAll(t, function(i, r) {
                    this.dispatcher.send("query features", {
                        uid: i.tile.uid,
                        source: this.id,
                        minX: i.minX,
                        maxX: i.maxX,
                        minY: i.minY,
                        maxY: i.maxY,
                        params: e
                    }, r, i.tile.workerID)
                }.bind(this), function(i, e) {
                    r(i, Array.prototype.concat.apply([], e))
                }) : r(null, [])
            }, exports.create = function(i) {
                var e = {
                    vector: require("./vector_tile_source"),
                    raster: require("./raster_tile_source"),
                    geojson: require("./geojson_source"),
                    video: require("./video_source"),
                    image: require("./image_source")
                };
                for (var r in e)
                    if (i instanceof e[r]) return i;
                return new e[i.type](i)
            };
        }, {
            "../util/ajax": 94,
            "../util/browser": 95,
            "../util/mapbox": 103,
            "../util/util": 106,
            "./geojson_source": 39,
            "./image_source": 41,
            "./raster_tile_source": 42,
            "./tile_coord": 45,
            "./tile_pyramid": 46,
            "./vector_tile_source": 47,
            "./video_source": 48
        }],
        44: [function(require, module, exports) {
            "use strict";

            function Tile(t, e) {
                this.coord = t, this.uid = util.uniqueId(), this.loaded = !1, this.uses = 0, this.tileSize = e
            }
            var glmatrix = require("gl-matrix"),
                mat2 = glmatrix.mat2,
                mat4 = glmatrix.mat4,
                util = require("../util/util"),
                BufferSet = require("../data/buffer/buffer_set");
            module.exports = Tile, Tile.prototype = {
                tileExtent: 4096,
                calculateMatrices: function(t, e, i, r) {
                    var s = Math.pow(2, t),
                        o = r.worldSize / s;
                    this.scale = o, this.posMatrix = new Float64Array(16), mat4.identity(this.posMatrix), mat4.translate(this.posMatrix, this.posMatrix, [e * o, i * o, 0]), mat4.scale(this.posMatrix, this.posMatrix, [o / this.tileExtent, o / this.tileExtent, 1]), mat4.multiply(this.posMatrix, r.getProjMatrix(), this.posMatrix), this.exMatrix = mat4.create(), mat4.ortho(this.exMatrix, 0, r.width, r.height, 0, 0, -1), this.rotationMatrix = mat2.create(), mat2.rotate(this.rotationMatrix, this.rotationMatrix, r.angle), this.posMatrix = new Float32Array(this.posMatrix)
                },
                positionAt: function(t, e) {
                    return t = t.zoomTo(Math.min(this.coord.z, e)), {
                        x: 4096 * (t.column - this.coord.x),
                        y: 4096 * (t.row - this.coord.y),
                        scale: this.scale
                    }
                },
                loadVectorData: function(t) {
                    this.loaded = !0, t && (this.buffers = new BufferSet(t.buffers), this.elementGroups = t.elementGroups, this.tileExtent = t.extent)
                },
                reloadSymbolData: function(t, e) {
                    if (this.buffers) {
                        this.buffers.glyphVertex.destroy(e.gl), this.buffers.glyphElement.destroy(e.gl), this.buffers.iconVertex.destroy(e.gl), this.buffers.iconElement.destroy(e.gl), this.buffers.collisionBoxVertex.destroy(e.gl);
                        var i = new BufferSet(t.buffers);
                        this.buffers.glyphVertex = i.glyphVertex, this.buffers.glyphElement = i.glyphElement, this.buffers.iconVertex = i.iconVertex, this.buffers.iconElement = i.iconElement, this.buffers.collisionBoxVertex = i.collisionBoxVertex;
                        for (var r in t.elementGroups) this.elementGroups[r] = t.elementGroups[r]
                    }
                },
                unloadVectorData: function(t) {
                    for (var e in this.buffers) this.buffers[e].destroy(t.gl);
                    this.buffers = null
                }
            };
        }, {
            "../data/buffer/buffer_set": 2,
            "../util/util": 106,
            "gl-matrix": 119
        }],
        45: [function(require, module, exports) {
            "use strict";

            function TileCoord(t, i, o, r) {
                void 0 === r && (r = 0), this.z = t, this.x = i, this.y = o, this.w = r, r *= 2, 0 > r && (r = -1 * r - 1);
                var e = 1 << this.z;
                this.id = 32 * (e * e * r + e * this.y + this.x) + this.z
            }

            function edge(t, i) {
                if (t.row > i.row) {
                    var o = t;
                    t = i, i = o
                }
                return {
                    x0: t.column,
                    y0: t.row,
                    x1: i.column,
                    y1: i.row,
                    dx: i.column - t.column,
                    dy: i.row - t.row
                }
            }

            function scanSpans(t, i, o, r, e) {
                var n = Math.max(o, Math.floor(i.y0)),
                    h = Math.min(r, Math.ceil(i.y1));
                if (t.x0 === i.x0 && t.y0 === i.y0 ? t.x0 + i.dy / t.dy * t.dx < i.x1 : t.x1 - i.dy / t.dy * t.dx < i.x0) {
                    var s = t;
                    t = i, i = s
                }
                for (var d = t.dx / t.dy, a = i.dx / i.dy, l = t.dx > 0, y = i.dx < 0, x = n; h > x; x++) {
                    var c = d * Math.max(0, Math.min(t.dy, x + l - t.y0)) + t.x0,
                        u = a * Math.max(0, Math.min(i.dy, x + y - i.y0)) + i.x0;
                    e(Math.floor(u), Math.ceil(c), x)
                }
            }

            function scanTriangle(t, i, o, r, e, n) {
                var h, s = edge(t, i),
                    d = edge(i, o),
                    a = edge(o, t);
                s.dy > d.dy && (h = s, s = d, d = h), s.dy > a.dy && (h = s, s = a, a = h), d.dy > a.dy && (h = d, d = a, a = h), s.dy && scanSpans(a, s, r, e, n), d.dy && scanSpans(a, d, r, e, n)
            }
            module.exports = TileCoord, TileCoord.prototype.toString = function() {
                return this.z + "/" + this.x + "/" + this.y
            }, TileCoord.fromID = function(t) {
                var i = t % 32,
                    o = 1 << i,
                    r = (t - i) / 32,
                    e = r % o,
                    n = (r - e) / o % o,
                    h = Math.floor(r / (o * o));
                return h % 2 !== 0 && (h = -1 * h - 1), h /= 2, new TileCoord(i, e, n, h)
            }, TileCoord.prototype.url = function(t, i) {
                return t[(this.x + this.y) % t.length].replace("{prefix}", (this.x % 16).toString(16) + (this.y % 16).toString(16)).replace("{z}", Math.min(this.z, i || this.z)).replace("{x}", this.x).replace("{y}", this.y)
            }, TileCoord.prototype.parent = function(t) {
                return 0 === this.z ? null : this.z > t ? new TileCoord(this.z - 1, this.x, this.y, this.w) : new TileCoord(this.z - 1, Math.floor(this.x / 2), Math.floor(this.y / 2), this.w)
            }, TileCoord.prototype.wrapped = function() {
                return new TileCoord(this.z, this.x, this.y, 0)
            }, TileCoord.prototype.children = function(t) {
                if (this.z >= t) return [new TileCoord(this.z + 1, this.x, this.y, this.w)];
                var i = this.z + 1,
                    o = 2 * this.x,
                    r = 2 * this.y;
                return [new TileCoord(i, o, r, this.w), new TileCoord(i, o + 1, r, this.w), new TileCoord(i, o, r + 1, this.w), new TileCoord(i, o + 1, r + 1, this.w)]
            }, TileCoord.cover = function(t, i, o) {
                function r(t, i, r) {
                    var h, s;
                    if (r >= 0 && e >= r)
                        for (h = t; i > h; h++) {
                            s = (h + e) % e;
                            var d = new TileCoord(o, s, r, Math.floor(h / e));
                            n[d.id] = d
                        }
                }
                var e = 1 << t,
                    n = {};
                return scanTriangle(i[0], i[1], i[2], 0, e, r), scanTriangle(i[2], i[3], i[0], 0, e, r), Object.keys(n).map(function(t) {
                    return n[t]
                })
            };
        }, {}],
        46: [function(require, module, exports) {
            "use strict";

            function TilePyramid(i) {
                this.tileSize = i.tileSize, this.minzoom = i.minzoom, this.maxzoom = i.maxzoom, this.roundZoom = i.roundZoom, this.reparseOverscaled = i.reparseOverscaled, this._load = i.load, this._abort = i.abort, this._unload = i.unload, this._add = i.add, this._remove = i.remove, this._redoPlacement = i.redoPlacement, this._tiles = {}, this._cache = new Cache(i.cacheSize, function(i) {
                    return this._unload(i)
                }.bind(this))
            }
            var Tile = require("./tile"),
                TileCoord = require("./tile_coord"),
                Point = require("point-geometry"),
                Cache = require("../util/mru_cache"),
                util = require("../util/util");
            module.exports = TilePyramid, TilePyramid.prototype = {
                loaded: function() {
                    for (var i in this._tiles)
                        if (!this._tiles[i].loaded) return !1;
                    return !0
                },
                orderedIDs: function() {
                    return Object.keys(this._tiles).sort(function(i, e) {
                        return e % 32 - i % 32
                    }).map(function(i) {
                        return +i
                    })
                },
                renderedIDs: function() {
                    return this.orderedIDs().filter(function(i) {
                        return this._tiles[i].loaded && !this._coveredTiles[i]
                    }.bind(this))
                },
                reload: function() {
                    this._cache.reset();
                    for (var i in this._tiles) this._load(this._tiles[i])
                },
                getTile: function(i) {
                    return this._tiles[i]
                },
                getZoom: function(i) {
                    return i.zoom + Math.log(i.tileSize / this.tileSize) / Math.LN2
                },
                coveringZoomLevel: function(i) {
                    return (this.roundZoom ? Math.round : Math.floor)(this.getZoom(i))
                },
                coveringTiles: function(i) {
                    var e = this.coveringZoomLevel(i),
                        t = e;
                    if (e < this.minzoom) return [];
                    e > this.maxzoom && (e = this.maxzoom);
                    var o = i,
                        r = o.locationCoordinate(o.center)._zoomTo(e),
                        n = new Point(r.column - .5, r.row - .5);
                    return TileCoord.cover(e, [o.pointCoordinate(new Point(0, 0))._zoomTo(e), o.pointCoordinate(new Point(o.width, 0))._zoomTo(e), o.pointCoordinate(new Point(o.width, o.height))._zoomTo(e), o.pointCoordinate(new Point(0, o.height))._zoomTo(e)], this.reparseOverscaled ? t : e).sort(function(i, e) {
                        return n.dist(i) - n.dist(e)
                    })
                },
                findLoadedChildren: function(i, e, t) {
                    for (var o = !0, r = i.z, n = i.children(this.maxzoom), s = 0; s < n.length; s++) {
                        var d = n[s].id;
                        this._tiles[d] && this._tiles[d].loaded ? t[d] = !0 : (o = !1, e > r && this.findLoadedChildren(n[s], e, t))
                    }
                    return o
                },
                findLoadedParent: function(i, e, t) {
                    for (var o = i.z - 1; o >= e; o--) {
                        i = i.parent(this.maxzoom);
                        var r = this._tiles[i.id];
                        if (r && r.loaded) return t[i.id] = !0, r
                    }
                },
                update: function(i, e, t) {
                    var o, r, n, s = (this.roundZoom ? Math.round : Math.floor)(this.getZoom(e)),
                        d = util.clamp(s - 10, this.minzoom, this.maxzoom),
                        a = util.clamp(s + 1, this.minzoom, this.maxzoom),
                        h = {},
                        l = (new Date).getTime();
                    this._coveredTiles = {};
                    var m = i ? this.coveringTiles(e) : [];
                    for (o = 0; o < m.length; o++) r = m[o], n = this.addTile(r), h[r.id] = !0, n.loaded || this.findLoadedChildren(r, a, h) || this.findLoadedParent(r, d, h);
                    for (var u in h) r = TileCoord.fromID(u), n = this._tiles[u], n && n.timeAdded > l - (t || 0) && (this.findLoadedChildren(r, a, h) ? (this._coveredTiles[u] = !0, h[u] = !0) : this.findLoadedParent(r, d, h));
                    var c = util.keysDifference(this._tiles, h);
                    for (o = 0; o < c.length; o++) this.removeTile(+c[o])
                },
                addTile: function(i) {
                    var e = this._tiles[i.id];
                    if (e) return e;
                    var t = i.wrapped();
                    if (e = this._tiles[t.id], e || (e = this._cache.get(t.id), e && this._redoPlacement && this._redoPlacement(e)), !e) {
                        var o = i.z,
                            r = o > this.maxzoom ? Math.pow(2, o - this.maxzoom) : 1;
                        e = new Tile(t, this.tileSize * r), this._load(e)
                    }
                    return e.uses++, this._tiles[i.id] = e, this._add(e, i), e
                },
                removeTile: function(i) {
                    var e = this._tiles[i];
                    e && (e.uses--, delete this._tiles[i], this._remove(e), e.uses > 0 || (e.loaded ? this._cache.add(e.coord.wrapped().id, e) : (this._abort(e), this._unload(e))))
                },
                clearTiles: function() {
                    for (var i in this._tiles) this.removeTile(i);
                    this._cache.reset()
                },
                tileAt: function(i) {
                    for (var e = this.orderedIDs(), t = 0; t < e.length; t++) {
                        var o = this._tiles[e[t]],
                            r = o.positionAt(i, this.maxzoom);
                        if (r && r.x >= 0 && r.x < 4096 && r.y >= 0 && r.y < 4096) return {
                            tile: o,
                            x: r.x,
                            y: r.y,
                            scale: r.scale
                        }
                    }
                },
                tilesIn: function(i) {
                    for (var e = [], t = this.orderedIDs(), o = 0; o < t.length; o++) {
                        var r = this._tiles[t[o]],
                            n = [r.positionAt(i[0], this.maxzoom), r.positionAt(i[1], this.maxzoom)];
                        n[0].x < 4096 && n[0].y < 4096 && n[1].x >= 0 && n[1].y >= 0 && e.push({
                            tile: r,
                            minX: n[0].x,
                            maxX: n[1].x,
                            minY: n[0].y,
                            maxY: n[1].y
                        })
                    }
                    return e
                }
            };
        }, {
            "../util/mru_cache": 104,
            "../util/util": 106,
            "./tile": 44,
            "./tile_coord": 45,
            "point-geometry": 137
        }],
        47: [function(require, module, exports) {
            "use strict";

            function VectorTileSource(e) {
                if (util.extend(this, util.pick(e, ["url", "tileSize"])), 512 !== this.tileSize) throw new Error("vector tile sources must have a tileSize of 512");
                Source._loadTileJSON.call(this, e)
            }
            var util = require("../util/util"),
                Evented = require("../util/evented"),
                Source = require("./source");
            module.exports = VectorTileSource, VectorTileSource.prototype = util.inherit(Evented, {
                minzoom: 0,
                maxzoom: 22,
                tileSize: 512,
                reparseOverscaled: !0,
                _loaded: !1,
                onAdd: function(e) {
                    this.map = e
                },
                loaded: function() {
                    return this._pyramid && this._pyramid.loaded()
                },
                update: function(e) {
                    this._pyramid && this._pyramid.update(this.used, e)
                },
                reload: function() {
                    this._pyramid && this._pyramid.reload()
                },
                redoPlacement: function() {
                    if (this._pyramid)
                        for (var e = this._pyramid.orderedIDs(), i = 0; i < e.length; i++) {
                            var t = this._pyramid.getTile(e[i]);
                            this._redoTilePlacement(t)
                        }
                },
                render: Source._renderTiles,
                featuresAt: Source._vectorFeaturesAt,
                featuresIn: Source._vectorFeaturesIn,
                _loadTile: function(e) {
                    var i = e.coord.z > this.maxzoom ? Math.pow(2, e.coord.z - this.maxzoom) : 1,
                        t = {
                            url: e.coord.url(this.tiles, this.maxzoom),
                            uid: e.uid,
                            coord: e.coord,
                            zoom: e.coord.z,
                            maxZoom: this.maxzoom,
                            tileSize: this.tileSize * i,
                            source: this.id,
                            overscaling: i,
                            angle: this.map.transform.angle,
                            pitch: this.map.transform.pitch,
                            collisionDebug: this.map.collisionDebug
                        };
                    e.workerID ? this.dispatcher.send("reload tile", t, this._tileLoaded.bind(this, e), e.workerID) : e.workerID = this.dispatcher.send("load tile", t, this._tileLoaded.bind(this, e))
                },
                _tileLoaded: function(e, i, t) {
                    if (!e.aborted) {
                        if (i) return void this.fire("tile.error", {
                            tile: e
                        });
                        e.loadVectorData(t), e.redoWhenDone && (e.redoWhenDone = !1, this._redoTilePlacement(e)), this.fire("tile.load", {
                            tile: e
                        })
                    }
                },
                _abortTile: function(e) {
                    e.aborted = !0, this.dispatcher.send("abort tile", {
                        uid: e.uid,
                        source: this.id
                    }, null, e.workerID)
                },
                _addTile: function(e) {
                    this.fire("tile.add", {
                        tile: e
                    })
                },
                _removeTile: function(e) {
                    this.fire("tile.remove", {
                        tile: e
                    })
                },
                _unloadTile: function(e) {
                    e.unloadVectorData(this.map.painter), this.glyphAtlas.removeGlyphs(e.uid), this.dispatcher.send("remove tile", {
                        uid: e.uid,
                        source: this.id
                    }, null, e.workerID)
                },
                _redoTilePlacement: function(e) {
                    function i(i, t) {
                        e.reloadSymbolData(t, this.map.painter), this.fire("tile.load", {
                            tile: e
                        }), e.redoingPlacement = !1, e.redoWhenDone && (this._redoTilePlacement(e), e.redoWhenDone = !1)
                    }
                    return !e.loaded || e.redoingPlacement ? void(e.redoWhenDone = !0) : (e.redoingPlacement = !0, void this.dispatcher.send("redo placement", {
                        uid: e.uid,
                        source: this.id,
                        angle: this.map.transform.angle,
                        pitch: this.map.transform.pitch,
                        collisionDebug: this.map.collisionDebug
                    }, i.bind(this), e.workerID))
                }
            });
        }, {
            "../util/evented": 100,
            "../util/util": 106,
            "./source": 43
        }],
        48: [function(require, module, exports) {
            "use strict";

            function VideoSource(e) {
                this.coordinates = e.coordinates, ajax.getVideo(e.urls, function(e, t) {
                    if (!e) {
                        this.video = t, this.video.loop = !0;
                        var i;
                        this.video.addEventListener("playing", function() {
                            i = this.map.style.animationLoop.set(1 / 0), this.map._rerender()
                        }.bind(this)), this.video.addEventListener("pause", function() {
                            this.map.style.animationLoop.cancel(i)
                        }.bind(this)), this._loaded = !0, this.map && (this.video.play(), this.createTile(), this.fire("change"))
                    }
                }.bind(this))
            }
            var util = require("../util/util"),
                Tile = require("./tile"),
                LngLat = require("../geo/lng_lat"),
                Point = require("point-geometry"),
                Evented = require("../util/evented"),
                ajax = require("../util/ajax");
            module.exports = VideoSource, VideoSource.prototype = util.inherit(Evented, {
                roundZoom: !0,
                getVideo: function() {
                    return this.video
                },
                onAdd: function(e) {
                    this.map = e, this.video && (this.video.play(), this.createTile())
                },
                createTile: function() {
                    var e = this.map,
                        t = this.coordinates.map(function(t) {
                            var i = LngLat.convert(t);
                            return e.transform.locationCoordinate(i).zoomTo(0)
                        }),
                        i = util.getCoordinatesCenter(t),
                        r = 4096,
                        o = t.map(function(e) {
                            var t = e.zoomTo(i.zoom);
                            return new Point(Math.round((t.column - i.column) * r), Math.round((t.row - i.row) * r))
                        }),
                        n = e.painter.gl,
                        a = 32767,
                        u = new Int16Array([o[0].x, o[0].y, 0, 0, o[1].x, o[1].y, a, 0, o[3].x, o[3].y, 0, a, o[2].x, o[2].y, a, a]);
                    this.tile = new Tile, this.tile.buckets = {}, this.tile.boundsBuffer = n.createBuffer(), n.bindBuffer(n.ARRAY_BUFFER, this.tile.boundsBuffer), n.bufferData(n.ARRAY_BUFFER, u, n.STATIC_DRAW), this.center = i
                },
                loaded: function() {
                    return this.video && this.video.readyState >= 2
                },
                update: function() {},
                reload: function() {},
                render: function(e, t) {
                    if (this._loaded && !(this.video.readyState < 2)) {
                        var i = this.center;
                        this.tile.calculateMatrices(i.zoom, i.column, i.row, this.map.transform, t);
                        var r = t.gl;
                        this.tile.texture ? (r.bindTexture(r.TEXTURE_2D, this.tile.texture), r.texSubImage2D(r.TEXTURE_2D, 0, 0, 0, r.RGBA, r.UNSIGNED_BYTE, this.video)) : (this.tile.texture = r.createTexture(), r.bindTexture(r.TEXTURE_2D, this.tile.texture), r.texParameteri(r.TEXTURE_2D, r.TEXTURE_WRAP_S, r.CLAMP_TO_EDGE), r.texParameteri(r.TEXTURE_2D, r.TEXTURE_WRAP_T, r.CLAMP_TO_EDGE), r.texParameteri(r.TEXTURE_2D, r.TEXTURE_MIN_FILTER, r.LINEAR), r.texParameteri(r.TEXTURE_2D, r.TEXTURE_MAG_FILTER, r.LINEAR), r.texImage2D(r.TEXTURE_2D, 0, r.RGBA, r.RGBA, r.UNSIGNED_BYTE, this.video)), t.drawLayers(e, this.tile.posMatrix, this.tile)
                    }
                },
                featuresAt: function(e, t, i) {
                    return i(null, [])
                },
                featuresIn: function(e, t, i) {
                    return i(null, [])
                }
            });
        }, {
            "../geo/lng_lat": 20,
            "../util/ajax": 94,
            "../util/evented": 100,
            "../util/util": 106,
            "./tile": 44,
            "point-geometry": 137
        }],
        49: [function(require, module, exports) {
            "use strict";

            function Worker(e) {
                this.self = e, this.actor = new Actor(e, this), this.loading = {}, this.loaded = {}, this.layers = [], this.geoJSONIndexes = {}
            }
            var Actor = require("../util/actor"),
                WorkerTile = require("./worker_tile"),
                util = require("../util/util"),
                ajax = require("../util/ajax"),
                vt = require("vector-tile"),
                Protobuf = require("pbf"),
                geojsonvt = require("geojson-vt"),
                GeoJSONWrapper = require("./geojson_wrapper");
            module.exports = function(e) {
                return new Worker(e)
            }, util.extend(Worker.prototype, {
                "set layers": function(e) {
                    this.layers = e
                },
                "load tile": function(e, r) {
                    function t(e, t) {
                        return delete this.loading[i][o], e ? r(e) : (a.data = new vt.VectorTile(new Protobuf(new Uint8Array(t))), a.parse(a.data, this.layers, this.actor, r), this.loaded[i] = this.loaded[i] || {}, void(this.loaded[i][o] = a))
                    }
                    var i = e.source,
                        o = e.uid;
                    this.loading[i] || (this.loading[i] = {});
                    var a = this.loading[i][o] = new WorkerTile(e);
                    a.xhr = ajax.getArrayBuffer(e.url, t.bind(this))
                },
                "reload tile": function(e, r) {
                    var t = this.loaded[e.source],
                        i = e.uid;
                    if (t && t[i]) {
                        var o = t[i];
                        o.parse(o.data, this.layers, this.actor, r)
                    }
                },
                "abort tile": function(e) {
                    var r = this.loading[e.source],
                        t = e.uid;
                    r && r[t] && (r[t].xhr.abort(), delete r[t])
                },
                "remove tile": function(e) {
                    var r = this.loaded[e.source],
                        t = e.uid;
                    r && r[t] && delete r[t]
                },
                "redo placement": function(e, r) {
                    var t = this.loaded[e.source],
                        i = this.loading[e.source],
                        o = e.uid;
                    if (t && t[o]) {
                        var a = t[o],
                            s = a.redoPlacement(e.angle, e.pitch, e.collisionDebug);
                        s.result && r(null, s.result, s.transferables)
                    } else i && i[o] && (i[o].angle = e.angle)
                },
                "parse geojson": function(e, r) {
                    var t = function(t, i) {
                        return t ? r(t) : (this.geoJSONIndexes[e.source] = geojsonvt(i, e.geojsonVtOptions), void r(null))
                    }.bind(this);
                    "string" == typeof e.data ? ajax.getJSON(e.data, t) : t(null, e.data)
                },
                "load geojson tile": function(e, r) {
                    var t = e.source,
                        i = e.coord,
                        o = this.geoJSONIndexes[t].getTile(i.z, i.x, i.y);
                    if (!o) return r(null, null);
                    var a = new WorkerTile(e);
                    a.parse(new GeoJSONWrapper(o.features), this.layers, this.actor, r), this.loaded[t] = this.loaded[t] || {}, this.loaded[t][e.uid] = a
                },
                "query features": function(e, r) {
                    var t = this.loaded[e.source] && this.loaded[e.source][e.uid];
                    t ? t.featureTree.query(e, r) : r(null, [])
                }
            });
        }, {
            "../util/actor": 93,
            "../util/ajax": 94,
            "../util/util": 106,
            "./geojson_wrapper": 40,
            "./worker_tile": 50,
            "geojson-vt": 115,
            "pbf": 135,
            "vector-tile": 141
        }],
        50: [function(require, module, exports) {
            "use strict";

            function WorkerTile(e) {
                this.coord = e.coord, this.uid = e.uid, this.zoom = e.zoom, this.maxZoom = e.maxZoom, this.tileSize = e.tileSize, this.source = e.source, this.overscaling = e.overscaling, this.angle = e.angle, this.pitch = e.pitch, this.collisionDebug = e.collisionDebug, this.stacks = {}
            }
            var FeatureTree = require("../data/feature_tree"),
                CollisionTile = require("../symbol/collision_tile"),
                BufferSet = require("../data/buffer/buffer_set"),
                createBucket = require("../data/create_bucket");
            module.exports = WorkerTile, WorkerTile.prototype.parse = function(e, t, r, i) {
                function s(e, t) {
                    for (var r = 0; r < e.length; r++) {
                        var i = e.feature(r);
                        for (var s in t) {
                            var o = t[s];
                            o.filter(i) && o.features.push(i)
                        }
                    }
                }

                function o(e) {
                    return function(t) {
                        e.dependenciesLoaded = !0, n(h, e, t)
                    }
                }

                function n(e, t, r) {
                    if (!(t.getDependencies && !t.dependenciesLoaded || t.needsPlacement && !t.previousPlaced)) {
                        if (!r) {
                            var i = Date.now();
                            t.features.length && t.addFeatures(p);
                            var s = Date.now() - i;
                            if (t.interactive)
                                for (var o = 0; o < t.features.length; o++) {
                                    var l = t.features[o];
                                    e.featureTree.insert(l.bbox(), t.layers, l)
                                }
                            "undefined" != typeof self && (self.bucketStats = self.bucketStats || {
                                _total: 0
                            }, self.bucketStats._total += s, self.bucketStats[t.id] = (self.bucketStats[t.id] || 0) + s)
                        }
                        return P--, P ? void(t.next && (t.next.previousPlaced = !0, n(e, t.next))) : void a()
                    }
                }

                function a() {
                    if (h.status = "done", h.redoPlacementAfterDone) {
                        var e = h.redoPlacement(h.angle, h.pitch).result;
                        d.glyphVertex = e.buffers.glyphVertex, d.iconVertex = e.buffers.iconVertex, d.collisionBoxVertex = e.buffers.collisionBoxVertex
                    }
                    var t = [],
                        r = {};
                    for (u in d) t.push(d[u].array);
                    for (u in v) r[u] = v[u].elementGroups;
                    i(null, {
                        elementGroups: r,
                        buffers: d,
                        extent: D
                    }, t)
                }
                this.status = "parsing", this.featureTree = new FeatureTree(this.coord, this.overscaling);
                var l, u, f, c, h = this,
                    d = new BufferSet,
                    p = new CollisionTile(this.angle, this.pitch),
                    v = {},
                    m = this.bucketsInOrder = [],
                    g = {};
                for (l = 0; l < t.length; l++)
                    if (f = t[l], f.source === this.source && !f.ref) {
                        var b = f.minzoom;
                        if (!(b && this.zoom < b && b < this.maxZoom)) {
                            var x = f.maxzoom;
                            if (!(x && this.zoom >= x)) {
                                var y = f.layout.visibility;
                                if ("none" !== y)
                                    if (c = createBucket(f, d, this.zoom, this.overscaling, this.collisionDebug), c.layers = [f.id], v[c.id] = c, m.push(c), e.layers) {
                                        var k = f["source-layer"];
                                        g[k] || (g[k] = {}), g[k][c.id] = c
                                    } else g[c.id] = c
                            }
                        }
                    }
                for (l = 0; l < t.length; l++) f = t[l], f.source === this.source && f.ref && (c = v[f.ref], c && c.layers.push(f.id));
                var D = 4096;
                if (e.layers)
                    for (u in g) f = e.layers[u], f && (f.extent && (D = f.extent), s(f, g[u]));
                else s(e, g);
                var T, P = m.length;
                for (l = m.length - 1; l >= 0; l--) c = m[l], c.needsPlacement && (T ? T.next = c : c.previousPlaced = !0, T = c), c.getDependencies && c.getDependencies(this, r, o(c)), c.needsPlacement || c.getDependencies || n(h, c)
            }, WorkerTile.prototype.redoPlacement = function(e, t, r) {
                if ("done" !== this.status) return this.redoPlacementAfterDone = !0, this.angle = e, {};
                for (var i = new BufferSet, s = [], o = {}, n = new CollisionTile(e, t), a = this.bucketsInOrder, l = a.length - 1; l >= 0; l--) {
                    var u = a[l];
                    "symbol" === u.type && (u.placeFeatures(n, i, r), o[u.id] = u.elementGroups)
                }
                for (var f in i) s.push(i[f].array);
                return {
                    result: {
                        elementGroups: o,
                        buffers: i
                    },
                    transferables: s
                }
            };
        }, {
            "../data/buffer/buffer_set": 2,
            "../data/create_bucket": 13,
            "../data/feature_tree": 15,
            "../symbol/collision_tile": 68
        }],
        51: [function(require, module, exports) {
            "use strict";

            function AnimationLoop() {
                this.n = 0, this.times = []
            }
            module.exports = AnimationLoop, AnimationLoop.prototype.stopped = function() {
                return this.times = this.times.filter(function(t) {
                    return t.time >= (new Date).getTime()
                }), !this.times.length
            }, AnimationLoop.prototype.set = function(t) {
                return this.times.push({
                    id: this.n,
                    time: t + (new Date).getTime()
                }), this.n++
            }, AnimationLoop.prototype.cancel = function(t) {
                this.times = this.times.filter(function(i) {
                    return i.id !== t
                })
            };
        }, {}],
        52: [function(require, module, exports) {
            "use strict";

            function ImageSprite(t) {
                this.base = t, this.retina = browser.devicePixelRatio > 1;
                var i = this.retina ? "@2x" : "";
                ajax.getJSON(normalizeURL(t, i, ".json"), function(t, i) {
                    return t ? void this.fire("error", {
                        error: t
                    }) : (this.data = i, void(this.img && this.fire("load")))
                }.bind(this)), ajax.getImage(normalizeURL(t, i, ".png"), function(t, i) {
                    if (t) return void this.fire("error", {
                        error: t
                    });
                    for (var e = i.getData(), r = i.data = new Uint8Array(e.length), a = 0; a < e.length; a += 4) {
                        var o = e[a + 3] / 255;
                        r[a + 0] = e[a + 0] * o, r[a + 1] = e[a + 1] * o, r[a + 2] = e[a + 2] * o, r[a + 3] = e[a + 3]
                    }
                    this.img = i, this.data && this.fire("load")
                }.bind(this))
            }

            function SpritePosition() {}
            var Evented = require("../util/evented"),
                ajax = require("../util/ajax"),
                browser = require("../util/browser"),
                normalizeURL = require("../util/mapbox").normalizeSpriteURL;
            module.exports = ImageSprite, ImageSprite.prototype = Object.create(Evented), ImageSprite.prototype.toJSON = function() {
                return this.base
            }, ImageSprite.prototype.loaded = function() {
                return !(!this.data || !this.img)
            }, ImageSprite.prototype.resize = function() {
                if (browser.devicePixelRatio > 1 !== this.retina) {
                    var t = new ImageSprite(this.base);
                    t.on("load", function() {
                        this.img = t.img, this.data = t.data, this.retina = t.retina
                    }.bind(this))
                }
            }, SpritePosition.prototype = {
                x: 0,
                y: 0,
                width: 0,
                height: 0,
                pixelRatio: 1,
                sdf: !1
            }, ImageSprite.prototype.getSpritePosition = function(t) {
                if (!this.loaded()) return new SpritePosition;
                var i = this.data && this.data[t];
                return i && this.img ? i : new SpritePosition
            };
        }, {
            "../util/ajax": 94,
            "../util/browser": 95,
            "../util/evented": 100,
            "../util/mapbox": 103
        }],
        53: [function(require, module, exports) {
            "use strict";
            var reference = require("./reference");
            module.exports = {}, reference.layout.forEach(function(e) {
                var r = function(e) {
                        for (var r in e) this[r] = e[r]
                    },
                    o = reference[e];
                for (var t in o) void 0 !== o[t]["default"] && (r.prototype[t] = o[t]["default"]);
                module.exports[e.replace("layout_", "")] = r
            });
        }, {
            "./reference": 55
        }],
        54: [function(require, module, exports) {
            "use strict";
            var reference = require("./reference"),
                parseCSSColor = require("csscolorparser").parseCSSColor;
            module.exports = {}, reference.paint.forEach(function(e) {
                var r = function() {},
                    o = reference[e];
                for (var p in o) {
                    var t = o[p],
                        a = t["default"];
                    void 0 !== a && ("color" === t.type && (a = parseCSSColor(a)), r.prototype[p] = a)
                }
                r.prototype.hidden = !1, module.exports[e.replace("paint_", "")] = r
            });
        }, {
            "./reference": 55,
            "csscolorparser": 111
        }],
        55: [function(require, module, exports) {
            module.exports = require("mapbox-gl-style-spec/reference/latest");
        }, {
            "mapbox-gl-style-spec/reference/latest": 132
        }],
        56: [function(require, module, exports) {
            "use strict";

            function Style(e, t) {
                this.animationLoop = t || new AnimationLoop, this.dispatcher = new Dispatcher(Math.max(browser.hardwareConcurrency - 1, 1), this), this.glyphAtlas = new GlyphAtlas(1024, 1024), this.spriteAtlas = new SpriteAtlas(512, 512), this.spriteAtlas.resize(browser.devicePixelRatio), this.lineAtlas = new LineAtlas(256, 512), this._layers = {}, this._order = [], this._groups = [], this.sources = {}, this.zoomHistory = {}, util.bindAll(["_forwardSourceEvent", "_forwardTileEvent", "_redoPlacement"], this);
                var r = function(e, t) {
                    if (e) return void this.fire("error", {
                        error: e
                    });
                    var r = validate(t);
                    if (r.length)
                        for (var i = 0; i < r.length; i++) this.fire("error", {
                            error: new Error(r[i].message)
                        });
                    else {
                        this._loaded = !0, this.stylesheet = t;
                        var s = t.sources;
                        for (var o in s) this.addSource(o, s[o]);
                        t.sprite && (this.sprite = new ImageSprite(t.sprite), this.sprite.on("load", this.fire.bind(this, "change"))), this.glyphSource = new GlyphSource(t.glyphs, this.glyphAtlas), this._resolve(), this.fire("load")
                    }
                }.bind(this);
                "string" == typeof e ? ajax.getJSON(normalizeURL(e), r) : browser.frame(r.bind(this, null, e))
            }
            var Evented = require("../util/evented"),
                styleBatch = require("./style_batch"),
                StyleLayer = require("./style_layer"),
                ImageSprite = require("./image_sprite"),
                GlyphSource = require("../symbol/glyph_source"),
                GlyphAtlas = require("../symbol/glyph_atlas"),
                SpriteAtlas = require("../symbol/sprite_atlas"),
                LineAtlas = require("../render/line_atlas"),
                util = require("../util/util"),
                ajax = require("../util/ajax"),
                normalizeURL = require("../util/mapbox").normalizeStyleURL,
                browser = require("../util/browser"),
                Dispatcher = require("../util/dispatcher"),
                AnimationLoop = require("./animation_loop"),
                validate = require("mapbox-gl-style-spec/lib/validate/latest");
            module.exports = Style, Style.prototype = util.inherit(Evented, {
                _loaded: !1,
                loaded: function() {
                    if (!this._loaded) return !1;
                    for (var e in this.sources)
                        if (!this.sources[e].loaded()) return !1;
                    return this.sprite && !this.sprite.loaded() ? !1 : !0
                },
                _resolve: function() {
                    var e, t;
                    this._layers = {}, this._order = [];
                    for (var r = 0; r < this.stylesheet.layers.length; r++) t = new StyleLayer(this.stylesheet.layers[r]), this._layers[t.id] = t, this._order.push(t.id);
                    for (e in this._layers) this._layers[e].resolveLayout();
                    for (e in this._layers) this._layers[e].resolveReference(this._layers), this._layers[e].resolvePaint();
                    this._groupLayers(), this._broadcastLayers()
                },
                _groupLayers: function() {
                    var e;
                    this._groups = [];
                    for (var t = 0; t < this._order.length; ++t) {
                        var r = this._layers[this._order[t]];
                        e && r.source === e.source || (e = [], e.source = r.source, this._groups.push(e)), e.push(r)
                    }
                },
                _broadcastLayers: function() {
                    var e = [];
                    for (var t in this._layers) e.push(this._layers[t].json());
                    this.dispatcher.broadcast("set layers", e)
                },
                _cascade: function(e, t) {
                    if (this._loaded) {
                        t = t || {
                            transition: !0
                        };
                        for (var r in this._layers) this._layers[r].cascade(e, t, this.stylesheet.transition || {}, this.animationLoop);
                        this.fire("change")
                    }
                },
                _recalculate: function(e) {
                    for (var t in this.sources) this.sources[t].used = !1;
                    this._updateZoomHistory(e), this.rasterFadeDuration = 300;
                    for (t in this._layers) {
                        var r = this._layers[t];
                        r.recalculate(e, this.zoomHistory) && r.source && (this.sources[r.source].used = !0)
                    }
                    var i = 300;
                    Math.floor(this.z) !== Math.floor(e) && this.animationLoop.set(i), this.z = e, this.fire("zoom")
                },
                _updateZoomHistory: function(e) {
                    var t = this.zoomHistory;
                    void 0 === t.lastIntegerZoom && (t.lastIntegerZoom = Math.floor(e), t.lastIntegerZoomTime = 0, t.lastZoom = e), Math.floor(t.lastZoom) < Math.floor(e) ? (t.lastIntegerZoom = Math.floor(e), t.lastIntegerZoomTime = Date.now()) : Math.floor(t.lastZoom) > Math.floor(e) && (t.lastIntegerZoom = Math.floor(e + 1), t.lastIntegerZoomTime = Date.now()), t.lastZoom = e
                },
                batch: function(e) {
                    styleBatch(this, e)
                },
                addSource: function(e, t) {
                    return this.batch(function(r) {
                        r.addSource(e, t)
                    }), this
                },
                removeSource: function(e) {
                    return this.batch(function(t) {
                        t.removeSource(e)
                    }), this
                },
                getSource: function(e) {
                    return this.sources[e]
                },
                addLayer: function(e, t) {
                    return this.batch(function(r) {
                        r.addLayer(e, t)
                    }), this
                },
                removeLayer: function(e) {
                    return this.batch(function(t) {
                        t.removeLayer(e)
                    }), this
                },
                getLayer: function(e) {
                    return this._layers[e]
                },
                getReferentLayer: function(e) {
                    var t = this.getLayer(e);
                    return t.ref && (t = this.getLayer(t.ref)), t
                },
                setFilter: function(e, t) {
                    return this.batch(function(r) {
                        r.setFilter(e, t)
                    }), this
                },
                setLayerZoomRange: function(e, t, r) {
                    return this.batch(function(i) {
                        i.setLayerZoomRange(e, t, r)
                    }), this
                },
                getFilter: function(e) {
                    return this.getReferentLayer(e).filter
                },
                getLayoutProperty: function(e, t) {
                    return this.getReferentLayer(e).getLayoutProperty(t)
                },
                getPaintProperty: function(e, t, r) {
                    return this.getLayer(e).getPaintProperty(t, r)
                },
                featuresAt: function(e, t, r) {
                    var i = [],
                        s = null;
                    t.layer && (t.layerIds = Array.isArray(t.layer) ? t.layer : [t.layer]), util.asyncEach(Object.keys(this.sources), function(r, o) {
                        var a = this.sources[r];
                        a.featuresAt(e, t, function(e, t) {
                            t && (i = i.concat(t)), e && (s = e), o()
                        })
                    }.bind(this), function() {
                        return s ? r(s) : void r(null, i.filter(function(e) {
                            return void 0 !== this._layers[e.layer]
                        }.bind(this)).map(function(e) {
                            return e.layer = this._layers[e.layer].json(), e
                        }.bind(this)))
                    }.bind(this))
                },
                featuresIn: function(e, t, r) {
                    var i = [],
                        s = null;
                    t.layer && (t.layer = {
                        id: t.layer
                    }), util.asyncEach(Object.keys(this.sources), function(r, o) {
                        var a = this.sources[r];
                        a.featuresIn(e, t, function(e, t) {
                            t && (i = i.concat(t)), e && (s = e), o()
                        })
                    }.bind(this), function() {
                        return s ? r(s) : void r(null, i.filter(function(e) {
                            return void 0 !== this._layers[e.layer]
                        }.bind(this)).map(function(e) {
                            return e.layer = this._layers[e.layer].json(), e
                        }.bind(this)))
                    }.bind(this))
                },
                _remove: function() {
                    this.dispatcher.remove()
                },
                _reloadSource: function(e) {
                    this.sources[e].reload()
                },
                _updateSources: function(e) {
                    for (var t in this.sources) this.sources[t].update(e)
                },
                _redoPlacement: function() {
                    for (var e in this.sources) this.sources[e].redoPlacement && this.sources[e].redoPlacement()
                },
                _forwardSourceEvent: function(e) {
                    this.fire("source." + e.type, util.extend({
                        source: e.target
                    }, e))
                },
                _forwardTileEvent: function(e) {
                    this.fire(e.type, util.extend({
                        source: e.target
                    }, e))
                },
                "get sprite json": function(e, t) {
                    var r = this.sprite;
                    r.loaded() ? t(null, {
                        sprite: r.data,
                        retina: r.retina
                    }) : r.on("load", function() {
                        t(null, {
                            sprite: r.data,
                            retina: r.retina
                        })
                    })
                },
                "get icons": function(e, t) {
                    var r = this.sprite,
                        i = this.spriteAtlas;
                    r.loaded() ? (i.setSprite(r), i.addIcons(e.icons, t)) : r.on("load", function() {
                        i.setSprite(r), i.addIcons(e.icons, t)
                    })
                },
                "get glyphs": function(e, t) {
                    this.glyphSource.getSimpleGlyphs(e.fontstack, e.codepoints, e.uid, t)
                }
            });
        }, {
            "../render/line_atlas": 36,
            "../symbol/glyph_atlas": 70,
            "../symbol/glyph_source": 71,
            "../symbol/sprite_atlas": 77,
            "../util/ajax": 94,
            "../util/browser": 95,
            "../util/dispatcher": 97,
            "../util/evented": 100,
            "../util/mapbox": 103,
            "../util/util": 106,
            "./animation_loop": 51,
            "./image_sprite": 52,
            "./style_batch": 57,
            "./style_layer": 60,
            "mapbox-gl-style-spec/lib/validate/latest": 130
        }],
        57: [function(require, module, exports) {
            "use strict";

            function styleBatch(e, t) {
                if (!e._loaded) throw new Error("Style is not done loading");
                var r = Object.create(styleBatch.prototype);
                r._style = e, r._groupLayers = !1, r._broadcastLayers = !1, r._reloadSources = {}, r._events = [], r._change = !1, t(r), r._groupLayers && r._style._groupLayers(), r._broadcastLayers && r._style._broadcastLayers(), Object.keys(r._reloadSources).forEach(function(e) {
                    r._style._reloadSource(e)
                }), r._events.forEach(function(e) {
                    r._style.fire.apply(r._style, e)
                }), r._change && r._style.fire("change")
            }
            var Source = require("../source/source"),
                StyleLayer = require("./style_layer");
            styleBatch.prototype = {
                addLayer: function(e, t) {
                    if (void 0 !== this._style._layers[e.id]) throw new Error("There is already a layer with this ID");
                    return e instanceof StyleLayer || (e = new StyleLayer(e)), this._style._layers[e.id] = e, this._style._order.splice(t ? this._style._order.indexOf(t) : 1 / 0, 0, e.id), e.resolveLayout(), e.resolveReference(this._style._layers), e.resolvePaint(), this._groupLayers = !0, this._broadcastLayers = !0, e.source && (this._reloadSources[e.source] = !0), this._events.push(["layer.add", {
                        layer: e
                    }]), this._change = !0, this
                },
                removeLayer: function(e) {
                    var t = this._style._layers[e];
                    if (void 0 === t) throw new Error("There is no layer with this ID");
                    for (var r in this._style._layers) this._style._layers[r].ref === e && this.removeLayer(r);
                    return delete this._style._layers[e], this._style._order.splice(this._style._order.indexOf(e), 1), this._groupLayers = !0, this._broadcastLayers = !0, this._events.push(["layer.remove", {
                        layer: t
                    }]), this._change = !0, this
                },
                setPaintProperty: function(e, t, r, s) {
                    return this._style.getLayer(e).setPaintProperty(t, r, s), this._change = !0, this
                },
                setLayoutProperty: function(e, t, r) {
                    return e = this._style.getReferentLayer(e), e.setLayoutProperty(t, r), this._broadcastLayers = !0, e.source && (this._reloadSources[e.source] = !0), this._change = !0, this
                },
                setFilter: function(e, t) {
                    return e = this._style.getReferentLayer(e), e.filter = t, this._broadcastLayers = !0, e.source && (this._reloadSources[e.source] = !0), this._change = !0, this
                },
                setLayerZoomRange: function(e, t, r) {
                    var s = this._style.getReferentLayer(e);
                    return null != t && (s.minzoom = t), null != r && (s.maxzoom = r), this._broadcastLayers = !0, s.source && (this._reloadSources[s.source] = !0), this._change = !0, this
                },
                addSource: function(e, t) {
                    if (!this._style._loaded) throw new Error("Style is not done loading");
                    if (void 0 !== this._style.sources[e]) throw new Error("There is already a source with this ID");
                    return t = Source.create(t), this._style.sources[e] = t, t.id = e, t.style = this._style, t.dispatcher = this._style.dispatcher, t.glyphAtlas = this._style.glyphAtlas, t.on("load", this._style._forwardSourceEvent).on("error", this._style._forwardSourceEvent).on("change", this._style._forwardSourceEvent).on("tile.add", this._style._forwardTileEvent).on("tile.load", this._style._forwardTileEvent).on("tile.error", this._style._forwardTileEvent).on("tile.remove", this._style._forwardTileEvent), this._events.push(["source.add", {
                        source: t
                    }]), this._change = !0, this
                },
                removeSource: function(e) {
                    if (void 0 === this._style.sources[e]) throw new Error("There is no source with this ID");
                    var t = this._style.sources[e];
                    return delete this._style.sources[e], t.off("load", this._style._forwardSourceEvent).off("error", this._style._forwardSourceEvent).off("change", this._style._forwardSourceEvent).off("tile.add", this._style._forwardTileEvent).off("tile.load", this._style._forwardTileEvent).off("tile.error", this._style._forwardTileEvent).off("tile.remove", this._style._forwardTileEvent), this._events.push(["source.remove", {
                        source: t
                    }]), this._change = !0, this
                }
            }, module.exports = styleBatch;
        }, {
            "../source/source": 43,
            "./style_layer": 60
        }],
        58: [function(require, module, exports) {
            "use strict";

            function StyleDeclaration(t, r) {
                this.type = t.type, this.transitionable = t.transition, null == r && (r = t["default"]), this.json = JSON.stringify(r), "color" === this.type ? this.value = parseColor(r) : this.value = r, "interpolated" === t["function"] ? this.calculate = MapboxGLFunction.interpolated(this.value) : (this.calculate = MapboxGLFunction["piecewise-constant"](this.value), t.transition && (this.calculate = transitioned(this.calculate)))
            }

            function transitioned(t) {
                return function(r, o, e) {
                    var n, i, a, l = r % 1,
                        s = Math.min((Date.now() - o.lastIntegerZoomTime) / e, 1),
                        c = 1,
                        u = 1;
                    return r > o.lastIntegerZoom ? (n = l + (1 - l) * s, c *= 2, i = t(r - 1), a = t(r)) : (n = 1 - (1 - s) * l, a = t(r), i = t(r + 1), c /= 2), {
                        from: i,
                        fromScale: c,
                        to: a,
                        toScale: u,
                        t: n
                    }
                }
            }

            function parseColor(t) {
                if (colorCache[t]) return colorCache[t];
                if (Array.isArray(t)) return t;
                if (t.stops) return util.extend({}, t, {
                    stops: t.stops.map(function(t) {
                        return [t[0], parseColor(t[1])]
                    })
                });
                if ("string" == typeof t) {
                    var r = colorDowngrade(parseCSSColor(t));
                    return colorCache[t] = r, r
                }
                throw new Error("Invalid color " + t)
            }

            function colorDowngrade(t) {
                return [t[0] / 255, t[1] / 255, t[2] / 255, t[3] / 1]
            }
            var parseCSSColor = require("csscolorparser").parseCSSColor,
                MapboxGLFunction = require("mapbox-gl-function"),
                util = require("../util/util");
            module.exports = StyleDeclaration;
            var colorCache = {};
        }, {
            "../util/util": 106,
            "csscolorparser": 111,
            "mapbox-gl-function": 129
        }],
        59: [function(require, module, exports) {
            "use strict";

            function makeConstructor(t) {
                function e(t) {
                    this._values = {}, this._transitions = {};
                    for (var e in t) this[e] = t[e]
                }
                return Object.keys(t).forEach(function(n) {
                    var r = t[n];
                    Object.defineProperty(e.prototype, n, {
                        set: function(t) {
                            this._values[n] = new StyleDeclaration(r, t)
                        },
                        get: function() {
                            return this._values[n].value
                        }
                    }), r.transition && Object.defineProperty(e.prototype, n + "-transition", {
                        set: function(t) {
                            this._transitions[n] = t
                        },
                        get: function() {
                            return this._transitions[n]
                        }
                    })
                }), e.prototype.values = function() {
                    return this._values
                }, e.prototype.transition = function(t, e) {
                    var n = this._transitions[t] || {};
                    return {
                        duration: util.coalesce(n.duration, e.duration, 300),
                        delay: util.coalesce(n.delay, e.delay, 0)
                    }
                }, e.prototype.json = function() {
                    var t = {};
                    for (var e in this._values) t[e] = this._values[e].value;
                    for (var n in this._transitions) t[n + "-transition"] = this._transitions[e];
                    return t
                }, e
            }
            var util = require("../util/util"),
                reference = require("./reference"),
                StyleDeclaration = require("./style_declaration"),
                lookup = {
                    paint: {},
                    layout: {}
                };
            reference.layer.type.values.forEach(function(t) {
                lookup.paint[t] = makeConstructor(reference["paint_" + t]), lookup.layout[t] = makeConstructor(reference["layout_" + t])
            }), module.exports = function(t, e, n) {
                return new lookup[t][e](n)
            };
        }, {
            "../util/util": 106,
            "./reference": 55,
            "./style_declaration": 58
        }],
        60: [function(require, module, exports) {
            "use strict";

            function StyleLayer(t) {
                this._layer = t, this.id = t.id, this.ref = t.ref, this._resolved = {}, this._cascaded = {}, this.assign(t)
            }

            function premultiplyLayer(t, i) {
                var e = i + "-color",
                    a = i + "-halo-color",
                    o = i + "-outline-color",
                    r = t[e],
                    s = t[a],
                    n = t[o],
                    l = t[i + "-opacity"],
                    y = r && l * r[3],
                    u = s && l * s[3],
                    h = n && l * n[3];
                void 0 !== y && 1 > y && (t[e] = util.premultiply([r[0], r[1], r[2], y])), void 0 !== u && 1 > u && (t[a] = util.premultiply([s[0], s[1], s[2], u])), void 0 !== h && 1 > h && (t[o] = util.premultiply([n[0], n[1], n[2], h]))
            }
            var util = require("../util/util"),
                StyleTransition = require("./style_transition"),
                StyleDeclarationSet = require("./style_declaration_set"),
                LayoutProperties = require("./layout_properties"),
                PaintProperties = require("./paint_properties");
            module.exports = StyleLayer, StyleLayer.prototype = {
                resolveLayout: function() {
                    this.ref || (this.layout = new LayoutProperties[this.type](this._layer.layout), "line" === this.layout["symbol-placement"] && (this.layout.hasOwnProperty("text-rotation-alignment") || (this.layout["text-rotation-alignment"] = "map"), this.layout.hasOwnProperty("icon-rotation-alignment") || (this.layout["icon-rotation-alignment"] = "map"), this.layout["symbol-avoid-edges"] = !0))
                },
                setLayoutProperty: function(t, i) {
                    null == i ? delete this.layout[t] : this.layout[t] = i
                },
                getLayoutProperty: function(t) {
                    return this.layout[t]
                },
                resolveReference: function(t) {
                    this.ref && this.assign(t[this.ref])
                },
                resolvePaint: function() {
                    for (var t in this._layer) {
                        var i = t.match(/^paint(?:\.(.*))?$/);
                        i && (this._resolved[i[1] || ""] = new StyleDeclarationSet("paint", this.type, this._layer[t]))
                    }
                },
                setPaintProperty: function(t, i, e) {
                    var a = this._resolved[e || ""];
                    a || (a = this._resolved[e || ""] = new StyleDeclarationSet("paint", this.type, {})), a[t] = i
                },
                getPaintProperty: function(t, i) {
                    var e = this._resolved[i || ""];
                    return e ? e[t] : void 0
                },
                cascade: function(t, i, e, a) {
                    for (var o in this._resolved)
                        if ("" === o || t[o]) {
                            var r = this._resolved[o],
                                s = r.values();
                            for (var n in s) {
                                var l = s[n],
                                    y = i.transition ? this._cascaded[n] : void 0;
                                if (!y || y.declaration.json !== l.json) {
                                    var u = r.transition(n, e),
                                        h = this._cascaded[n] = new StyleTransition(l, y, u);
                                    h.instant() || (h.loopID = a.set(h.endTime - (new Date).getTime())), y && a.cancel(y.loopID)
                                }
                            }
                        }
                    if ("symbol" === this.type) {
                        var c = new StyleDeclarationSet("layout", this.type, this.layout);
                        this._cascaded["text-size"] = new StyleTransition(c.values()["text-size"], void 0, e), this._cascaded["icon-size"] = new StyleTransition(c.values()["icon-size"], void 0, e)
                    }
                },
                recalculate: function(t, i) {
                    var e = this.type,
                        a = this.paint = new PaintProperties[e];
                    for (var o in this._cascaded) a[o] = this._cascaded[o].at(t, i);
                    if (this.hidden = this.minzoom && t < this.minzoom || this.maxzoom && t >= this.maxzoom || "none" === this.layout.visibility, "symbol" === e ? 0 !== a["text-opacity"] && this.layout["text-field"] || 0 !== a["icon-opacity"] && this.layout["icon-image"] ? (premultiplyLayer(a, "text"), premultiplyLayer(a, "icon")) : this.hidden = !0 : 0 === a[e + "-opacity"] ? this.hidden = !0 : premultiplyLayer(a, e), this._cascaded["line-dasharray"]) {
                        var r = a["line-dasharray"],
                            s = this._cascaded["line-width"] ? this._cascaded["line-width"].at(Math.floor(t), 1 / 0) : a["line-width"];
                        r.fromScale *= s, r.toScale *= s
                    }
                    return !this.hidden
                },
                assign: function(t) {
                    util.extend(this, util.pick(t, ["type", "source", "source-layer", "minzoom", "maxzoom", "filter", "layout"]))
                },
                json: function() {
                    return util.extend({}, this._layer, util.pick(this, ["type", "source", "source-layer", "minzoom", "maxzoom", "filter", "layout", "paint"]))
                }
            };
        }, {
            "../util/util": 106,
            "./layout_properties": 53,
            "./paint_properties": 54,
            "./style_declaration_set": 59,
            "./style_transition": 61
        }],
        61: [function(require, module, exports) {
            "use strict";

            function StyleTransition(t, i, e) {
                this.declaration = t, this.startTime = this.endTime = (new Date).getTime();
                var n = t.type;
                "string" !== n && "array" !== n || !t.transitionable ? this.interp = interpolate[n] : this.interp = interpZoomTransitioned, this.oldTransition = i, this.duration = e.duration || 0, this.delay = e.delay || 0, this.instant() || (this.endTime = this.startTime + this.duration + this.delay, this.ease = util.easeCubicInOut), i && i.endTime <= this.startTime && delete i.oldTransition
            }

            function interpZoomTransitioned(t, i, e) {
                return {
                    from: t.to,
                    fromScale: t.toScale,
                    to: i.to,
                    toScale: i.toScale,
                    t: e
                }
            }
            var util = require("../util/util"),
                interpolate = require("../util/interpolate");
            module.exports = StyleTransition, StyleTransition.prototype.instant = function() {
                return !this.oldTransition || !this.interp || 0 === this.duration && 0 === this.delay
            }, StyleTransition.prototype.at = function(t, i, e) {
                var n = this.declaration.calculate(t, i, this.duration);
                if (this.instant()) return n;
                if (e = e || Date.now(), e < this.endTime) {
                    var r = this.oldTransition.at(t, i, this.startTime),
                        a = this.ease((e - this.startTime - this.delay) / this.duration);
                    n = this.interp(r, n, a)
                }
                return n
            };
        }, {
            "../util/interpolate": 102,
            "../util/util": 106
        }],
        62: [function(require, module, exports) {
            "use strict";

            function Anchor(t, e, o, n) {
                this.x = t, this.y = e, this.angle = o, void 0 !== n && (this.segment = n)
            }
            var Point = require("point-geometry");
            module.exports = Anchor, Anchor.prototype = Object.create(Point.prototype), Anchor.prototype.clone = function() {
                return new Anchor(this.x, this.y, this.angle, this.segment)
            };
        }, {
            "point-geometry": 137
        }],
        63: [function(require, module, exports) {
            "use strict";

            function BinPack(e, h) {
                this.width = e, this.height = h, this.free = [{
                    x: 0,
                    y: 0,
                    w: e,
                    h: h
                }]
            }
            module.exports = BinPack, BinPack.prototype.release = function(e) {
                for (var h = 0; h < this.free.length; h++) {
                    var i = this.free[h];
                    if (i.y === e.y && i.h === e.h && i.x + i.w === e.x) i.w += e.w;
                    else if (i.x === e.x && i.w === e.w && i.y + i.h === e.y) i.h += e.h;
                    else if (e.y === i.y && e.h === i.h && e.x + e.w === i.x) i.x = e.x, i.w += e.w;
                    else {
                        if (e.x !== i.x || e.w !== i.w || e.y + e.h !== i.y) continue;
                        i.y = e.y, i.h += e.h
                    }
                    return this.free.splice(h, 1), void this.release(i)
                }
                this.free.push(e)
            }, BinPack.prototype.allocate = function(e, h) {
                for (var i = {
                        x: 1 / 0,
                        y: 1 / 0,
                        w: 1 / 0,
                        h: 1 / 0
                    }, t = -1, s = 0; s < this.free.length; s++) {
                    var r = this.free[s];
                    e <= r.w && h <= r.h && r.y <= i.y && r.x <= i.x && (i = r, t = s)
                }
                return 0 > t ? {
                    x: -1,
                    y: -1
                } : (this.free.splice(t, 1), i.w < i.h ? (i.w > e && this.free.push({
                    x: i.x + e,
                    y: i.y,
                    w: i.w - e,
                    h: h
                }), i.h > h && this.free.push({
                    x: i.x,
                    y: i.y + h,
                    w: i.w,
                    h: i.h - h
                })) : (i.w > e && this.free.push({
                    x: i.x + e,
                    y: i.y,
                    w: i.w - e,
                    h: i.h
                }), i.h > h && this.free.push({
                    x: i.x,
                    y: i.y + h,
                    w: e,
                    h: i.h - h
                })), {
                    x: i.x,
                    y: i.y,
                    w: e,
                    h: h
                })
            };
        }, {}],
        64: [function(require, module, exports) {
            "use strict";

            function checkMaxAngle(e, t, a, r, n) {
                if (void 0 === t.segment) return !0;
                for (var i = t, s = t.segment + 1, f = 0; f > -a / 2;) {
                    if (s--, 0 > s) return !1;
                    f -= e[s].dist(i), i = e[s]
                }
                f += e[s].dist(e[s + 1]), s++;
                for (var l = [], o = 0; a / 2 > f;) {
                    var u = e[s - 1],
                        c = e[s],
                        g = e[s + 1];
                    if (!g) return !1;
                    var h = u.angleTo(c) - c.angleTo(g);
                    for (h = (h + 3 * Math.PI) % (2 * Math.PI) - Math.PI, l.push({
                            distance: f,
                            angleDelta: h
                        }), o += h; f - l[0].distance > r;) o -= l.shift().angleDelta;
                    if (Math.abs(o) > n) return !1;
                    s++, f += c.dist(g)
                }
                return !0
            }
            module.exports = checkMaxAngle;
        }, {}],
        65: [function(require, module, exports) {
            "use strict";

            function clipLine(x, y, n, e, t) {
                for (var i = [], o = 0; o < x.length; o++)
                    for (var r, P = x[o], u = 0; u < P.length - 1; u++) {
                        var w = P[u],
                            l = P[u + 1];
                        w.x < y && l.x < y || (w.x < y ? w = new Point(y, w.y + (l.y - w.y) * ((y - w.x) / (l.x - w.x))) : l.x < y && (l = new Point(y, w.y + (l.y - w.y) * ((y - w.x) / (l.x - w.x)))), w.y < n && l.y < n || (w.y < n ? w = new Point(w.x + (l.x - w.x) * ((n - w.y) / (l.y - w.y)), n) : l.y < n && (l = new Point(w.x + (l.x - w.x) * ((n - w.y) / (l.y - w.y)), n)), w.x >= e && l.x >= e || (w.x >= e ? w = new Point(e, w.y + (l.y - w.y) * ((e - w.x) / (l.x - w.x))) : l.x >= e && (l = new Point(e, w.y + (l.y - w.y) * ((e - w.x) / (l.x - w.x)))), w.y >= t && l.y >= t || (w.y >= t ? w = new Point(w.x + (l.x - w.x) * ((t - w.y) / (l.y - w.y)), t) : l.y >= t && (l = new Point(w.x + (l.x - w.x) * ((t - w.y) / (l.y - w.y)), t)), r && w.equals(r[r.length - 1]) || (r = [w], i.push(r)), r.push(l)))))
                    }
                return i
            }
            var Point = require("point-geometry");
            module.exports = clipLine;
        }, {
            "point-geometry": 137
        }],
        66: [function(require, module, exports) {
            "use strict";

            function CollisionBox(i, t, s, h, o, l) {
                this.anchorPoint = i, this.x1 = t, this.y1 = s, this.x2 = h, this.y2 = o, this.maxScale = l, this.placementScale = 0, this[0] = this[1] = this[2] = this[3] = 0
            }
            module.exports = CollisionBox;
        }, {}],
        67: [function(require, module, exports) {
            "use strict";

            function CollisionFeature(o, i, t, e, r, s) {
                var n = t.top * e - r,
                    l = t.bottom * e + r,
                    a = t.left * e - r,
                    u = t.right * e + r;
                if (this.boxes = [], s) {
                    var h = l - n,
                        x = u - a;
                    if (0 >= h) return;
                    h = Math.max(10 * e, h), this._addLineCollisionBoxes(o, i, x, h)
                } else this.boxes.push(new CollisionBox(new Point(i.x, i.y), a, n, u, l, 1 / 0))
            }
            var CollisionBox = require("./collision_box"),
                Point = require("point-geometry");
            module.exports = CollisionFeature, CollisionFeature.prototype._addLineCollisionBoxes = function(o, i, t, e) {
                var r = e / 2,
                    s = Math.floor(t / r),
                    n = -e / 2,
                    l = this.boxes,
                    a = i,
                    u = i.segment + 1,
                    h = n;
                do {
                    if (u--, 0 > u) return l;
                    h -= o[u].dist(a), a = o[u]
                } while (h > -t / 2);
                for (var x = o[u].dist(o[u + 1]), d = 0; s > d; d++) {
                    for (var f = -t / 2 + d * r; f > h + x;) {
                        if (h += x, u++, u + 1 >= o.length) return l;
                        x = o[u].dist(o[u + 1])
                    }
                    var C = f - h,
                        b = o[u],
                        m = o[u + 1],
                        p = m.sub(b)._unit()._mult(C)._add(b),
                        v = Math.max(Math.abs(f - n) - r / 2, 0),
                        _ = t / 2 / v;
                    l.push(new CollisionBox(p, -e / 2, -e / 2, e / 2, e / 2, _))
                }
                return l
            };
        }, {
            "./collision_box": 66,
            "point-geometry": 137
        }],
        68: [function(require, module, exports) {
            "use strict";

            function CollisionTile(t, a) {
                this.tree = rbush(), this.angle = t;
                var e = Math.sin(t),
                    i = Math.cos(t);
                this.rotationMatrix = [i, -e, e, i], this.yStretch = 1 / Math.cos(a / 180 * Math.PI), this.yStretch = Math.pow(this.yStretch, 1.3)
            }
            var rbush = require("rbush");
            module.exports = CollisionTile, CollisionTile.prototype.minScale = .25, CollisionTile.prototype.maxScale = 2, CollisionTile.prototype.placeCollisionFeature = function(t) {
                for (var a = this.minScale, e = this.rotationMatrix, i = this.yStretch, o = 0; o < t.boxes.length; o++) {
                    var l = t.boxes[o],
                        r = l.anchorPoint.matMult(e),
                        s = r.x,
                        h = r.y;
                    l[0] = s + l.x1, l[1] = h + l.y1 * i, l[2] = s + l.x2, l[3] = h + l.y2 * i;
                    for (var n = this.tree.search(l), c = 0; c < n.length; c++) {
                        var x = n[c],
                            m = x.anchorPoint.matMult(e),
                            y = (x.x1 - l.x2) / (s - m.x),
                            u = (x.x2 - l.x1) / (s - m.x),
                            S = (x.y1 - l.y2) * i / (h - m.y),
                            p = (x.y2 - l.y1) * i / (h - m.y);
                        (isNaN(y) || isNaN(u)) && (y = u = 1), (isNaN(S) || isNaN(p)) && (S = p = 1);
                        var M = Math.min(Math.max(y, u), Math.max(S, p));
                        if (M > x.maxScale && (M = x.maxScale), M > l.maxScale && (M = l.maxScale), M > a && M >= x.placementScale && (a = M), a >= this.maxScale) return a
                    }
                }
                return a
            }, CollisionTile.prototype.insertCollisionFeature = function(t, a) {
                for (var e = t.boxes, i = 0; i < e.length; i++) e[i].placementScale = a;
                a < this.maxScale && this.tree.load(e)
            };
        }, {
            "rbush": 138
        }],
        69: [function(require, module, exports) {
            "use strict";

            function getAnchors(e, r, t, a, n, o, l, h) {
                var i = a ? .6 * o * l : 0,
                    c = Math.max(a ? a.right - a.left : 0, n ? n.right - n.left : 0);
                if (0 === e[0].x || 4096 === e[0].x || 0 === e[0].y || 4096 === e[0].y) var u = !0;
                r / 4 > r - c * l && (r = c * l + r / 4);
                var s = 2 * o,
                    g = u ? r / 2 * h % r : (c / 2 + s) * l * h % r;
                return resample(e, g, r, i, t, c * l, u, !1)
            }

            function resample(e, r, t, a, n, o, l, h) {
                for (var i = 0, c = r - t, u = [], s = 0; s < e.length - 1; s++) {
                    for (var g = e[s], p = e[s + 1], x = g.dist(p), f = p.angleTo(g); i + x > c + t;) {
                        c += t;
                        var v = (c - i) / x,
                            m = interpolate(g.x, p.x, v),
                            A = interpolate(g.y, p.y, v);
                        if (m >= 0 && 4096 > m && A >= 0 && 4096 > A) {
                            m = Math.round(m), A = Math.round(A);
                            var y = new Anchor(m, A, f, s);
                            (!a || checkMaxAngle(e, y, o, a, n)) && u.push(y)
                        }
                    }
                    i += x
                }
                return h || u.length || l || (u = resample(e, i / 2, t, a, n, o, l, !0)), u
            }
            var interpolate = require("../util/interpolate"),
                Anchor = require("../symbol/anchor"),
                checkMaxAngle = require("./check_max_angle");
            module.exports = getAnchors;
        }, {
            "../symbol/anchor": 62,
            "../util/interpolate": 102,
            "./check_max_angle": 64
        }],
        70: [function(require, module, exports) {
            "use strict";

            function GlyphAtlas(t, i) {
                this.width = t, this.height = i, this.bin = new BinPack(t, i), this.index = {}, this.ids = {}, this.data = new Uint8Array(t * i)
            }
            var BinPack = require("./bin_pack");
            module.exports = GlyphAtlas, GlyphAtlas.prototype = {get debug() {
                    return "canvas" in this
                },
                set debug(t) {
                    t && !this.canvas ? (this.canvas = document.createElement("canvas"), this.canvas.width = this.width, this.canvas.height = this.height, document.body.appendChild(this.canvas), this.ctx = this.canvas.getContext("2d")) : !t && this.canvas && (this.canvas.parentNode.removeChild(this.canvas), delete this.ctx, delete this.canvas)
                }
            }, GlyphAtlas.prototype.getGlyphs = function() {
                var t, i, e, s = {};
                for (var h in this.ids) t = h.split("#"), i = t[0], e = t[1], s[i] || (s[i] = []), s[i].push(e);
                return s
            }, GlyphAtlas.prototype.getRects = function() {
                var t, i, e, s = {};
                for (var h in this.ids) t = h.split("#"), i = t[0], e = t[1], s[i] || (s[i] = {}), s[i][e] = this.index[h];
                return s
            }, GlyphAtlas.prototype.removeGlyphs = function(t) {
                for (var i in this.ids) {
                    var e = this.ids[i],
                        s = e.indexOf(t);
                    if (s >= 0 && e.splice(s, 1), this.ids[i] = e, !e.length) {
                        for (var h = this.index[i], a = this.data, r = 0; r < h.h; r++)
                            for (var n = this.width * (h.y + r) + h.x, d = 0; d < h.w; d++) a[n + d] = 0;
                        this.dirty = !0, this.bin.release(h), delete this.index[i], delete this.ids[i]
                    }
                }
                this.updateTexture(this.gl)
            }, GlyphAtlas.prototype.addGlyph = function(t, i, e, s) {
                if (!e) return null;
                var h = i + "#" + e.id;
                if (this.index[h]) return this.ids[h].indexOf(t) < 0 && this.ids[h].push(t), this.index[h];
                if (!e.bitmap) return null;
                var a = e.width + 2 * s,
                    r = e.height + 2 * s,
                    n = 1,
                    d = a + 2 * n,
                    l = r + 2 * n;
                d += 4 - d % 4, l += 4 - l % 4;
                var o = this.bin.allocate(d, l);
                if (o.x < 0) return console.warn("glyph bitmap overflow"), {
                    glyph: e,
                    rect: null
                };
                this.index[h] = o, this.ids[h] = [t];
                for (var c = this.data, p = e.bitmap, u = 0; r > u; u++)
                    for (var x = this.width * (o.y + u + n) + o.x + n, E = a * u, T = 0; a > T; T++) c[x + T] = p[E + T];
                return this.dirty = !0, o
            }, GlyphAtlas.prototype.bind = function(t) {
                this.gl = t, this.texture ? t.bindTexture(t.TEXTURE_2D, this.texture) : (this.texture = t.createTexture(), t.bindTexture(t.TEXTURE_2D, this.texture), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MAG_FILTER, t.LINEAR), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MIN_FILTER, t.LINEAR), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_S, t.CLAMP_TO_EDGE), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_T, t.CLAMP_TO_EDGE), t.texImage2D(t.TEXTURE_2D, 0, t.ALPHA, this.width, this.height, 0, t.ALPHA, t.UNSIGNED_BYTE, null))
            }, GlyphAtlas.prototype.updateTexture = function(t) {
                if (this.bind(t), this.dirty) {
                    if (t.texSubImage2D(t.TEXTURE_2D, 0, 0, 0, this.width, this.height, t.ALPHA, t.UNSIGNED_BYTE, this.data), this.ctx) {
                        for (var i = this.ctx.getImageData(0, 0, this.width, this.height), e = 0, s = 0; e < this.data.length; e++, s += 4) i.data[s] = this.data[e], i.data[s + 1] = this.data[e], i.data[s + 2] = this.data[e], i.data[s + 3] = 255;
                        this.ctx.putImageData(i, 0, 0), this.ctx.strokeStyle = "red";
                        for (var h = 0; h < this.bin.free.length; h++) {
                            var a = this.bin.free[h];
                            this.ctx.strokeRect(a.x, a.y, a.w, a.h)
                        }
                    }
                    this.dirty = !1
                }
            };
        }, {
            "./bin_pack": 63
        }],
        71: [function(require, module, exports) {
            "use strict";

            function GlyphSource(t, e) {
                this.url = t && normalizeURL(t), this.glyphAtlas = e, this.stacks = [], this.loading = {}
            }

            function SimpleGlyph(t, e, r) {
                var i = 1;
                this.advance = t.advance, this.left = t.left - r - i, this.top = t.top + r + i, this.rect = e
            }

            function glyphUrl(t, e, r, i) {
                return i = i || "abc", r.replace("{s}", i[t.length % i.length]).replace("{fontstack}", t).replace("{range}", e)
            }
            var normalizeURL = require("../util/mapbox").normalizeGlyphsURL,
                getArrayBuffer = require("../util/ajax").getArrayBuffer,
                Glyphs = require("../util/glyphs"),
                Protobuf = require("pbf");
            module.exports = GlyphSource, GlyphSource.prototype.getSimpleGlyphs = function(t, e, r, i) {
                void 0 === this.stacks[t] && (this.stacks[t] = {});
                for (var l, a = {}, s = this.stacks[t], h = this.glyphAtlas, o = 3, n = {}, p = 0, u = 0; u < e.length; u++) {
                    var f = e[u];
                    if (l = Math.floor(f / 256), s[l]) {
                        var y = s[l].glyphs[f],
                            c = h.addGlyph(r, t, y, o);
                        y && (a[f] = new SimpleGlyph(y, c, o))
                    } else void 0 === n[l] && (n[l] = [], p++), n[l].push(f)
                }
                p || i(void 0, a);
                var g = function(e, l, s) {
                    if (!e)
                        for (var u = this.stacks[t][l] = s.stacks[0], f = 0; f < n[l].length; f++) {
                            var y = n[l][f],
                                c = u.glyphs[y],
                                g = h.addGlyph(r, t, c, o);
                            c && (a[y] = new SimpleGlyph(c, g, o))
                        }
                    p--, p || i(void 0, a)
                }.bind(this);
                for (var d in n) this.loadRange(t, d, g)
            }, GlyphSource.prototype.loadRange = function(t, e, r) {
                if (256 * e > 65535) return r("gyphs > 65535 not supported");
                void 0 === this.loading[t] && (this.loading[t] = {});
                var i = this.loading[t];
                if (i[e]) i[e].push(r);
                else {
                    i[e] = [r];
                    var l = 256 * e + "-" + (256 * e + 255),
                        a = glyphUrl(t, l, this.url);
                    getArrayBuffer(a, function(t, r) {
                        for (var l = !t && new Glyphs(new Protobuf(new Uint8Array(r))), a = 0; a < i[e].length; a++) i[e][a](t, e, l);
                        delete i[e]
                    })
                }
            };
        }, {
            "../util/ajax": 94,
            "../util/glyphs": 101,
            "../util/mapbox": 103,
            "pbf": 135
        }],
        72: [function(require, module, exports) {
            "use strict";
            module.exports = function(e, t, n) {
                function r(r) {
                    c.push(e[r]), f.push(n[r]), v.push(t[r]), h++
                }

                function u(e, t, n) {
                    var r = l[e];
                    return delete l[e], l[t] = r, f[r][0].pop(), f[r][0] = f[r][0].concat(n[0]), r
                }

                function i(e, t, n) {
                    var r = a[t];
                    return delete a[t], a[e] = r, f[r][0].shift(), f[r][0] = n[0].concat(f[r][0]), r
                }

                function o(e, t, n) {
                    var r = n ? t[0][t[0].length - 1] : t[0][0];
                    return e + ":" + r.x + ":" + r.y
                }
                var s, a = {},
                    l = {},
                    c = [],
                    f = [],
                    v = [],
                    h = 0;
                for (s = 0; s < e.length; s++) {
                    var p = n[s],
                        d = t[s];
                    if (d) {
                        var g = o(d, p),
                            x = o(d, p, !0);
                        if (g in l && x in a && l[g] !== a[x]) {
                            var m = i(g, x, p),
                                y = u(g, x, f[m]);
                            delete a[g], delete l[x], l[o(d, f[y], !0)] = y, f[m] = null
                        } else g in l ? u(g, x, p) : x in a ? i(g, x, p) : (r(s), a[g] = h - 1, l[x] = h - 1)
                    } else r(s)
                }
                return {
                    features: c,
                    textFeatures: v,
                    geometries: f
                }
            };
        }, {}],
        73: [function(require, module, exports) {
            "use strict";

            function SymbolQuad(t, a, e, n, i, o, r, h, l) {
                this.anchorPoint = t, this.tl = a, this.tr = e, this.bl = n, this.br = i, this.tex = o, this.angle = r, this.minScale = h, this.maxScale = l
            }

            function getIconQuads(t, a, e, n, i, o) {
                var r = a.image.rect,
                    h = 1,
                    l = a.left - h,
                    s = l + r.w,
                    m = a.top - h,
                    u = m + r.h,
                    c = new Point(l, m),
                    g = new Point(s, m),
                    M = new Point(s, u),
                    P = new Point(l, u),
                    f = i["icon-rotate"] * Math.PI / 180;
                if (o) {
                    var y = n[t.segment];
                    f += Math.atan2(t.y - y.y, t.x - y.x)
                }
                if (f) {
                    var S = Math.sin(f),
                        v = Math.cos(f),
                        x = [v, -S, S, v];
                    c = c.matMult(x), g = g.matMult(x), P = P.matMult(x), M = M.matMult(x)
                }
                return [new SymbolQuad(new Point(t.x, t.y), c, g, P, M, a.image.rect, 0, minScale, 1 / 0)]
            }

            function getGlyphQuads(t, a, e, n, i, o) {
                for (var r = i["text-rotate"] * Math.PI / 180, h = i["text-keep-upright"], l = a.positionedGlyphs, s = [], m = 0; m < l.length; m++) {
                    var u = l[m],
                        c = u.glyph,
                        g = c.rect;
                    if (g) {
                        var M, P = (u.x + c.advance / 2) * e,
                            f = minScale;
                        o ? (M = [], f = getSegmentGlyphs(M, t, P, n, t.segment, !0), h && (f = Math.min(f, getSegmentGlyphs(M, t, P, n, t.segment, !1)))) : M = [{
                            anchorPoint: new Point(t.x, t.y),
                            offset: 0,
                            angle: 0,
                            maxScale: 1 / 0,
                            minScale: minScale
                        }];
                        for (var y = u.x + c.left, S = u.y - c.top, v = y + g.w, x = S + g.h, p = new Point(y, S), w = new Point(v, S), d = new Point(y, x), I = new Point(v, x), b = 0; b < M.length; b++) {
                            var Q = M[b],
                                G = p,
                                k = w,
                                q = d,
                                _ = I,
                                j = Q.angle + r;
                            if (j) {
                                var z = Math.sin(j),
                                    A = Math.cos(j),
                                    B = [A, -z, z, A];
                                G = G.matMult(B), k = k.matMult(B), q = q.matMult(B), _ = _.matMult(B)
                            }
                            var C = Math.max(Q.minScale, f),
                                D = (t.angle + r + Q.offset + 2 * Math.PI) % (2 * Math.PI);
                            s.push(new SymbolQuad(Q.anchorPoint, G, k, q, _, g, D, C, Q.maxScale))
                        }
                    }
                }
                return s
            }

            function getSegmentGlyphs(t, a, e, n, i, o) {
                var r = !o;
                0 > e && (o = !o), o && i++;
                var h = new Point(a.x, a.y),
                    l = n[i],
                    s = 1 / 0;
                e = Math.abs(e);
                for (var m = minScale;;) {
                    var u = h.dist(l),
                        c = e / u,
                        g = Math.atan2(l.y - h.y, l.x - h.x);
                    if (o || (g += Math.PI), r && (g += Math.PI), t.push({
                            anchorPoint: h,
                            offset: r ? Math.PI : 0,
                            minScale: c,
                            maxScale: s,
                            angle: (g + 2 * Math.PI) % (2 * Math.PI)
                        }), m >= c) break;
                    for (h = l; h.equals(l);)
                        if (i += o ? 1 : -1, l = n[i], !l) return c;
                    var M = l.sub(h)._unit();
                    h = h.sub(M._mult(u)), s = c
                }
                return m
            }
            var Point = require("point-geometry");
            module.exports = {
                getIconQuads: getIconQuads,
                getGlyphQuads: getGlyphQuads
            };
            var minScale = .5;
        }, {
            "point-geometry": 137
        }],
        74: [function(require, module, exports) {
            "use strict";

            function resolveIcons(e, r) {
                for (var o = [], s = 0, n = e.length; n > s; s++) {
                    var t = resolveTokens(e[s].properties, r["icon-image"]);
                    t && o.indexOf(t) < 0 && o.push(t)
                }
                return o
            }
            var resolveTokens = require("../util/token");
            module.exports = resolveIcons;
        }, {
            "../util/token": 105
        }],
        75: [function(require, module, exports) {
            "use strict";

            function resolveText(e, r, t) {
                for (var o = [], s = [], n = 0, u = e.length; u > n; n++) {
                    var a = resolveTokens(e[n].properties, r["text-field"]);
                    if (a) {
                        a = a.toString();
                        var l = r["text-transform"];
                        "uppercase" === l ? a = a.toLocaleUpperCase() : "lowercase" === l && (a = a.toLocaleLowerCase());
                        for (var i = 0, v = a.length; v > i; i++) s.push(a.charCodeAt(i));
                        o[n] = a
                    } else o[n] = null
                }
                return s = uniq(s, t), {
                    textFeatures: o,
                    codepoints: s
                }
            }

            function uniq(e, r) {
                var t, o = [];
                e.sort(sortNumbers);
                for (var s = 0; s < e.length; s++) e[s] !== t && (t = e[s], r[t] || o.push(e[s]));
                return o
            }

            function sortNumbers(e, r) {
                return e - r
            }
            var resolveTokens = require("../util/token");
            module.exports = resolveText;
        }, {
            "../util/token": 105
        }],
        76: [function(require, module, exports) {
            "use strict";

            function PositionedGlyph(t, i, n, e) {
                this.codePoint = t, this.x = i, this.y = n, this.glyph = e
            }

            function Shaping(t, i, n, e, o, h) {
                this.positionedGlyphs = t, this.text = i, this.top = n, this.bottom = e, this.left = o, this.right = h
            }

            function shapeText(t, i, n, e, o, h, a, s, r) {
                for (var l = [], f = new Shaping(l, t, r[1], r[1], r[0], r[0]), c = -17, p = r[0], u = r[1] + c, d = 0; d < t.length; d++) {
                    var g = t.charCodeAt(d),
                        v = i[g];
                    v && (l.push(new PositionedGlyph(g, p, u, v)), p += v.advance + s)
                }
                return l.length ? (linewrap(f, i, e, n, o, h, a), f) : !1
            }

            function linewrap(t, i, n, e, o, h, a) {
                var s = null,
                    r = 0,
                    l = 0,
                    f = 0,
                    c = 0,
                    p = t.positionedGlyphs;
                if (e)
                    for (var u = 0; u < p.length; u++) {
                        var d = p[u];
                        if (d.x -= r, d.y += n * f, d.x > e && null !== s) {
                            var g = p[s + 1].x;
                            c = Math.max(g, c);
                            for (var v = s + 1; u >= v; v++) p[v].y += n, p[v].x -= g;
                            a && justifyLine(p, i, l, s - 1, a), l = s + 1, s = null, r += g, f++
                        }
                        breakable[d.codePoint] && (s = u)
                    }
                var x = p[p.length - 1],
                    y = x.x + i[x.codePoint].advance;
                c = Math.max(c, y);
                var P = (f + 1) * n;
                justifyLine(p, i, l, p.length - 1, a), align(p, a, o, h, c, n, f), t.top += -h * P, t.bottom = t.top + P, t.left += -o * c, t.right = t.left + c
            }

            function justifyLine(t, i, n, e, o) {
                for (var h = i[t[e].codePoint].advance, a = (t[e].x + h) * o, s = n; e >= s; s++) t[s].x -= a
            }

            function align(t, i, n, e, o, h, a) {
                for (var s = (i - n) * o, r = (-e * (a + 1) + .5) * h, l = 0; l < t.length; l++) t[l].x += s, t[l].y += r
            }

            function shapeIcon(t, i) {
                if (!t || !t.rect) return null;
                var n = i["icon-offset"][0],
                    e = i["icon-offset"][1],
                    o = n - t.width / 2,
                    h = o + t.width,
                    a = e - t.height / 2,
                    s = a + t.height;
                return new PositionedIcon(t, a, s, o, h)
            }

            function PositionedIcon(t, i, n, e, o) {
                this.image = t, this.top = i, this.bottom = n, this.left = e, this.right = o
            }
            module.exports = {
                shapeText: shapeText,
                shapeIcon: shapeIcon
            };
            var breakable = {
                32: !0
            };
        }, {}],
        77: [function(require, module, exports) {
            "use strict";

            function SpriteAtlas(t, i) {
                this.width = t, this.height = i, this.bin = new BinPack(t, i), this.images = {}, this.data = !1, this.texture = 0, this.filter = 0, this.pixelRatio = 1, this.dirty = !0
            }

            function copyBitmap(t, i, e, h, a, s, r, o, n, l, p) {
                var d, c, x = h * i + e,
                    f = o * s + r;
                if (p)
                    for (f -= s, c = -1; l >= c; c++, x = ((c + l) % l + h) * i + e, f += s)
                        for (d = -1; n >= d; d++) a[f + d] = t[x + (d + n) % n];
                else
                    for (c = 0; l > c; c++, x += i, f += s)
                        for (d = 0; n > d; d++) a[f + d] = t[x + d]
            }

            function AtlasImage(t, i, e, h) {
                this.rect = t, this.width = i, this.height = e, this.sdf = h
            }
            var BinPack = require("./bin_pack");
            module.exports = SpriteAtlas, SpriteAtlas.prototype = {get debug() {
                    return "canvas" in this
                },
                set debug(t) {
                    t && !this.canvas ? (this.canvas = document.createElement("canvas"), this.canvas.width = this.width * this.pixelRatio, this.canvas.height = this.height * this.pixelRatio, this.canvas.style.width = this.width + "px", this.canvas.style.width = this.width + "px", document.body.appendChild(this.canvas), this.ctx = this.canvas.getContext("2d")) : !t && this.canvas && (this.canvas.parentNode.removeChild(this.canvas), delete this.ctx, delete this.canvas)
                }
            }, SpriteAtlas.prototype.resize = function(t) {
                if (this.pixelRatio === t) return !1;
                var i = this.pixelRatio;
                if (this.pixelRatio = t, this.canvas && (this.canvas.width = this.width * this.pixelRatio, this.canvas.height = this.height * this.pixelRatio), this.data) {
                    var e = this.data;
                    this.data = !1, this.allocate(), this.texture = !1;
                    for (var h = this.width * i, a = this.height * i, s = this.width * t, r = this.height * t, o = this.data, n = e, l = 0; r > l; l++)
                        for (var p = Math.floor(l * a / r) * h, d = l * s, c = 0; s > c; c++) {
                            var x = Math.floor(c * h / s);
                            o[d + c] = n[p + x]
                        }
                    e = null, this.dirty = !0
                }
                return this.dirty
            }, SpriteAtlas.prototype.allocateImage = function(t, i) {
                var e = 2,
                    h = t + e + (4 - (t + e) % 4),
                    a = i + e + (4 - (i + e) % 4),
                    s = this.bin.allocate(h, a);
                return 0 === s.w ? s : (s.originalWidth = t, s.originalHeight = i, s)
            }, SpriteAtlas.prototype.getImage = function(t, i) {
                if (this.images[t]) return this.images[t];
                if (!this.sprite) return null;
                var e = this.sprite.getSpritePosition(t);
                if (!e.width || !e.height) return null;
                var h = e.width / e.pixelRatio,
                    a = e.height / e.pixelRatio,
                    s = this.allocateImage(h, a);
                if (0 === s.w) return s;
                var r = new AtlasImage(s, h, a, e.sdf);
                return this.images[t] = r, this.copy(s, e, i), r
            }, SpriteAtlas.prototype.getPosition = function(t, i) {
                var e = this.getImage(t, i),
                    h = e && e.rect;
                if (!h) return null;
                var a = i ? e.width : h.w,
                    s = i ? e.height : h.h,
                    r = 1;
                return {
                    size: [a, s],
                    tl: [(h.x + r) / this.width, (h.y + r) / this.height],
                    br: [(h.x + r + a) / this.width, (h.y + r + s) / this.height]
                }
            }, SpriteAtlas.prototype.allocate = function() {
                if (!this.data) {
                    var t = Math.floor(this.width * this.pixelRatio),
                        i = Math.floor(this.height * this.pixelRatio);
                    this.data = new Uint32Array(t * i);
                    for (var e = 0; e < this.data.length; e++) this.data[e] = 0
                }
            }, SpriteAtlas.prototype.copy = function(t, i, e) {
                if (this.sprite.img.data) {
                    var h = new Uint32Array(this.sprite.img.data.buffer);
                    this.allocate();
                    var a = this.data,
                        s = 1;
                    copyBitmap(h, this.sprite.img.width, i.x, i.y, a, this.width * this.pixelRatio, (t.x + s) * this.pixelRatio, (t.y + s) * this.pixelRatio, i.width, i.height, e), this.dirty = !0
                }
            }, SpriteAtlas.prototype.setSprite = function(t) {
                this.sprite = t
            }, SpriteAtlas.prototype.addIcons = function(t, i) {
                for (var e = 0; e < t.length; e++) this.getImage(t[e]);
                i(null, this.images)
            }, SpriteAtlas.prototype.bind = function(t, i) {
                var e = !1;
                this.texture ? t.bindTexture(t.TEXTURE_2D, this.texture) : (this.texture = t.createTexture(), t.bindTexture(t.TEXTURE_2D, this.texture), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_S, t.CLAMP_TO_EDGE), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_T, t.CLAMP_TO_EDGE), e = !0);
                var h = i ? t.LINEAR : t.NEAREST;
                if (h !== this.filter && (t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MIN_FILTER, h), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MAG_FILTER, h), this.filter = h), this.dirty && (this.allocate(), e ? t.texImage2D(t.TEXTURE_2D, 0, t.RGBA, this.width * this.pixelRatio, this.height * this.pixelRatio, 0, t.RGBA, t.UNSIGNED_BYTE, new Uint8Array(this.data.buffer)) : t.texSubImage2D(t.TEXTURE_2D, 0, 0, 0, this.width * this.pixelRatio, this.height * this.pixelRatio, t.RGBA, t.UNSIGNED_BYTE, new Uint8Array(this.data.buffer)), this.dirty = !1, this.ctx)) {
                    var a = this.ctx.getImageData(0, 0, this.width * this.pixelRatio, this.height * this.pixelRatio);
                    a.data.set(new Uint8ClampedArray(this.data.buffer)), this.ctx.putImageData(a, 0, 0), this.ctx.strokeStyle = "red";
                    for (var s = 0; s < this.bin.free.length; s++) {
                        var r = this.bin.free[s];
                        this.ctx.strokeRect(r.x * this.pixelRatio, r.y * this.pixelRatio, r.w * this.pixelRatio, r.h * this.pixelRatio)
                    }
                }
            };
        }, {
            "./bin_pack": 63
        }],
        78: [function(require, module, exports) {
            "use strict";
            var util = require("../util/util"),
                interpolate = require("../util/interpolate"),
                browser = require("../util/browser"),
                LngLat = require("../geo/lng_lat"),
                LngLatBounds = require("../geo/lng_lat_bounds"),
                Point = require("point-geometry"),
                Camera = module.exports = function() {};
            util.extend(Camera.prototype, {
                getCenter: function() {
                    return this.transform.center
                },
                setCenter: function(t) {
                    return this.jumpTo({
                        center: t
                    }), this
                },
                panBy: function(t, i) {
                    return this.panTo(this.transform.center, util.extend({
                        offset: Point.convert(t).mult(-1)
                    }, i)), this
                },
                panTo: function(t, i) {
                    this.stop(), t = LngLat.convert(t), i = util.extend({
                        duration: 500,
                        easing: util.ease,
                        offset: [0, 0]
                    }, i);
                    var e = this.transform,
                        n = Point.convert(i.offset).rotate(-e.angle),
                        o = e.point,
                        r = e.project(t).sub(n);
                    return i.noMoveStart || this.fire("movestart"), this._ease(function(t) {
                        e.center = e.unproject(o.add(r.sub(o).mult(t))), this.fire("move")
                    }, function() {
                        this.fire("moveend")
                    }, i), this
                },
                getZoom: function() {
                    return this.transform.zoom
                },
                setZoom: function(t) {
                    return this.jumpTo({
                        zoom: t
                    }), this
                },
                zoomTo: function(t, i) {
                    this.stop(), i = util.extend({
                        duration: 500
                    }, i), i.easing = this._updateEasing(i.duration, t, i.easing);
                    var e = this.transform,
                        n = e.center,
                        o = e.zoom;
                    return i.around ? n = LngLat.convert(i.around) : i.offset && (n = e.pointLocation(e.centerPoint.add(Point.convert(i.offset)))), i.animate === !1 && (i.duration = 0), this.zooming || (this.zooming = !0, this.fire("movestart")), this._ease(function(i) {
                        e.setZoomAround(interpolate(o, t, i), n), this.fire("move").fire("zoom")
                    }, function() {
                        this.ease = null, i.duration >= 200 && (this.zooming = !1, this.fire("moveend"))
                    }, i), i.duration < 200 && (clearTimeout(this._onZoomEnd), this._onZoomEnd = setTimeout(function() {
                        this.zooming = !1, this.fire("moveend")
                    }.bind(this), 200)), this
                },
                zoomIn: function(t) {
                    return this.zoomTo(this.getZoom() + 1, t), this
                },
                zoomOut: function(t) {
                    return this.zoomTo(this.getZoom() - 1, t), this
                },
                getBearing: function() {
                    return this.transform.bearing
                },
                setBearing: function(t) {
                    return this.jumpTo({
                        bearing: t
                    }), this
                },
                rotateTo: function(t, i) {
                    this.stop(), i = util.extend({
                        duration: 500,
                        easing: util.ease
                    }, i);
                    var e = this.transform,
                        n = this.getBearing(),
                        o = e.center;
                    return i.around ? o = LngLat.convert(i.around) : i.offset && (o = e.pointLocation(e.centerPoint.add(Point.convert(i.offset)))), t = this._normalizeBearing(t, n), this.rotating = !0, this.fire("movestart"), this._ease(function(i) {
                        e.setBearingAround(interpolate(n, t, i), o), this.fire("move").fire("rotate")
                    }, function() {
                        this.rotating = !1, this.fire("moveend")
                    }, i), this
                },
                resetNorth: function(t) {
                    return this.rotateTo(0, util.extend({
                        duration: 1e3
                    }, t)), this
                },
                snapToNorth: function(t) {
                    return Math.abs(this.getBearing()) < this.options.bearingSnap ? this.resetNorth(t) : this
                },
                getPitch: function() {
                    return this.transform.pitch
                },
                setPitch: function(t) {
                    return this.jumpTo({
                        pitch: t
                    }), this
                },
                fitBounds: function(t, i) {
                    i = util.extend({
                        padding: 0,
                        offset: [0, 0],
                        maxZoom: 1 / 0
                    }, i), t = LngLatBounds.convert(t);
                    var e = Point.convert(i.offset),
                        n = this.transform,
                        o = n.project(t.getNorthWest()),
                        r = n.project(t.getSouthEast()),
                        s = r.sub(o),
                        a = (n.width - 2 * i.padding - 2 * Math.abs(e.x)) / s.x,
                        h = (n.height - 2 * i.padding - 2 * Math.abs(e.y)) / s.y;
                    return i.center = n.unproject(o.add(r).div(2)), i.zoom = Math.min(n.scaleZoom(n.scale * Math.min(a, h)), i.maxZoom), i.bearing = 0, i.linear ? this.easeTo(i) : this.flyTo(i)
                },
                jumpTo: function(t) {
                    this.stop();
                    var i = this.transform,
                        e = !1,
                        n = !1,
                        o = !1;
                    return "center" in t && (i.center = LngLat.convert(t.center)), "zoom" in t && i.zoom !== +t.zoom && (e = !0, i.zoom = +t.zoom), "bearing" in t && i.bearing !== +t.bearing && (n = !0, i.bearing = +t.bearing), "pitch" in t && i.pitch !== +t.pitch && (o = !0, i.pitch = +t.pitch), this.fire("movestart").fire("move"), e && this.fire("zoom"), n && this.fire("rotate"), o && this.fire("pitch"), this.fire("moveend")
                },
                easeTo: function(t) {
                    this.stop(), t = util.extend({
                        offset: [0, 0],
                        duration: 500,
                        easing: util.ease
                    }, t);
                    var i = this.transform,
                        e = Point.convert(t.offset).rotate(-i.angle),
                        n = i.point,
                        o = this.getZoom(),
                        r = this.getBearing(),
                        s = this.getPitch(),
                        a = "zoom" in t ? +t.zoom : o,
                        h = "bearing" in t ? this._normalizeBearing(t.bearing, r) : r,
                        u = "pitch" in t ? +t.pitch : s,
                        f = i.zoomScale(a - o),
                        c = "center" in t ? i.project(LngLat.convert(t.center)).sub(e.div(f)) : n,
                        m = LngLat.convert(t.around);
                    return a !== o && (this.zooming = !0), r !== h && (this.rotating = !0), this.zooming && !m && (m = i.pointLocation(i.centerPoint.add(c.sub(n).div(1 - 1 / f)))), this.fire("movestart"), this._ease(function(t) {
                        this.zooming ? i.setZoomAround(interpolate(o, a, t), m) : i.center = i.unproject(n.add(c.sub(n).mult(t))), this.rotating && (i.bearing = interpolate(r, h, t)), u !== s && (i.pitch = interpolate(s, u, t)), this.fire("move"), this.zooming && this.fire("zoom"), this.rotating && this.fire("rotate")
                    }, function() {
                        this.zooming = !1, this.rotating = !1, this.fire("moveend")
                    }, t), this
                },
                flyTo: function(t) {
                    function i(t) {
                        var i = (z * z - b * b + (t ? -1 : 1) * M * M * _ * _) / (2 * (t ? z : b) * M * _);
                        return Math.log(Math.sqrt(i * i + 1) - i)
                    }

                    function e(t) {
                        return (Math.exp(t) - Math.exp(-t)) / 2
                    }

                    function n(t) {
                        return (Math.exp(t) + Math.exp(-t)) / 2
                    }

                    function o(t) {
                        return e(t) / n(t)
                    }
                    this.stop(), t = util.extend({
                        offset: [0, 0],
                        speed: 1.2,
                        curve: 1.42,
                        easing: util.ease
                    }, t);
                    var r = this.transform,
                        s = Point.convert(t.offset),
                        a = this.getZoom(),
                        h = this.getBearing(),
                        u = "center" in t ? LngLat.convert(t.center) : this.getCenter(),
                        f = "zoom" in t ? +t.zoom : a,
                        c = "bearing" in t ? this._normalizeBearing(t.bearing, h) : h,
                        m = r.zoomScale(f - a),
                        g = r.point,
                        d = r.project(u).sub(s.div(m)),
                        p = r.worldSize,
                        l = t.curve,
                        v = t.speed,
                        b = Math.max(r.width, r.height),
                        z = b / m,
                        _ = d.sub(g).mag(),
                        M = l * l,
                        L = i(0),
                        x = function(t) {
                            return n(L) / n(L + l * t)
                        },
                        T = function(t) {
                            return b * ((n(L) * o(L + l * t) - e(L)) / M) / _
                        },
                        B = (i(1) - L) / l;
                    if (Math.abs(_) < 1e-6) {
                        if (Math.abs(b - z) < 1e-6) return this;
                        var j = b > z ? -1 : 1;
                        B = Math.abs(Math.log(z / b)) / l, T = function() {
                            return 0
                        }, x = function(t) {
                            return Math.exp(j * l * t)
                        }
                    }
                    return t.duration = 1e3 * B / v, this.zooming = !0, h !== c && (this.rotating = !0), this.fire("movestart"), this._ease(function(t) {
                        var i = t * B,
                            e = T(i);
                        r.zoom = a + r.scaleZoom(1 / x(i)), r.center = r.unproject(g.add(d.sub(g).mult(e)), p), c !== h && (r.bearing = interpolate(h, c, t)), this.fire("move").fire("zoom"), c !== h && this.fire("rotate")
                    }, function() {
                        this.zooming = !1, this.rotating = !1, this.fire("moveend")
                    }, t), this
                },
                isEasing: function() {
                    return !!this._abortFn
                },
                stop: function() {
                    return this._abortFn && (this._abortFn.call(this), this._finishEase()), this
                },
                _ease: function(t, i, e) {
                    this._finishFn = i, this._abortFn = browser.timed(function(i) {
                        t.call(this, e.easing(i)), 1 === i && this._finishEase()
                    }, e.animate === !1 ? 0 : e.duration, this)
                },
                _finishEase: function() {
                    delete this._abortFn;
                    var t = this._finishFn;
                    delete this._finishFn, t.call(this)
                },
                _normalizeBearing: function(t, i) {
                    t = util.wrap(t, -180, 180);
                    var e = Math.abs(t - i);
                    return Math.abs(t - 360 - i) < e && (t -= 360), Math.abs(t + 360 - i) < e && (t += 360), t
                },
                _updateEasing: function(t, i, e) {
                    var n;
                    if (this.ease) {
                        var o = this.ease,
                            r = (Date.now() - o.start) / o.duration,
                            s = o.easing(r + .01) - o.easing(r),
                            a = .27 / Math.sqrt(s * s + 1e-4) * .01,
                            h = Math.sqrt(.0729 - a * a);
                        n = util.bezier(a, h, .25, 1)
                    } else n = e ? util.bezier.apply(util, e) : util.ease;
                    return this.ease = {
                        start: (new Date).getTime(),
                        to: Math.pow(2, i),
                        duration: t,
                        easing: n
                    }, n
                }
            });
        }, {
            "../geo/lng_lat": 20,
            "../geo/lng_lat_bounds": 21,
            "../util/browser": 95,
            "../util/interpolate": 102,
            "../util/util": 106,
            "point-geometry": 137
        }],
        79: [function(require, module, exports) {
            "use strict";

            function Attribution() {}
            var Control = require("./control"),
                DOM = require("../../util/dom"),
                util = require("../../util/util");
            module.exports = Attribution, Attribution.prototype = util.inherit(Control, {
                options: {
                    position: "bottom-right"
                },
                onAdd: function(t) {
                    var i = "mapboxgl-ctrl-attrib",
                        e = this._container = DOM.create("div", i, t.getContainer());
                    return this._update(), t.on("source.load", this._update.bind(this)), t.on("source.change", this._update.bind(this)), t.on("source.remove", this._update.bind(this)), t.on("moveend", this._updateEditLink.bind(this)), e
                },
                _update: function() {
                    var t = [];
                    if (this._map.style)
                        for (var i in this._map.style.sources) {
                            var e = this._map.style.sources[i];
                            e.attribution && t.indexOf(e.attribution) < 0 && t.push(e.attribution)
                        }
                    this._container.innerHTML = t.join(" | "), this._editLink = this._container.getElementsByClassName("mapbox-improve-map")[0], this._updateEditLink()
                },
                _updateEditLink: function() {
                    if (this._editLink) {
                        var t = this._map.getCenter();
                        this._editLink.href = "https://www.mapbox.com/map-feedback/#/" + t.lng + "/" + t.lat + "/" + Math.round(this._map.getZoom() + 1)
                    }
                }
            });
        }, {
            "../../util/dom": 98,
            "../../util/util": 106,
            "./control": 80
        }],
        80: [function(require, module, exports) {
            "use strict";

            function Control() {}
            module.exports = Control, Control.prototype = {
                addTo: function(o) {
                    this._map = o;
                    var t = this._container = this.onAdd(o);
                    if (this.options && this.options.position) {
                        var i = this.options.position,
                            n = o._controlCorners[i];
                        t.className += " mapboxgl-ctrl", -1 !== i.indexOf("bottom") ? n.insertBefore(t, n.firstChild) : n.appendChild(t)
                    }
                    return this
                },
                remove: function() {
                    return this._container.parentNode.removeChild(this._container), this.onRemove && this.onRemove(this._map), this._map = null, this
                }
            };
        }, {}],
        81: [function(require, module, exports) {
            "use strict";

            function Navigation(t) {
                util.setOptions(this, t)
            }
            var Control = require("./control"),
                DOM = require("../../util/dom"),
                util = require("../../util/util");
            module.exports = Navigation, Navigation.prototype = util.inherit(Control, {
                options: {
                    position: "top-right"
                },
                onAdd: function(t) {
                    var o = "mapboxgl-ctrl",
                        s = this._container = DOM.create("div", o + "-group", t.getContainer());
                    this._zoomInButton = this._createButton(o + "-icon " + o + "-zoom-in", t.zoomIn.bind(t)), this._zoomOutButton = this._createButton(o + "-icon " + o + "-zoom-out", t.zoomOut.bind(t)), this._compass = this._createButton(o + "-compass", t.resetNorth.bind(t));
                    var e = this._compassCanvas = DOM.create("canvas", o + "-compass-canvas", this._compass);
                    return e.style.cssText = "width:30px; height:30px;", e.width = 52, e.height = 52, this._compass.addEventListener("mousedown", this._onCompassDown.bind(this)), this._onCompassMove = this._onCompassMove.bind(this), this._onCompassUp = this._onCompassUp.bind(this), this._compassCtx = e.getContext("2d"), t.on("rotate", this._drawNorth.bind(this)), this._drawNorth(), s
                },
                _onCompassDown: function(t) {
                    DOM.disableDrag(), document.addEventListener("mousemove", this._onCompassMove), document.addEventListener("mouseup", this._onCompassUp), this._prevX = t.screenX, t.stopPropagation()
                },
                _onCompassMove: function(t) {
                    var o = t.screenX,
                        s = 2 > o ? -5 : o > window.screen.width - 2 ? 5 : (o - this._prevX) / 4;
                    this._map.setBearing(this._map.getBearing() - s), this._prevX = t.screenX, this._moved = !0, t.preventDefault()
                },
                _onCompassUp: function() {
                    document.removeEventListener("mousemove", this._onCompassMove), document.removeEventListener("mouseup", this._onCompassUp), DOM.enableDrag(), this._moved && (this._moved = !1, DOM.suppressClick()), this._map.snapToNorth()
                },
                _createButton: function(t, o) {
                    var s = DOM.create("button", t, this._container);
                    return s.addEventListener("click", function() {
                        o()
                    }), s
                },
                _drawNorth: function() {
                    var t = 20,
                        o = 8,
                        s = 26,
                        e = this._map.transform.angle + Math.PI / 2,
                        i = this._compassCtx;
                    this._compassCanvas.width = this._compassCanvas.width, i.translate(s, s), i.rotate(e), i.beginPath(), i.fillStyle = "#000", i.lineTo(0, -o), i.lineTo(-t, 0), i.lineTo(0, o), i.fill(), i.beginPath(), i.fillStyle = "#bbb", i.moveTo(0, 0), i.lineTo(0, o), i.lineTo(t, 0), i.lineTo(0, -o), i.fill(), i.beginPath(), i.strokeStyle = "#fff", i.lineWidth = 4, i.moveTo(0, -o), i.lineTo(0, o), i.stroke()
                }
            });
        }, {
            "../../util/dom": 98,
            "../../util/util": 106,
            "./control": 80
        }],
        82: [function(require, module, exports) {
            "use strict";

            function BoxZoom(o) {
                this._map = o, this._el = o.getCanvasContainer(), this._container = o.getContainer(), util.bindHandlers(this)
            }
            var DOM = require("../../util/dom"),
                LngLatBounds = require("../../geo/lng_lat_bounds"),
                util = require("../../util/util");
            module.exports = BoxZoom, BoxZoom.prototype = {
                enable: function() {
                    this._el.addEventListener("mousedown", this._onMouseDown, !1)
                },
                disable: function() {
                    this._el.removeEventListener("mousedown", this._onMouseDown)
                },
                _onMouseDown: function(o) {
                    (o.shiftKey || 1 === o.which && 1 === o.button) && (document.addEventListener("mousemove", this._onMouseMove, !1), document.addEventListener("keydown", this._onKeyDown, !1), document.addEventListener("mouseup", this._onMouseUp, !1), this._startPos = DOM.mousePos(this._el, o), this.active = !0)
                },
                _onMouseMove: function(o) {
                    var e = this._startPos,
                        t = DOM.mousePos(this._el, o);
                    this._box || (this._box = DOM.create("div", "mapboxgl-boxzoom", this._container), this._container.classList.add("mapboxgl-crosshair"), DOM.disableDrag(), this._map.fire("boxzoomstart"));
                    var s = Math.min(e.x, t.x),
                        n = Math.max(e.x, t.x),
                        i = Math.min(e.y, t.y),
                        a = Math.max(e.y, t.y);
                    DOM.setTransform(this._box, "translate(" + s + "px," + i + "px)"), this._box.style.width = n - s + "px", this._box.style.height = a - i + "px"
                },
                _onMouseUp: function(o) {
                    var e = this._startPos,
                        t = DOM.mousePos(this._el, o),
                        s = new LngLatBounds(this._map.unproject(e), this._map.unproject(t));
                    this._finish(), this._map.fitBounds(s, {
                        linear: !0
                    }).fire("boxzoomend", {
                        boxZoomBounds: s
                    })
                },
                _onKeyDown: function(o) {
                    27 === o.keyCode && (this._finish(), this._map.fire("boxzoomcancel"))
                },
                _finish: function() {
                    this._box && (this.active = !1, document.removeEventListener("mousemove", this._onMouseMove, !1), document.removeEventListener("keydown", this._onKeyDown, !1), document.removeEventListener("mouseup", this._onMouseUp, !1), this._container.classList.remove("mapboxgl-crosshair"), this._box.parentNode.removeChild(this._box), this._box = null, DOM.enableDrag())
                }
            };
        }, {
            "../../geo/lng_lat_bounds": 21,
            "../../util/dom": 98,
            "../../util/util": 106
        }],
        83: [function(require, module, exports) {
            "use strict";

            function DoubleClickZoom(o) {
                this._map = o, this._onDblClick = this._onDblClick.bind(this)
            }
            module.exports = DoubleClickZoom, DoubleClickZoom.prototype = {
                enable: function() {
                    this._map.on("dblclick", this._onDblClick)
                },
                disable: function() {
                    this._map.off("dblclick", this._onDblClick)
                },
                _onDblClick: function(o) {
                    this._map.zoomTo(Math.round(this._map.getZoom()) + 1, {
                        around: o.lngLat
                    })
                }
            };
        }, {}],
        84: [function(require, module, exports) {
            "use strict";

            function DragPan(e) {
                this._map = e, this._el = e.getCanvasContainer(), util.bindHandlers(this)
            }
            var DOM = require("../../util/dom"),
                util = require("../../util/util");
            module.exports = DragPan;
            var inertiaLinearity = .25,
                inertiaEasing = util.bezier(0, 0, inertiaLinearity, 1),
                inertiaMaxSpeed = 3e3,
                inertiaDeceleration = 4e3;
            DragPan.prototype = {
                enable: function() {
                    this._el.addEventListener("mousedown", this._onDown, !1), this._el.addEventListener("touchstart", this._onDown, !1)
                },
                disable: function() {
                    this._el.removeEventListener("mousedown", this._onDown), this._el.removeEventListener("touchstart", this._onDown)
                },
                _onDown: function(e) {
                    this._startPos = this._pos = DOM.mousePos(this._el, e), this._inertia = [
                        [Date.now(), this._pos]
                    ], e.touches ? 1 === e.touches.length && (document.addEventListener("touchmove", this._onMove, !1), document.addEventListener("touchend", this._onTouchEnd, !1)) : (document.addEventListener("mousemove", this._onMove, !1), document.addEventListener("mouseup", this._onMouseUp, !1))
                },
                _onMove: function(e) {
                    var t = this._map;
                    if (!(t.boxZoom.active || t.dragRotate.active || e.touches && e.touches.length > 1)) {
                        var n = DOM.mousePos(this._el, e),
                            i = this._inertia,
                            o = Date.now();
                        for (i.push([o, n]); i.length > 2 && o - i[0][0] > 50;) i.shift();
                        t.stop(), t.transform.setLocationAtPoint(t.transform.pointLocation(this._pos), n), t.fire("move"), this._pos = n, e.preventDefault()
                    }
                },
                _onUp: function() {
                    var e = this._inertia;
                    if (e.length < 2) return void this._map.fire("moveend");
                    var t = e[e.length - 1],
                        n = e[0],
                        i = t[1].sub(n[1]),
                        o = (t[0] - n[0]) / 1e3,
                        s = i.mult(inertiaLinearity / o),
                        r = s.mag();
                    r > inertiaMaxSpeed && (r = inertiaMaxSpeed, s._unit()._mult(r));
                    var a = r / (inertiaDeceleration * inertiaLinearity),
                        u = s.mult(-a / 2);
                    this._map.panBy(u, {
                        duration: 1e3 * a,
                        easing: inertiaEasing,
                        noMoveStart: !0
                    })
                },
                _onMouseUp: function() {
                    this._onUp(), document.removeEventListener("mousemove", this._onMove, !1), document.removeEventListener("mouseup", this._onMouseUp, !1)
                },
                _onTouchEnd: function() {
                    this._onUp(), document.removeEventListener("touchmove", this._onMove), document.removeEventListener("touchend", this._onTouchEnd)
                }
            };
        }, {
            "../../util/dom": 98,
            "../../util/util": 106
        }],
        85: [function(require, module, exports) {
            "use strict";

            function DragRotate(t) {
                this._map = t, this._el = t.getCanvasContainer(), util.bindHandlers(this)
            }
            var DOM = require("../../util/dom"),
                Point = require("point-geometry"),
                util = require("../../util/util");
            module.exports = DragRotate, DragRotate.prototype = {
                enable: function() {
                    this._el.addEventListener("contextmenu", this._onContextMenu, !1)
                },
                disable: function() {
                    this._el.removeEventListener("contextmenu", this._onContextMenu)
                },
                _onContextMenu: function(t) {
                    this._map.stop(), this.active = !0, this._startPos = this._pos = DOM.mousePos(this._el, t), document.addEventListener("mousemove", this._onMouseMove, !1), document.addEventListener("mouseup", this._onMouseUp, !1), t.preventDefault()
                },
                _onMouseMove: function(t) {
                    var e = this._startPos,
                        o = this._pos,
                        n = DOM.mousePos(this._el, t),
                        i = this._map,
                        s = i.transform.centerPoint,
                        r = e.sub(s),
                        u = r.mag();
                    i.rotating || (i.fire("movestart"), i.rotating = !0), 200 > u && (s = e.add(new Point(-200, 0)._rotate(r.angle())));
                    var a = o.sub(s).angleWith(n.sub(s)) / Math.PI * 180;
                    i.transform.bearing = i.getBearing() - a, i.fire("move").fire("rotate"), clearTimeout(this._timeout), this._timeout = setTimeout(this._onTimeout, 200), this._pos = n
                },
                _onTimeout: function() {
                    var t = this._map;
                    t.rotating = !1, t.snapToNorth(), t.rotating || (t._rerender(), t.fire("moveend"))
                },
                _onMouseUp: function() {
                    this.active = !1, document.removeEventListener("mousemove", this._onMouseMove, !1), document.removeEventListener("mouseup", this._onMouseUp, !1)
                }
            };
        }, {
            "../../util/dom": 98,
            "../../util/util": 106,
            "point-geometry": 137
        }],
        86: [function(require, module, exports) {
            "use strict";

            function Keyboard(e) {
                this._map = e, this._el = e.getCanvasContainer(), this._onKeyDown = this._onKeyDown.bind(this)
            }
            module.exports = Keyboard;
            var panDelta = 80,
                rotateDelta = 2;
            Keyboard.prototype = {
                enable: function() {
                    this._el.addEventListener("keydown", this._onKeyDown, !1)
                },
                disable: function() {
                    this._el.removeEventListener("keydown", this._onKeyDown)
                },
                _onKeyDown: function(e) {
                    if (!(e.altKey || e.ctrlKey || e.metaKey)) {
                        var a = this._map;
                        switch (e.keyCode) {
                            case 61:
                            case 107:
                            case 171:
                            case 187:
                                a.zoomTo(Math.round(a.getZoom()) + (e.shiftKey ? 2 : 1));
                                break;
                            case 189:
                            case 109:
                            case 173:
                                a.zoomTo(Math.round(a.getZoom()) - (e.shiftKey ? 2 : 1));
                                break;
                            case 37:
                                e.shiftKey ? a.setBearing(a.getBearing() - rotateDelta) : a.panBy([-panDelta, 0]);
                                break;
                            case 39:
                                e.shiftKey ? a.setBearing(a.getBearing() + rotateDelta) : a.panBy([panDelta, 0]);
                                break;
                            case 38:
                                a.panBy([0, -panDelta]);
                                break;
                            case 40:
                                a.panBy([0, panDelta])
                        }
                    }
                }
            };
        }, {}],
        87: [function(require, module, exports) {
            "use strict";

            function Pinch(t) {
                this._map = t, this._el = t.getCanvasContainer(), util.bindHandlers(this)
            }
            var DOM = require("../../util/dom"),
                util = require("../../util/util");
            module.exports = Pinch, Pinch.prototype = {
                enable: function() {
                    this._el.addEventListener("touchstart", this._onStart, !1)
                },
                disable: function() {
                    this._el.removeEventListener("touchstart", this._onStart)
                },
                _onStart: function(t) {
                    if (2 === t.touches.length) {
                        var e = DOM.mousePos(this._el, t.touches[0]),
                            s = DOM.mousePos(this._el, t.touches[1]);
                        this._startVec = e.sub(s), this._startScale = this._map.transform.scale, this._startBearing = this._map.transform.bearing, document.addEventListener("touchmove", this._onMove, !1), document.addEventListener("touchend", this._onEnd, !1)
                    }
                },
                _onMove: function(t) {
                    if (2 === t.touches.length) {
                        var e = DOM.mousePos(this._el, t.touches[0]),
                            s = DOM.mousePos(this._el, t.touches[1]),
                            n = e.add(s).div(2),
                            o = e.sub(s),
                            i = o.mag() / this._startVec.mag(),
                            a = 180 * o.angleWith(this._startVec) / Math.PI,
                            r = this._map;
                        r.easeTo({
                            zoom: r.transform.scaleZoom(this._startScale * i),
                            bearing: this._startBearing + a,
                            duration: 0,
                            around: r.unproject(n)
                        }), t.preventDefault()
                    }
                },
                _onEnd: function() {
                    this._map.snapToNorth(), document.removeEventListener("touchmove", this._onMove), document.removeEventListener("touchend", this._onEnd)
                }
            };
        }, {
            "../../util/dom": 98,
            "../../util/util": 106
        }],
        88: [function(require, module, exports) {
            "use strict";

            function ScrollZoom(e) {
                this._map = e, this._el = e.getCanvasContainer(), util.bindHandlers(this)
            }
            var DOM = require("../../util/dom"),
                browser = require("../../util/browser"),
                util = require("../../util/util");
            module.exports = ScrollZoom;
            var ua = "undefined" != typeof navigator ? navigator.userAgent.toLowerCase() : "",
                firefox = -1 !== ua.indexOf("firefox"),
                safari = -1 !== ua.indexOf("safari") && -1 === ua.indexOf("chrom");
            ScrollZoom.prototype = {
                enable: function() {
                    this._el.addEventListener("wheel", this._onWheel, !1), this._el.addEventListener("mousewheel", this._onWheel, !1)
                },
                disable: function() {
                    this._el.removeEventListener("wheel", this._onWheel), this._el.removeEventListener("mousewheel", this._onWheel)
                },
                _onWheel: function(e) {
                    var t;
                    "wheel" === e.type ? (t = e.deltaY, firefox && e.deltaMode === window.WheelEvent.DOM_DELTA_PIXEL && (t /= browser.devicePixelRatio), e.deltaMode === window.WheelEvent.DOM_DELTA_LINE && (t *= 40)) : "mousewheel" === e.type && (t = -e.wheelDeltaY, safari && (t /= 3));
                    var i = (window.performance || Date).now(),
                        o = i - (this._time || 0);
                    this._pos = DOM.mousePos(this._el, e), this._time = i, 0 !== t && t % 4.000244140625 === 0 ? (this._type = "wheel", t = Math.floor(t / 4)) : 0 !== t && Math.abs(t) < 4 ? this._type = "trackpad" : o > 400 ? (this._type = null, this._lastValue = t, this._timeout = setTimeout(this._onTimeout, 40)) : this._type || (this._type = Math.abs(o * t) < 200 ? "trackpad" : "wheel", this._timeout && (clearTimeout(this._timeout), this._timeout = null, t += this._lastValue)), e.shiftKey && t && (t /= 4), this._type && this._zoom(-t), e.preventDefault()
                },
                _onTimeout: function() {
                    this._type = "wheel", this._zoom(-this._lastValue)
                },
                _zoom: function(e) {
                    var t = this._map,
                        i = 2 / (1 + Math.exp(-Math.abs(e / 100)));
                    0 > e && 0 !== i && (i = 1 / i);
                    var o = t.ease ? t.ease.to : t.transform.scale,
                        s = t.transform.scaleZoom(o * i);
                    t.zoomTo(s, {
                        duration: 0,
                        around: t.unproject(this._pos)
                    })
                }
            };
        }, {
            "../../util/browser": 95,
            "../../util/dom": 98,
            "../../util/util": 106
        }],
        89: [function(require, module, exports) {
            "use strict";

            function Hash() {
                util.bindAll(["_onHashChange", "_updateHash"], this)
            }
            module.exports = Hash;
            var util = require("../util/util");
            Hash.prototype = {
                addTo: function(t) {
                    return this._map = t, window.addEventListener("hashchange", this._onHashChange, !1), this._map.on("moveend", this._updateHash), this
                },
                remove: function() {
                    return window.removeEventListener("hashchange", this._onHashChange, !1), this._map.off("moveend", this._updateHash), delete this._map, this
                },
                _onHashChange: function() {
                    var t = location.hash.replace("#", "").split("/");
                    return t.length >= 3 ? (this._map.jumpTo({
                        center: [+t[2], +t[1]],
                        zoom: +t[0],
                        bearing: +(t[3] || 0)
                    }), !0) : !1
                },
                _updateHash: function() {
                    var t = this._map.getCenter(),
                        e = this._map.getZoom(),
                        a = this._map.getBearing(),
                        h = Math.max(0, Math.ceil(Math.log(e) / Math.LN2)),
                        n = "#" + Math.round(100 * e) / 100 + "/" + t.lat.toFixed(h) + "/" + t.lng.toFixed(h) + (a ? "/" + Math.round(10 * a) / 10 : "");
                    window.history.replaceState("", "", n)
                }
            };
        }, {
            "../util/util": 106
        }],
        90: [function(require, module, exports) {
            "use strict";

            function Interaction(e) {
                this._map = e, this._el = e.getCanvasContainer();
                for (var t in handlers) e[t] = new handlers[t](e);
                util.bindHandlers(this)
            }
            var handlers = {
                    scrollZoom: require("./handler/scroll_zoom"),
                    boxZoom: require("./handler/box_zoom"),
                    dragRotate: require("./handler/drag_rotate"),
                    dragPan: require("./handler/drag_pan"),
                    keyboard: require("./handler/keyboard"),
                    doubleClickZoom: require("./handler/dblclick_zoom"),
                    pinch: require("./handler/pinch")
                },
                DOM = require("../util/dom"),
                util = require("../util/util");
            module.exports = Interaction, Interaction.prototype = {
                enable: function() {
                    var e = this._map.options,
                        t = this._el;
                    for (var i in handlers) e[i] && this._map[i].enable();
                    t.addEventListener("mousedown", this._onMouseDown, !1), t.addEventListener("touchstart", this._onTouchStart, !1), t.addEventListener("click", this._onClick, !1), t.addEventListener("mousemove", this._onMouseMove, !1), t.addEventListener("dblclick", this._onDblClick, !1)
                },
                disable: function() {
                    var e = this._map.options,
                        t = this._el;
                    for (var i in handlers) e[i] && this._map[i].disable();
                    t.removeEventListener("mousedown", this._onMouseDown), t.removeEventListener("touchstart", this._onTouchStart), t.removeEventListener("click", this._onClick), t.removeEventListener("mousemove", this._onMouseMove), t.removeEventListener("dblclick", this._onDblClick)
                },
                _onMouseDown: function(e) {
                    this._startPos = DOM.mousePos(this._el, e)
                },
                _onTouchStart: function(e) {
                    !e.touches || e.touches.length > 1 || (this._tapped ? (clearTimeout(this._tapped), this._tapped = null, this._fireEvent("dblclick", e)) : this._tapped = setTimeout(this._onTimeout, 300))
                },
                _onTimeout: function() {
                    this._tapped = null
                },
                _onMouseMove: function(e) {
                    var t = this._map,
                        i = this._el;
                    if (!t.dragPan.active && !t.dragRotate.active) {
                        for (var o = e.toElement || e.target; o && o !== i;) o = o.parentNode;
                        o === i && this._fireEvent("mousemove", e)
                    }
                },
                _onClick: function(e) {
                    var t = DOM.mousePos(this._el, e);
                    t.equals(this._startPos) && this._fireEvent("click", e)
                },
                _onDblClick: function(e) {
                    this._fireEvent("dblclick", e), e.preventDefault()
                },
                _fireEvent: function(e, t) {
                    var i = DOM.mousePos(this._el, t);
                    this._map.fire(e, {
                        lngLat: this._map.unproject(i),
                        point: i,
                        originalEvent: t
                    })
                }
            };
        }, {
            "../util/dom": 98,
            "../util/util": 106,
            "./handler/box_zoom": 82,
            "./handler/dblclick_zoom": 83,
            "./handler/drag_pan": 84,
            "./handler/drag_rotate": 85,
            "./handler/keyboard": 86,
            "./handler/pinch": 87,
            "./handler/scroll_zoom": 88
        }],
        91: [function(require, module, exports) {
            "use strict";
            var Canvas = require("../util/canvas"),
                util = require("../util/util"),
                browser = require("../util/browser"),
                Evented = require("../util/evented"),
                DOM = require("../util/dom"),
                Style = require("../style/style"),
                AnimationLoop = require("../style/animation_loop"),
                Painter = require("../render/painter"),
                Transform = require("../geo/transform"),
                Hash = require("./hash"),
                Interaction = require("./interaction"),
                Camera = require("./camera"),
                LngLat = require("../geo/lng_lat"),
                LngLatBounds = require("../geo/lng_lat_bounds"),
                Point = require("point-geometry"),
                Attribution = require("./control/attribution"),
                Map = module.exports = function(t) {
                    if (t = this.options = util.inherit(this.options, t), this.animationLoop = new AnimationLoop, this.transform = new Transform(t.minZoom, t.maxZoom), t.maxBounds) {
                        var e = LngLatBounds.convert(t.maxBounds);
                        this.transform.lngRange = [e.getWest(), e.getEast()], this.transform.latRange = [e.getSouth(), e.getNorth()]
                    }
                    util.bindAll(["_forwardStyleEvent", "_forwardSourceEvent", "_forwardLayerEvent", "_forwardTileEvent", "_onStyleLoad", "_onStyleChange", "_onSourceAdd", "_onSourceRemove", "_onSourceUpdate", "_onWindowResize", "onError", "update", "render"], this), this._setupContainer(), this._setupPainter(), this.on("move", this.update), this.on("zoom", this.update.bind(this, !0)), this.on("moveend", function() {
                        this.animationLoop.set(300), this._rerender()
                    }.bind(this)), "undefined" != typeof window && window.addEventListener("resize", this._onWindowResize, !1), this.interaction = new Interaction(this), t.interactive && this.interaction.enable(), this._hash = t.hash && (new Hash).addTo(this), this._hash && this._hash._onHashChange() || this.jumpTo(t), this.sources = {}, this.stacks = {}, this._classes = {}, this.resize(), t.classes && this.setClasses(t.classes), t.style && this.setStyle(t.style), t.attributionControl && this.addControl(new Attribution), this.on("style.error", this.onError), this.on("source.error", this.onError), this.on("tile.error", this.onError)
                };
            util.extend(Map.prototype, Evented), util.extend(Map.prototype, Camera.prototype), util.extend(Map.prototype, {
                options: {
                    center: [0, 0],
                    zoom: 0,
                    bearing: 0,
                    pitch: 0,
                    minZoom: 0,
                    maxZoom: 20,
                    interactive: !0,
                    scrollZoom: !0,
                    boxZoom: !0,
                    dragRotate: !0,
                    dragPan: !0,
                    keyboard: !0,
                    doubleClickZoom: !0,
                    pinch: !0,
                    bearingSnap: 7,
                    hash: !1,
                    attributionControl: !0,
                    failIfMajorPerformanceCaveat: !1,
                    preserveDrawingBuffer: !1
                },
                addControl: function(t) {
                    return t.addTo(this), this
                },
                addClass: function(t, e) {
                    this._classes[t] || (this._classes[t] = !0, this.style && this.style._cascade(this._classes, e))
                },
                removeClass: function(t, e) {
                    this._classes[t] && (delete this._classes[t], this.style && this.style._cascade(this._classes, e))
                },
                setClasses: function(t, e) {
                    this._classes = {};
                    for (var i = 0; i < t.length; i++) this._classes[t[i]] = !0;
                    this.style && this.style._cascade(this._classes, e)
                },
                hasClass: function(t) {
                    return !!this._classes[t]
                },
                getClasses: function() {
                    return Object.keys(this._classes)
                },
                resize: function() {
                    var t = 0,
                        e = 0;
                    return this._container && (t = this._container.offsetWidth || 400, e = this._container.offsetHeight || 300), this._canvas.resize(t, e), this.transform.width = t, this.transform.height = e, this.transform._constrain(), this.painter.resize(t, e), this.fire("movestart").fire("move").fire("resize").fire("moveend")
                },
                getBounds: function() {
                    return new LngLatBounds(this.transform.pointLocation(new Point(0, 0)), this.transform.pointLocation(this.transform.size))
                },
                project: function(t) {
                    return this.transform.locationPoint(LngLat.convert(t))
                },
                unproject: function(t) {
                    return this.transform.pointLocation(Point.convert(t))
                },
                featuresAt: function(t, e, i) {
                    var r = this.unproject(t).wrap(),
                        s = this.transform.locationCoordinate(r);
                    return this.style.featuresAt(s, e, i), this
                },
                featuresIn: function(t, e, i) {
                    return "undefined" == typeof i && (i = e, e = t, t = [Point.convert([0, 0]), Point.convert([this.transform.width, this.transform.height])]), t = t.map(Point.convert.bind(Point)), t = [new Point(Math.min(t[0].x, t[1].x), Math.min(t[0].y, t[1].y)), new Point(Math.max(t[0].x, t[1].x), Math.max(t[0].y, t[1].y))].map(this.transform.pointCoordinate.bind(this.transform)), this.style.featuresIn(t, e, i), this
                },
                batch: function(t) {
                    this.style.batch(t), this.style._cascade(this._classes), this.update(!0)
                },
                setStyle: function(t) {
                    return this.style && (this.style.off("load", this._onStyleLoad).off("error", this._forwardStyleEvent).off("change", this._onStyleChange).off("source.add", this._onSourceAdd).off("source.remove", this._onSourceRemove).off("source.load", this._onSourceUpdate).off("source.error", this._forwardSourceEvent).off("source.change", this._onSourceUpdate).off("layer.add", this._forwardLayerEvent).off("layer.remove", this._forwardLayerEvent).off("tile.add", this._forwardTileEvent).off("tile.remove", this._forwardTileEvent).off("tile.load", this.update).off("tile.error", this._forwardTileEvent)._remove(), this.off("rotate", this.style._redoPlacement), this.off("pitch", this.style._redoPlacement)), t ? (t instanceof Style ? this.style = t : this.style = new Style(t, this.animationLoop), this.style.on("load", this._onStyleLoad).on("error", this._forwardStyleEvent).on("change", this._onStyleChange).on("source.add", this._onSourceAdd).on("source.remove", this._onSourceRemove).on("source.load", this._onSourceUpdate).on("source.error", this._forwardSourceEvent).on("source.change", this._onSourceUpdate).on("layer.add", this._forwardLayerEvent).on("layer.remove", this._forwardLayerEvent).on("tile.add", this._forwardTileEvent).on("tile.remove", this._forwardTileEvent).on("tile.load", this.update).on("tile.error", this._forwardTileEvent), this.on("rotate", this.style._redoPlacement), this.on("pitch", this.style._redoPlacement), this) : (this.style = null, this)
                },
                addSource: function(t, e) {
                    return this.style.addSource(t, e), this
                },
                removeSource: function(t) {
                    return this.style.removeSource(t), this
                },
                getSource: function(t) {
                    return this.style.getSource(t)
                },
                addLayer: function(t, e) {
                    return this.style.addLayer(t, e), this.style._cascade(this._classes), this
                },
                removeLayer: function(t) {
                    return this.style.removeLayer(t), this.style._cascade(this._classes), this
                },
                setFilter: function(t, e) {
                    return this.style.setFilter(t, e), this
                },
                setLayerZoomRange: function(t, e, i) {
                    return this.style.setLayerZoomRange(t, e, i), this
                },
                getFilter: function(t) {
                    return this.style.getFilter(t)
                },
                setPaintProperty: function(t, e, i, r) {
                    return this.batch(function(s) {
                        s.setPaintProperty(t, e, i, r)
                    }), this
                },
                getPaintProperty: function(t, e, i) {
                    return this.style.getPaintProperty(t, e, i)
                },
                setLayoutProperty: function(t, e, i) {
                    return this.batch(function(r) {
                        r.setLayoutProperty(t, e, i)
                    }), this
                },
                getLayoutProperty: function(t, e) {
                    return this.style.getLayoutProperty(t, e)
                },
                getContainer: function() {
                    return this._container
                },
                getCanvasContainer: function() {
                    return this._canvasContainer
                },
                getCanvas: function() {
                    return this._canvas.getElement()
                },
                _setupContainer: function() {
                    var t = this.options.container,
                        e = this._container = "string" == typeof t ? document.getElementById(t) : t;
                    e.classList.add("mapboxgl-map");
                    var i = this._canvasContainer = DOM.create("div", "mapboxgl-canvas-container", e);
                    this.options.interactive && i.classList.add("mapboxgl-interactive"), this._canvas = new Canvas(this, i);
                    var r = DOM.create("div", "mapboxgl-control-container", e),
                        s = this._controlCorners = {};
                    ["top-left", "top-right", "bottom-left", "bottom-right"].forEach(function(t) {
                        s[t] = DOM.create("div", "mapboxgl-ctrl-" + t, r)
                    })
                },
                _setupPainter: function() {
                    var t = this._canvas.getWebGLContext({
                        failIfMajorPerformanceCaveat: this.options.failIfMajorPerformanceCaveat,
                        preserveDrawingBuffer: this.options.preserveDrawingBuffer
                    });
                    return t ? void(this.painter = new Painter(t, this.transform)) : void console.error("Failed to initialize WebGL")
                },
                _contextLost: function(t) {
                    t.preventDefault(), this._frameId && browser.cancelFrame(this._frameId)
                },
                _contextRestored: function() {
                    this._setupPainter(), this.resize(), this.update()
                },
                loaded: function() {
                    return this._styleDirty || this._sourcesDirty ? !1 : this.style && !this.style.loaded() ? !1 : !0
                },
                update: function(t) {
                    return this.style ? (this._styleDirty = this._styleDirty || t, this._sourcesDirty = !0, this._rerender(), this) : this
                },
                render: function() {
                    return this.style && this._styleDirty && (this._styleDirty = !1, this.style._recalculate(this.transform.zoom)), this.style && this._sourcesDirty && !this._sourcesDirtyTimeout && (this._sourcesDirty = !1, this._sourcesDirtyTimeout = setTimeout(function() {
                        this._sourcesDirtyTimeout = null
                    }.bind(this), 50), this.style._updateSources(this.transform)), this.painter.render(this.style, {
                        debug: this.debug,
                        vertices: this.vertices,
                        rotating: this.rotating,
                        zooming: this.zooming
                    }), this.fire("render"), this.loaded() && !this._loaded && (this._loaded = !0, this.fire("load")), this._frameId = null, this.animationLoop.stopped() || (this._styleDirty = !0), (this._sourcesDirty || this._repaint || !this.animationLoop.stopped()) && this._rerender(), this
                },
                remove: function() {
                    return this._hash && this._hash.remove(), browser.cancelFrame(this._frameId), clearTimeout(this._sourcesDirtyTimeout), this.setStyle(null), "undefined" != typeof window && window.removeEventListener("resize", this._onWindowResize, !1), this
                },
                onError: function(t) {
                    console.error(t.error)
                },
                _rerender: function() {
                    this.style && !this._frameId && (this._frameId = browser.frame(this.render))
                },
                _forwardStyleEvent: function(t) {
                    this.fire("style." + t.type, util.extend({
                        style: t.target
                    }, t))
                },
                _forwardSourceEvent: function(t) {
                    this.fire(t.type, util.extend({
                        style: t.target
                    }, t))
                },
                _forwardLayerEvent: function(t) {
                    this.fire(t.type, util.extend({
                        style: t.target
                    }, t))
                },
                _forwardTileEvent: function(t) {
                    this.fire(t.type, util.extend({
                        style: t.target
                    }, t))
                },
                _onStyleLoad: function(t) {
                    var e = new Transform,
                        i = this.transform;
                    i.center.lng === e.center.lng && i.center.lat === e.center.lat && i.zoom === e.zoom && i.bearing === e.bearing && i.pitch === e.pitch && this.jumpTo(this.style.stylesheet), this.style._cascade(this._classes, {
                        transition: !1
                    }), this._forwardStyleEvent(t)
                },
                _onStyleChange: function(t) {
                    this.update(!0), this._forwardStyleEvent(t)
                },
                _onSourceAdd: function(t) {
                    var e = t.source;
                    e.onAdd && e.onAdd(this), this._forwardSourceEvent(t)
                },
                _onSourceRemove: function(t) {
                    var e = t.source;
                    e.onRemove && e.onRemove(this), this._forwardSourceEvent(t)
                },
                _onSourceUpdate: function(t) {
                    this.update(), this._forwardSourceEvent(t)
                },
                _onWindowResize: function() {
                    this.stop().resize().update()
                }
            }), util.extendAll(Map.prototype, {
                _debug: !1,
                get debug() {
                    return this._debug
                },
                set debug(t) {
                    this._debug = t, this.update()
                },
                _collisionDebug: !1,
                get collisionDebug() {
                    return this._collisionDebug
                },
                set collisionDebug(t) {
                    this._collisionDebug = t;
                    for (var e in this.style.sources) this.style.sources[e].reload();
                    this.update()
                },
                _repaint: !1,
                get repaint() {
                    return this._repaint
                },
                set repaint(t) {
                    this._repaint = t, this.update()
                },
                _vertices: !1,
                get vertices() {
                    return this._vertices
                },
                set vertices(t) {
                    this._vertices = t, this.update()
                }
            });
        }, {
            "../geo/lng_lat": 20,
            "../geo/lng_lat_bounds": 21,
            "../geo/transform": 22,
            "../render/painter": 37,
            "../style/animation_loop": 51,
            "../style/style": 56,
            "../util/browser": 95,
            "../util/canvas": 96,
            "../util/dom": 98,
            "../util/evented": 100,
            "../util/util": 106,
            "./camera": 78,
            "./control/attribution": 79,
            "./hash": 89,
            "./interaction": 90,
            "point-geometry": 137
        }],
        92: [function(require, module, exports) {
            "use strict";

            function Popup(t) {
                util.setOptions(this, t), util.bindAll(["_updatePosition", "_onClickClose"], this)
            }
            module.exports = Popup;
            var util = require("../util/util"),
                Evented = require("../util/evented"),
                DOM = require("../util/dom"),
                LngLat = require("../geo/lng_lat");
            Popup.prototype = util.inherit(Evented, {
                options: {
                    closeButton: !0,
                    closeOnClick: !0
                },
                addTo: function(t) {
                    return this._map = t, this._map.on("move", this._updatePosition), this.options.closeOnClick && this._map.on("click", this._onClickClose), this._update(), this
                },
                remove: function() {
                    return this._container && this._container.parentNode.removeChild(this._container), this._map && (this._map.off("move", this._updatePosition), this._map.off("click", this._onClickClose), delete this._map), this
                },
                getLngLat: function() {
                    return this._lngLat
                },
                setLngLat: function(t) {
                    return this._lngLat = LngLat.convert(t), this._update(), this
                },
                setText: function(t) {
                    return this._content = document.createTextNode(t), this._updateContent(), this
                },
                setHTML: function(t) {
                    this._content = document.createDocumentFragment();
                    var i, e = document.createElement("body");
                    for (e.innerHTML = t;;) {
                        if (i = e.firstChild, !i) break;
                        this._content.appendChild(i)
                    }
                    return this._updateContent(), this
                },
                _update: function() {
                    this._map && (this._container || (this._container = DOM.create("div", "mapboxgl-popup", this._map.getContainer()), this._tip = DOM.create("div", "mapboxgl-popup-tip", this._container), this._wrapper = DOM.create("div", "mapboxgl-popup-content", this._container), this.options.closeButton && (this._closeButton = DOM.create("button", "mapboxgl-popup-close-button", this._wrapper), this._closeButton.innerHTML = "&#215;", this._closeButton.addEventListener("click", this._onClickClose))), this._updateContent(), this._updatePosition())
                },
                _updateContent: function() {
                    if (this._content && this._container) {
                        for (var t = this._wrapper; t.hasChildNodes();) t.removeChild(t.firstChild);
                        this.options.closeButton && t.appendChild(this._closeButton), t.appendChild(this._content)
                    }
                },
                _updatePosition: function() {
                    if (this._lngLat && this._container) {
                        var t = this._map.project(this._lngLat).round(),
                            i = this.options.anchor;
                        if (!i) {
                            var e = this._container.offsetWidth,
                                o = this._container.offsetHeight;
                            i = t.y < o ? ["top"] : t.y > this._map.transform.height - o ? ["bottom"] : [], t.x < e / 2 ? i.push("left") : t.x > this._map.transform.width - e / 2 && i.push("right"), i = 0 === i.length ? "bottom" : i.join("-"), this.options.anchor = i
                        }
                        var n = {
                                top: "translate(-50%,0)",
                                "top-left": "translate(0,0)",
                                "top-right": "translate(-100%,0)",
                                bottom: "translate(-50%,-100%)",
                                "bottom-left": "translate(0,-100%)",
                                "bottom-right": "translate(-100%,-100%)",
                                left: "translate(0,-50%)",
                                right: "translate(-100%,-50%)"
                            },
                            s = this._container.classList;
                        for (var a in n) s.remove("mapboxgl-popup-anchor-" + a);
                        s.add("mapboxgl-popup-anchor-" + i), DOM.setTransform(this._container, n[i] + " translate(" + t.x + "px," + t.y + "px)")
                    }
                },
                _onClickClose: function() {
                    this.remove()
                }
            });
        }, {
            "../geo/lng_lat": 20,
            "../util/dom": 98,
            "../util/evented": 100,
            "../util/util": 106
        }],
        93: [function(require, module, exports) {
            "use strict";

            function Actor(t, e) {
                this.target = t, this.parent = e, this.callbacks = {}, this.callbackID = 0, this.receive = this.receive.bind(this), this.target.addEventListener("message", this.receive, !1)
            }
            module.exports = Actor, Actor.prototype.receive = function(t) {
                var e, s = t.data;
                if ("<response>" === s.type) e = this.callbacks[s.id], delete this.callbacks[s.id], e(s.error || null, s.data);
                else if ("undefined" != typeof s.id) {
                    var i = s.id;
                    this.parent[s.type](s.data, function(t, e, s) {
                        this.postMessage({
                            type: "<response>",
                            id: String(i),
                            error: t ? String(t) : null,
                            data: e
                        }, s)
                    }.bind(this))
                } else this.parent[s.type](s.data)
            }, Actor.prototype.send = function(t, e, s, i) {
                var a = null;
                s && (this.callbacks[a = this.callbackID++] = s), this.postMessage({
                    type: t,
                    id: String(a),
                    data: e
                }, i)
            }, Actor.prototype.postMessage = function(t, e) {
                try {
                    this.target.postMessage(t, e)
                } catch (s) {
                    this.target.postMessage(t)
                }
            };
        }, {}],
        94: [function(require, module, exports) {
            "use strict";

            function sameOrigin(e) {
                var t = document.createElement("a");
                return t.href = e, t.protocol === document.location.protocol && t.host === document.location.host
            }
            exports.getJSON = function(e, t) {
                var n = new XMLHttpRequest;
                return n.open("GET", e, !0), n.setRequestHeader("Accept", "application/json"), n.onerror = function(e) {
                    t(e)
                }, n.onload = function() {
                    if (n.status >= 200 && n.status < 300 && n.response) {
                        var e;
                        try {
                            e = JSON.parse(n.response)
                        } catch (r) {
                            return t(r)
                        }
                        t(null, e)
                    } else t(new Error(n.statusText))
                }, n.send(), n
            }, exports.getArrayBuffer = function(e, t) {
                var n = new XMLHttpRequest;
                return n.open("GET", e, !0), n.responseType = "arraybuffer", n.onerror = function(e) {
                    t(e)
                }, n.onload = function() {
                    n.status >= 200 && n.status < 300 && n.response ? t(null, n.response) : t(new Error(n.statusText))
                }, n.send(), n
            }, exports.getImage = function(e, t) {
                return exports.getArrayBuffer(e, function(e, n) {
                    e && t(e);
                    var r = new Image;
                    r.onload = function() {
                        t(null, r), (window.URL || window.webkitURL).revokeObjectURL(r.src)
                    };
                    var o = new Blob([new Uint8Array(n)], {
                        type: "image/png"
                    });
                    return r.src = (window.URL || window.webkitURL).createObjectURL(o), r.getData = function() {
                        var e = document.createElement("canvas"),
                            t = e.getContext("2d");
                        return e.width = r.width, e.height = r.height, t.drawImage(r, 0, 0), t.getImageData(0, 0, r.width, r.height).data
                    }, r
                })
            }, exports.getVideo = function(e, t) {
                var n = document.createElement("video");
                n.onloadstart = function() {
                    t(null, n)
                };
                for (var r = 0; r < e.length; r++) {
                    var o = document.createElement("source");
                    sameOrigin(e[r]) || (n.crossOrigin = "Anonymous"), o.src = e[r], n.appendChild(o)
                }
                return n.getData = function() {
                    return n
                }, n
            };
        }, {}],
        95: [function(require, module, exports) {
            "use strict";
            var Canvas = require("./canvas"),
                frame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
            exports.frame = function(e) {
                return frame(e)
            };
            var cancel = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.msCancelAnimationFrame;
            exports.cancelFrame = function(e) {
                cancel(e)
            }, exports.timed = function(e, r, t) {
                function n(a) {
                    o || (window.performance || (a = Date.now()), a >= i + r ? e.call(t, 1) : (e.call(t, (a - i) / r), exports.frame(n)))
                }
                if (!r) return e.call(t, 1), null;
                var o = !1,
                    i = window.performance ? window.performance.now() : Date.now();
                return exports.frame(n),
                    function() {
                        o = !0
                    }
            }, exports.supported = function(e) {
                for (var r = ([function() {
                        return "undefined" != typeof window
                    }, function() {
                        return "undefined" != typeof document
                    }, function() {
                        return !!(Array.prototype && Array.prototype.every && Array.prototype.filter && Array.prototype.forEach && Array.prototype.indexOf && Array.prototype.lastIndexOf && Array.prototype.map && Array.prototype.some && Array.prototype.reduce && Array.prototype.reduceRight && Array.isArray)
                    }, function() {
                        return !(!Function.prototype || !Function.prototype.bind || !(Object.keys && Object.create && Object.getPrototypeOf && Object.getOwnPropertyNames && Object.isSealed && Object.isFrozen && Object.isExtensible && Object.getOwnPropertyDescriptor && Object.defineProperty && Object.defineProperties && Object.seal && Object.freeze && Object.preventExtensions))
                    }, function() {
                        return "JSON" in window && "parse" in JSON && "stringify" in JSON
                    }, function() {
                        return (new Canvas).supportsWebGLContext(e && e.failIfMajorPerformanceCaveat || !1)
                    }, function() {
                        return "Worker" in window
                    }]), t = 0; t < r.length; t++)
                    if (!r[t]()) return !1;
                return !0
            }, exports.hardwareConcurrency = navigator.hardwareConcurrency || 8, Object.defineProperty(exports, "devicePixelRatio", {
                get: function() {
                    return window.devicePixelRatio
                }
            });
        }, {
            "./canvas": 96
        }],
        96: [function(require, module, exports) {
            "use strict";

            function Canvas(t, e) {
                this.canvas = document.createElement("canvas"), t && e && (this.canvas.style.position = "absolute", this.canvas.classList.add("mapboxgl-canvas"), this.canvas.addEventListener("webglcontextlost", t._contextLost.bind(t), !1), this.canvas.addEventListener("webglcontextrestored", t._contextRestored.bind(t), !1), this.canvas.setAttribute("tabindex", 0), e.appendChild(this.canvas))
            }
            var util = require("../util");
            module.exports = Canvas, Canvas.prototype.resize = function(t, e) {
                var a = window.devicePixelRatio || 1;
                this.canvas.width = a * t, this.canvas.height = a * e, this.canvas.style.width = t + "px", this.canvas.style.height = e + "px"
            };
            var requiredContextAttributes = {
                antialias: !1,
                alpha: !0,
                stencil: !0,
                depth: !1
            };
            Canvas.prototype.getWebGLContext = function(t) {
                return t = util.extend({}, t, requiredContextAttributes), this.canvas.getContext("webgl", t) || this.canvas.getContext("experimental-webgl", t)
            }, Canvas.prototype.supportsWebGLContext = function(t) {
                var e = util.extend({
                    failIfMajorPerformanceCaveat: t
                }, requiredContextAttributes);
                return "probablySupportsContext" in this.canvas ? this.canvas.probablySupportsContext("webgl", e) || this.canvas.probablySupportsContext("experimental-webgl", e) : "supportsContext" in this.canvas ? this.canvas.supportsContext("webgl", e) || this.canvas.supportsContext("experimental-webgl", e) : !!window.WebGLRenderingContext && !!this.getWebGLContext(t)
            }, Canvas.prototype.getElement = function() {
                return this.canvas
            };
        }, {
            "../util": 106
        }],
        97: [function(require, module, exports) {
            "use strict";

            function Dispatcher(r, t) {
                this.actors = [], this.currentActor = 0;
                for (var e = 0; r > e; e++) {
                    var o = new WebWorkify(require("../../source/worker")),
                        s = new Actor(o, t);
                    s.name = "Worker " + e, this.actors.push(s)
                }
            }
            var Actor = require("../actor"),
                WebWorkify = require("webworkify");
            module.exports = Dispatcher, Dispatcher.prototype = {
                broadcast: function(r, t) {
                    for (var e = 0; e < this.actors.length; e++) this.actors[e].send(r, t)
                },
                send: function(r, t, e, o, s) {
                    return ("number" != typeof o || isNaN(o)) && (o = this.currentActor = (this.currentActor + 1) % this.actors.length), this.actors[o].send(r, t, e, s), o
                },
                remove: function() {
                    for (var r = 0; r < this.actors.length; r++) this.actors[r].target.terminate();
                    this.actors = []
                }
            };
        }, {
            "../../source/worker": 49,
            "../actor": 93,
            "webworkify": 145
        }],
        98: [function(require, module, exports) {
            "use strict";

            function testProp(e) {
                for (var t = 0; t < e.length; t++)
                    if (e[t] in docStyle) return e[t]
            }

            function suppressClick(e) {
                e.preventDefault(), e.stopPropagation(), window.removeEventListener("click", suppressClick, !0)
            }
            var Point = require("point-geometry");
            exports.create = function(e, t, r) {
                var o = document.createElement(e);
                return t && (o.className = t), r && r.appendChild(o), o
            };
            var docStyle = document.documentElement.style,
                selectProp = testProp(["userSelect", "MozUserSelect", "WebkitUserSelect", "msUserSelect"]),
                userSelect;
            exports.disableDrag = function() {
                selectProp && (userSelect = docStyle[selectProp], docStyle[selectProp] = "none")
            }, exports.enableDrag = function() {
                selectProp && (docStyle[selectProp] = userSelect)
            };
            var transformProp = testProp(["transform", "WebkitTransform"]);
            exports.setTransform = function(e, t) {
                e.style[transformProp] = t
            }, exports.suppressClick = function() {
                window.addEventListener("click", suppressClick, !0), window.setTimeout(function() {
                    window.removeEventListener("click", suppressClick, !0)
                }, 0)
            }, exports.mousePos = function(e, t) {
                var r = e.getBoundingClientRect();
                return t = t.touches ? t.touches[0] : t, new Point(t.clientX - r.left - e.clientLeft, t.clientY - r.top - e.clientTop)
            };
        }, {
            "point-geometry": 137
        }],
        99: [function(require, module, exports) {
            "use strict";
            module.exports = {
                API_URL: "https://api.mapbox.com",
                REQUIRE_ACCESS_TOKEN: !0
            };
        }, {}],
        100: [function(require, module, exports) {
            "use strict";
            var util = require("./util"),
                Evented = {
                    on: function(t, e) {
                        return this._events = this._events || {}, this._events[t] = this._events[t] || [], this._events[t].push(e), this
                    },
                    off: function(t, e) {
                        if (!t) return delete this._events, this;
                        if (!this.listens(t)) return this;
                        if (e) {
                            var s = this._events[t].indexOf(e);
                            s >= 0 && this._events[t].splice(s, 1), this._events[t].length || delete this._events[t]
                        } else delete this._events[t];
                        return this
                    },
                    once: function(t, e) {
                        var s = function(i) {
                            this.off(t, s), e.call(this, i)
                        }.bind(this);
                        return this.on(t, s), this
                    },
                    fire: function(t, e) {
                        if (!this.listens(t)) return this;
                        e = util.extend({}, e), util.extend(e, {
                            type: t,
                            target: this
                        });
                        for (var s = this._events[t].slice(), i = 0; i < s.length; i++) s[i].call(this, e);
                        return this
                    },
                    listens: function(t) {
                        return !(!this._events || !this._events[t])
                    }
                };
            module.exports = Evented;
        }, {
            "./util": 106
        }],
        101: [function(require, module, exports) {
            "use strict";

            function Glyphs(a, e) {
                this.stacks = a.readFields(readFontstacks, [], e)
            }

            function readFontstacks(a, e, r) {
                if (1 === a) {
                    var t = r.readMessage(readFontstack, {
                        glyphs: {}
                    });
                    e.push(t)
                }
            }

            function readFontstack(a, e, r) {
                if (1 === a) e.name = r.readString();
                else if (2 === a) e.range = r.readString();
                else if (3 === a) {
                    var t = r.readMessage(readGlyph, {});
                    e.glyphs[t.id] = t
                }
            }

            function readGlyph(a, e, r) {
                1 === a ? e.id = r.readVarint() : 2 === a ? e.bitmap = r.readBytes() : 3 === a ? e.width = r.readVarint() : 4 === a ? e.height = r.readVarint() : 5 === a ? e.left = r.readSVarint() : 6 === a ? e.top = r.readSVarint() : 7 === a && (e.advance = r.readVarint())
            }
            module.exports = Glyphs;
        }, {}],
        102: [function(require, module, exports) {
            "use strict";

            function interpolate(t, e, n) {
                return t * (1 - n) + e * n
            }
            module.exports = interpolate, interpolate.number = interpolate, interpolate.vec2 = function(t, e, n) {
                return [interpolate(t[0], e[0], n), interpolate(t[1], e[1], n)]
            }, interpolate.color = function(t, e, n) {
                return [interpolate(t[0], e[0], n), interpolate(t[1], e[1], n), interpolate(t[2], e[2], n), interpolate(t[3], e[3], n)]
            }, interpolate.array = function(t, e, n) {
                return t.map(function(t, r) {
                    return interpolate(t, e[r], n)
                })
            };
        }, {}],
        103: [function(require, module, exports) {
            "use strict";

            function normalizeURL(e, r, o) {
                if (o = o || config.ACCESS_TOKEN, !o && config.REQUIRE_ACCESS_TOKEN) throw new Error("An API access token is required to use Mapbox GL. See https://www.mapbox.com/developers/api/#access-tokens");
                if (e = e.replace(/^mapbox:\/\//, config.API_URL + r), e += -1 !== e.indexOf("?") ? "&access_token=" : "?access_token=", config.REQUIRE_ACCESS_TOKEN) {
                    if ("s" === o[0]) throw new Error("Use a public access token (pk.*) with Mapbox GL JS, not a secret access token (sk.*). See https://www.mapbox.com/developers/api/#access-tokens");
                    e += o
                }
                return e
            }
            var config = require("./config"),
                browser = require("./browser");
            module.exports.normalizeStyleURL = function(e, r) {
                if (!e.match(/^mapbox:\/\/styles\//)) return e;
                var o = e.split("/"),
                    t = o[3],
                    n = o[4],
                    s = o[5] ? "/draft" : "";
                return normalizeURL("mapbox://" + t + "/" + n + s, "/styles/v1/", r)
            }, module.exports.normalizeSourceURL = function(e, r) {
                return e.match(/^mapbox:\/\//) ? normalizeURL(e + ".json", "/v4/", r) + "&secure" : e
            }, module.exports.normalizeGlyphsURL = function(e, r) {
                if (!e.match(/^mapbox:\/\//)) return e;
                var o = e.split("/")[3];
                return normalizeURL("mapbox://" + o + "/{fontstack}/{range}.pbf", "/fonts/v1/", r)
            }, module.exports.normalizeSpriteURL = function(e, r, o, t) {
                if (!e.match(/^mapbox:\/\/sprites\//)) return e + r + o;
                var n = e.split("/"),
                    s = n[3],
                    a = n[4],
                    i = n[5] ? "/draft" : "";
                return normalizeURL("mapbox://" + s + "/" + a + i + "/sprite" + r + o, "/styles/v1/", t)
            }, module.exports.normalizeTileURL = function(e, r) {
                return r && r.match(/^mapbox:\/\//) ? e.replace(/\.((?:png|jpg)\d*)(?=$|\?)/, browser.devicePixelRatio >= 2 ? "@2x.$1" : ".$1") : e
            };
        }, {
            "./browser": 95,
            "./config": 99
        }],
        104: [function(require, module, exports) {
            "use strict";

            function MRUCache(t, e) {
                this.max = t, this.onRemove = e, this.reset()
            }
            module.exports = MRUCache, MRUCache.prototype.reset = function() {
                for (var t in this.list) this.onRemove(this.list[t]);
                return this.list = {}, this.order = [], this
            }, MRUCache.prototype.add = function(t, e) {
                if (this.list[t] = e, this.order.push(t), this.order.length > this.max) {
                    var i = this.get(this.order[0]);
                    i && this.onRemove(i)
                }
                return this
            }, MRUCache.prototype.has = function(t) {
                return t in this.list
            }, MRUCache.prototype.keys = function() {
                return this.order
            }, MRUCache.prototype.get = function(t) {
                if (!this.has(t)) return null;
                var e = this.list[t];
                return delete this.list[t], this.order.splice(this.order.indexOf(t), 1), e
            };
        }, {}],
        105: [function(require, module, exports) {
            "use strict";

            function resolveTokens(e, n) {
                return n.replace(/{([^{}()\[\]<>$=:;.,^]+)}/g, function(n, r) {
                    return r in e ? e[r] : ""
                })
            }
            module.exports = resolveTokens;
        }, {}],
        106: [function(require, module, exports) {
            "use strict";
            var UnitBezier = require("unitbezier"),
                Coordinate = require("../geo/coordinate");
            exports.easeCubicInOut = function(n) {
                if (0 >= n) return 0;
                if (n >= 1) return 1;
                var t = n * n,
                    r = t * n;
                return 4 * (.5 > n ? r : 3 * (n - t) + r - .75)
            }, exports.bezier = function(n, t, r, e) {
                var o = new UnitBezier(n, t, r, e);
                return function(n) {
                    return o.solve(n)
                }
            }, exports.ease = exports.bezier(.25, .1, .25, 1), exports.premultiply = function(n) {
                return n[0] *= n[3], n[1] *= n[3], n[2] *= n[3], n
            }, exports.clamp = function(n, t, r) {
                return Math.min(r, Math.max(t, n))
            }, exports.wrap = function(n, t, r) {
                var e = r - t;
                return n === r ? n : ((n - t) % e + e) % e + t
            }, exports.coalesce = function() {
                for (var n = 0; n < arguments.length; n++) {
                    var t = arguments[n];
                    if (null !== t && void 0 !== t) return t
                }
            }, exports.asyncEach = function(n, t, r) {
                function e() {
                    0 === --o && r()
                }
                var o = n.length;
                if (0 === o) return r();
                for (var i = 0; i < n.length; i++) t(n[i], e)
            }, exports.asyncAll = function(n, t, r) {
                var e = n.length,
                    o = new Array(n.length),
                    i = null;
                n.forEach(function(n, u) {
                    t(n, function(n, t) {
                        n && (i = n), o[u] = t, 0 === --e && r(i, o)
                    })
                })
            }, exports.keysDifference = function(n, t) {
                var r = [];
                for (var e in n) e in t || r.push(e);
                return r
            }, exports.extend = function(n) {
                for (var t = 1; t < arguments.length; t++) {
                    var r = arguments[t];
                    for (var e in r) n[e] = r[e]
                }
                return n
            }, exports.extendAll = function(n, t) {
                for (var r in t) Object.defineProperty(n, r, Object.getOwnPropertyDescriptor(t, r));
                return n
            }, exports.inherit = function(n, t) {
                var r = "function" == typeof n ? n.prototype : n,
                    e = Object.create(r);
                return exports.extendAll(e, t), e
            }, exports.pick = function(n, t) {
                for (var r = {}, e = 0; e < t.length; e++) {
                    var o = t[e];
                    o in n && (r[o] = n[o])
                }
                return r
            };
            var id = 1;
            exports.uniqueId = function() {
                return id++
            }, exports.throttle = function(n, t, r) {
                var e, o, i, u;
                return u = function() {
                    e = !1, o && (i.apply(r, o), o = !1)
                }, i = function() {
                    e ? o = arguments : (n.apply(r, arguments), setTimeout(u, t), e = !0)
                }
            }, exports.debounce = function(n, t) {
                var r, e;
                return function() {
                    e = arguments, clearTimeout(r), r = setTimeout(function() {
                        n.apply(null, e)
                    }, t)
                }
            }, exports.bindAll = function(n, t) {
                n.forEach(function(n) {
                    t[n] = t[n].bind(t)
                })
            }, exports.bindHandlers = function(n) {
                for (var t in n) "function" == typeof n[t] && 0 === t.indexOf("_on") && (n[t] = n[t].bind(n))
            }, exports.setOptions = function(n, t) {
                n.hasOwnProperty("options") || (n.options = n.options ? Object.create(n.options) : {});
                for (var r in t) n.options[r] = t[r];
                return n.options
            }, exports.getCoordinatesCenter = function(n) {
                for (var t = 1 / 0, r = 1 / 0, e = -(1 / 0), o = -(1 / 0), i = 0; i < n.length; i++) t = Math.min(t, n[i].column), r = Math.min(r, n[i].row), e = Math.max(e, n[i].column), o = Math.max(o, n[i].row);
                var u = e - t,
                    a = o - r,
                    c = Math.max(u, a);
                return new Coordinate((t + e) / 2, (r + o) / 2, 0).zoomTo(Math.floor(-Math.log(c) / Math.LN2))
            };
        }, {
            "../geo/coordinate": 19,
            "unitbezier": 140
        }],
        107: [function(require, module, exports) {
            "function" == typeof Object.create ? module.exports = function(t, e) {
                t.super_ = e, t.prototype = Object.create(e.prototype, {
                    constructor: {
                        value: t,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                })
            } : module.exports = function(t, e) {
                t.super_ = e;
                var o = function() {};
                o.prototype = e.prototype, t.prototype = new o, t.prototype.constructor = t
            };
        }, {}],
        108: [function(require, module, exports) {
            function cleanUpNextTick() {
                draining = !1, currentQueue.length ? queue = currentQueue.concat(queue) : queueIndex = -1, queue.length && drainQueue()
            }

            function drainQueue() {
                if (!draining) {
                    var e = setTimeout(cleanUpNextTick);
                    draining = !0;
                    for (var n = queue.length; n;) {
                        for (currentQueue = queue, queue = []; ++queueIndex < n;) currentQueue[queueIndex].run();
                        queueIndex = -1, n = queue.length
                    }
                    currentQueue = null, draining = !1, clearTimeout(e)
                }
            }

            function Item(e, n) {
                this.fun = e, this.array = n
            }

            function noop() {}
            var process = module.exports = {},
                queue = [],
                draining = !1,
                currentQueue, queueIndex = -1;
            process.nextTick = function(e) {
                var n = new Array(arguments.length - 1);
                if (arguments.length > 1)
                    for (var r = 1; r < arguments.length; r++) n[r - 1] = arguments[r];
                queue.push(new Item(e, n)), 1 !== queue.length || draining || setTimeout(drainQueue, 0)
            }, Item.prototype.run = function() {
                this.fun.apply(null, this.array)
            }, process.title = "browser", process.browser = !0, process.env = {}, process.argv = [], process.version = "", process.versions = {}, process.on = noop, process.addListener = noop, process.once = noop, process.off = noop, process.removeListener = noop, process.removeAllListeners = noop, process.emit = noop, process.binding = function(e) {
                throw new Error("process.binding is not supported")
            }, process.cwd = function() {
                return "/"
            }, process.chdir = function(e) {
                throw new Error("process.chdir is not supported")
            }, process.umask = function() {
                return 0
            };
        }, {}],
        109: [function(require, module, exports) {
            module.exports = function(o) {
                return o && "object" == typeof o && "function" == typeof o.copy && "function" == typeof o.fill && "function" == typeof o.readUInt8
            };
        }, {}],
        110: [function(require, module, exports) {
            (function(process, global) {
                function inspect(e, r) {
                    var t = {
                        seen: [],
                        stylize: stylizeNoColor
                    };
                    return arguments.length >= 3 && (t.depth = arguments[2]), arguments.length >= 4 && (t.colors = arguments[3]), isBoolean(r) ? t.showHidden = r : r && exports._extend(t, r), isUndefined(t.showHidden) && (t.showHidden = !1), isUndefined(t.depth) && (t.depth = 2), isUndefined(t.colors) && (t.colors = !1), isUndefined(t.customInspect) && (t.customInspect = !0), t.colors && (t.stylize = stylizeWithColor), formatValue(t, e, t.depth)
                }

                function stylizeWithColor(e, r) {
                    var t = inspect.styles[r];
                    return t ? "[" + inspect.colors[t][0] + "m" + e + "[" + inspect.colors[t][1] + "m" : e
                }

                function stylizeNoColor(e, r) {
                    return e
                }

                function arrayToHash(e) {
                    var r = {};
                    return e.forEach(function(e, t) {
                        r[e] = !0
                    }), r
                }

                function formatValue(e, r, t) {
                    if (e.customInspect && r && isFunction(r.inspect) && r.inspect !== exports.inspect && (!r.constructor || r.constructor.prototype !== r)) {
                        var n = r.inspect(t, e);
                        return isString(n) || (n = formatValue(e, n, t)), n
                    }
                    var i = formatPrimitive(e, r);
                    if (i) return i;
                    var o = Object.keys(r),
                        s = arrayToHash(o);
                    if (e.showHidden && (o = Object.getOwnPropertyNames(r)), isError(r) && (o.indexOf("message") >= 0 || o.indexOf("description") >= 0)) return formatError(r);
                    if (0 === o.length) {
                        if (isFunction(r)) {
                            var u = r.name ? ": " + r.name : "";
                            return e.stylize("[Function" + u + "]", "special")
                        }
                        if (isRegExp(r)) return e.stylize(RegExp.prototype.toString.call(r), "regexp");
                        if (isDate(r)) return e.stylize(Date.prototype.toString.call(r), "date");
                        if (isError(r)) return formatError(r)
                    }
                    var a = "",
                        c = !1,
                        l = ["{", "}"];
                    if (isArray(r) && (c = !0, l = ["[", "]"]), isFunction(r)) {
                        var p = r.name ? ": " + r.name : "";
                        a = " [Function" + p + "]"
                    }
                    if (isRegExp(r) && (a = " " + RegExp.prototype.toString.call(r)), isDate(r) && (a = " " + Date.prototype.toUTCString.call(r)), isError(r) && (a = " " + formatError(r)), 0 === o.length && (!c || 0 == r.length)) return l[0] + a + l[1];
                    if (0 > t) return isRegExp(r) ? e.stylize(RegExp.prototype.toString.call(r), "regexp") : e.stylize("[Object]", "special");
                    e.seen.push(r);
                    var f;
                    return f = c ? formatArray(e, r, t, s, o) : o.map(function(n) {
                        return formatProperty(e, r, t, s, n, c)
                    }), e.seen.pop(), reduceToSingleString(f, a, l)
                }

                function formatPrimitive(e, r) {
                    if (isUndefined(r)) return e.stylize("undefined", "undefined");
                    if (isString(r)) {
                        var t = "'" + JSON.stringify(r).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, '"') + "'";
                        return e.stylize(t, "string")
                    }
                    return isNumber(r) ? e.stylize("" + r, "number") : isBoolean(r) ? e.stylize("" + r, "boolean") : isNull(r) ? e.stylize("null", "null") : void 0
                }

                function formatError(e) {
                    return "[" + Error.prototype.toString.call(e) + "]"
                }

                function formatArray(e, r, t, n, i) {
                    for (var o = [], s = 0, u = r.length; u > s; ++s) hasOwnProperty(r, String(s)) ? o.push(formatProperty(e, r, t, n, String(s), !0)) : o.push("");
                    return i.forEach(function(i) {
                        i.match(/^\d+$/) || o.push(formatProperty(e, r, t, n, i, !0))
                    }), o
                }

                function formatProperty(e, r, t, n, i, o) {
                    var s, u, a;
                    if (a = Object.getOwnPropertyDescriptor(r, i) || {
                            value: r[i]
                        }, a.get ? u = a.set ? e.stylize("[Getter/Setter]", "special") : e.stylize("[Getter]", "special") : a.set && (u = e.stylize("[Setter]", "special")), hasOwnProperty(n, i) || (s = "[" + i + "]"), u || (e.seen.indexOf(a.value) < 0 ? (u = isNull(t) ? formatValue(e, a.value, null) : formatValue(e, a.value, t - 1), u.indexOf("\n") > -1 && (u = o ? u.split("\n").map(function(e) {
                            return "  " + e
                        }).join("\n").substr(2) : "\n" + u.split("\n").map(function(e) {
                            return "   " + e
                        }).join("\n"))) : u = e.stylize("[Circular]", "special")), isUndefined(s)) {
                        if (o && i.match(/^\d+$/)) return u;
                        s = JSON.stringify("" + i), s.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/) ? (s = s.substr(1, s.length - 2), s = e.stylize(s, "name")) : (s = s.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'"), s = e.stylize(s, "string"))
                    }
                    return s + ": " + u
                }

                function reduceToSingleString(e, r, t) {
                    var n = 0,
                        i = e.reduce(function(e, r) {
                            return n++, r.indexOf("\n") >= 0 && n++, e + r.replace(/\u001b\[\d\d?m/g, "").length + 1
                        }, 0);
                    return i > 60 ? t[0] + ("" === r ? "" : r + "\n ") + " " + e.join(",\n  ") + " " + t[1] : t[0] + r + " " + e.join(", ") + " " + t[1]
                }

                function isArray(e) {
                    return Array.isArray(e)
                }

                function isBoolean(e) {
                    return "boolean" == typeof e
                }

                function isNull(e) {
                    return null === e
                }

                function isNullOrUndefined(e) {
                    return null == e
                }

                function isNumber(e) {
                    return "number" == typeof e
                }

                function isString(e) {
                    return "string" == typeof e
                }

                function isSymbol(e) {
                    return "symbol" == typeof e
                }

                function isUndefined(e) {
                    return void 0 === e
                }

                function isRegExp(e) {
                    return isObject(e) && "[object RegExp]" === objectToString(e)
                }

                function isObject(e) {
                    return "object" == typeof e && null !== e
                }

                function isDate(e) {
                    return isObject(e) && "[object Date]" === objectToString(e)
                }

                function isError(e) {
                    return isObject(e) && ("[object Error]" === objectToString(e) || e instanceof Error)
                }

                function isFunction(e) {
                    return "function" == typeof e
                }

                function isPrimitive(e) {
                    return null === e || "boolean" == typeof e || "number" == typeof e || "string" == typeof e || "symbol" == typeof e || "undefined" == typeof e
                }

                function objectToString(e) {
                    return Object.prototype.toString.call(e)
                }

                function pad(e) {
                    return 10 > e ? "0" + e.toString(10) : e.toString(10)
                }

                function timestamp() {
                    var e = new Date,
                        r = [pad(e.getHours()), pad(e.getMinutes()), pad(e.getSeconds())].join(":");
                    return [e.getDate(), months[e.getMonth()], r].join(" ")
                }

                function hasOwnProperty(e, r) {
                    return Object.prototype.hasOwnProperty.call(e, r)
                }
                var formatRegExp = /%[sdj%]/g;
                exports.format = function(e) {
                    if (!isString(e)) {
                        for (var r = [], t = 0; t < arguments.length; t++) r.push(inspect(arguments[t]));
                        return r.join(" ")
                    }
                    for (var t = 1, n = arguments, i = n.length, o = String(e).replace(formatRegExp, function(e) {
                            if ("%%" === e) return "%";
                            if (t >= i) return e;
                            switch (e) {
                                case "%s":
                                    return String(n[t++]);
                                case "%d":
                                    return Number(n[t++]);
                                case "%j":
                                    try {
                                        return JSON.stringify(n[t++])
                                    } catch (r) {
                                        return "[Circular]"
                                    }
                                default:
                                    return e
                            }
                        }), s = n[t]; i > t; s = n[++t]) o += isNull(s) || !isObject(s) ? " " + s : " " + inspect(s);
                    return o
                }, exports.deprecate = function(e, r) {
                    function t() {
                        if (!n) {
                            if (process.throwDeprecation) throw new Error(r);
                            process.traceDeprecation ? console.trace(r) : console.error(r), n = !0
                        }
                        return e.apply(this, arguments)
                    }
                    if (isUndefined(global.process)) return function() {
                        return exports.deprecate(e, r).apply(this, arguments)
                    };
                    if (process.noDeprecation === !0) return e;
                    var n = !1;
                    return t
                };
                var debugs = {},
                    debugEnviron;
                exports.debuglog = function(e) {
                    if (isUndefined(debugEnviron) && (debugEnviron = process.env.NODE_DEBUG || ""), e = e.toUpperCase(), !debugs[e])
                        if (new RegExp("\\b" + e + "\\b", "i").test(debugEnviron)) {
                            var r = process.pid;
                            debugs[e] = function() {
                                var t = exports.format.apply(exports, arguments);
                                console.error("%s %d: %s", e, r, t)
                            }
                        } else debugs[e] = function() {};
                    return debugs[e]
                }, exports.inspect = inspect, inspect.colors = {
                    bold: [1, 22],
                    italic: [3, 23],
                    underline: [4, 24],
                    inverse: [7, 27],
                    white: [37, 39],
                    grey: [90, 39],
                    black: [30, 39],
                    blue: [34, 39],
                    cyan: [36, 39],
                    green: [32, 39],
                    magenta: [35, 39],
                    red: [31, 39],
                    yellow: [33, 39]
                }, inspect.styles = {
                    special: "cyan",
                    number: "yellow",
                    "boolean": "yellow",
                    undefined: "grey",
                    "null": "bold",
                    string: "green",
                    date: "magenta",
                    regexp: "red"
                }, exports.isArray = isArray, exports.isBoolean = isBoolean, exports.isNull = isNull, exports.isNullOrUndefined = isNullOrUndefined, exports.isNumber = isNumber, exports.isString = isString, exports.isSymbol = isSymbol, exports.isUndefined = isUndefined, exports.isRegExp = isRegExp, exports.isObject = isObject, exports.isDate = isDate, exports.isError = isError, exports.isFunction = isFunction, exports.isPrimitive = isPrimitive, exports.isBuffer = require("./support/isBuffer");
                var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                exports.log = function() {
                    console.log("%s - %s", timestamp(), exports.format.apply(exports, arguments))
                }, exports.inherits = require("inherits"), exports._extend = function(e, r) {
                    if (!r || !isObject(r)) return e;
                    for (var t = Object.keys(r), n = t.length; n--;) e[t[n]] = r[t[n]];
                    return e
                };
            }).call(this, require('_process'), typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

        }, {
            "./support/isBuffer": 109,
            "_process": 108,
            "inherits": 107
        }],
        111: [function(require, module, exports) {
            function clamp_css_byte(e) {
                return e = Math.round(e), 0 > e ? 0 : e > 255 ? 255 : e
            }

            function clamp_css_float(e) {
                return 0 > e ? 0 : e > 1 ? 1 : e
            }

            function parse_css_int(e) {
                return clamp_css_byte("%" === e[e.length - 1] ? parseFloat(e) / 100 * 255 : parseInt(e))
            }

            function parse_css_float(e) {
                return clamp_css_float("%" === e[e.length - 1] ? parseFloat(e) / 100 : parseFloat(e))
            }

            function css_hue_to_rgb(e, r, l) {
                return 0 > l ? l += 1 : l > 1 && (l -= 1), 1 > 6 * l ? e + (r - e) * l * 6 : 1 > 2 * l ? r : 2 > 3 * l ? e + (r - e) * (2 / 3 - l) * 6 : e
            }

            function parseCSSColor(e) {
                var r = e.replace(/ /g, "").toLowerCase();
                if (r in kCSSColorTable) return kCSSColorTable[r].slice();
                if ("#" === r[0]) {
                    if (4 === r.length) {
                        var l = parseInt(r.substr(1), 16);
                        return l >= 0 && 4095 >= l ? [(3840 & l) >> 4 | (3840 & l) >> 8, 240 & l | (240 & l) >> 4, 15 & l | (15 & l) << 4, 1] : null
                    }
                    if (7 === r.length) {
                        var l = parseInt(r.substr(1), 16);
                        return l >= 0 && 16777215 >= l ? [(16711680 & l) >> 16, (65280 & l) >> 8, 255 & l, 1] : null
                    }
                    return null
                }
                var a = r.indexOf("("),
                    t = r.indexOf(")");
                if (-1 !== a && t + 1 === r.length) {
                    var n = r.substr(0, a),
                        s = r.substr(a + 1, t - (a + 1)).split(","),
                        o = 1;
                    switch (n) {
                        case "rgba":
                            if (4 !== s.length) return null;
                            o = parse_css_float(s.pop());
                        case "rgb":
                            return 3 !== s.length ? null : [parse_css_int(s[0]), parse_css_int(s[1]), parse_css_int(s[2]), o];
                        case "hsla":
                            if (4 !== s.length) return null;
                            o = parse_css_float(s.pop());
                        case "hsl":
                            if (3 !== s.length) return null;
                            var i = (parseFloat(s[0]) % 360 + 360) % 360 / 360,
                                u = parse_css_float(s[1]),
                                g = parse_css_float(s[2]),
                                d = .5 >= g ? g * (u + 1) : g + u - g * u,
                                c = 2 * g - d;
                            return [clamp_css_byte(255 * css_hue_to_rgb(c, d, i + 1 / 3)), clamp_css_byte(255 * css_hue_to_rgb(c, d, i)), clamp_css_byte(255 * css_hue_to_rgb(c, d, i - 1 / 3)), o];
                        default:
                            return null
                    }
                }
                return null
            }
            var kCSSColorTable = {
                transparent: [0, 0, 0, 0],
                aliceblue: [240, 248, 255, 1],
                antiquewhite: [250, 235, 215, 1],
                aqua: [0, 255, 255, 1],
                aquamarine: [127, 255, 212, 1],
                azure: [240, 255, 255, 1],
                beige: [245, 245, 220, 1],
                bisque: [255, 228, 196, 1],
                black: [0, 0, 0, 1],
                blanchedalmond: [255, 235, 205, 1],
                blue: [0, 0, 255, 1],
                blueviolet: [138, 43, 226, 1],
                brown: [165, 42, 42, 1],
                burlywood: [222, 184, 135, 1],
                cadetblue: [95, 158, 160, 1],
                chartreuse: [127, 255, 0, 1],
                chocolate: [210, 105, 30, 1],
                coral: [255, 127, 80, 1],
                cornflowerblue: [100, 149, 237, 1],
                cornsilk: [255, 248, 220, 1],
                crimson: [220, 20, 60, 1],
                cyan: [0, 255, 255, 1],
                darkblue: [0, 0, 139, 1],
                darkcyan: [0, 139, 139, 1],
                darkgoldenrod: [184, 134, 11, 1],
                darkgray: [169, 169, 169, 1],
                darkgreen: [0, 100, 0, 1],
                darkgrey: [169, 169, 169, 1],
                darkkhaki: [189, 183, 107, 1],
                darkmagenta: [139, 0, 139, 1],
                darkolivegreen: [85, 107, 47, 1],
                darkorange: [255, 140, 0, 1],
                darkorchid: [153, 50, 204, 1],
                darkred: [139, 0, 0, 1],
                darksalmon: [233, 150, 122, 1],
                darkseagreen: [143, 188, 143, 1],
                darkslateblue: [72, 61, 139, 1],
                darkslategray: [47, 79, 79, 1],
                darkslategrey: [47, 79, 79, 1],
                darkturquoise: [0, 206, 209, 1],
                darkviolet: [148, 0, 211, 1],
                deeppink: [255, 20, 147, 1],
                deepskyblue: [0, 191, 255, 1],
                dimgray: [105, 105, 105, 1],
                dimgrey: [105, 105, 105, 1],
                dodgerblue: [30, 144, 255, 1],
                firebrick: [178, 34, 34, 1],
                floralwhite: [255, 250, 240, 1],
                forestgreen: [34, 139, 34, 1],
                fuchsia: [255, 0, 255, 1],
                gainsboro: [220, 220, 220, 1],
                ghostwhite: [248, 248, 255, 1],
                gold: [255, 215, 0, 1],
                goldenrod: [218, 165, 32, 1],
                gray: [128, 128, 128, 1],
                green: [0, 128, 0, 1],
                greenyellow: [173, 255, 47, 1],
                grey: [128, 128, 128, 1],
                honeydew: [240, 255, 240, 1],
                hotpink: [255, 105, 180, 1],
                indianred: [205, 92, 92, 1],
                indigo: [75, 0, 130, 1],
                ivory: [255, 255, 240, 1],
                khaki: [240, 230, 140, 1],
                lavender: [230, 230, 250, 1],
                lavenderblush: [255, 240, 245, 1],
                lawngreen: [124, 252, 0, 1],
                lemonchiffon: [255, 250, 205, 1],
                lightblue: [173, 216, 230, 1],
                lightcoral: [240, 128, 128, 1],
                lightcyan: [224, 255, 255, 1],
                lightgoldenrodyellow: [250, 250, 210, 1],
                lightgray: [211, 211, 211, 1],
                lightgreen: [144, 238, 144, 1],
                lightgrey: [211, 211, 211, 1],
                lightpink: [255, 182, 193, 1],
                lightsalmon: [255, 160, 122, 1],
                lightseagreen: [32, 178, 170, 1],
                lightskyblue: [135, 206, 250, 1],
                lightslategray: [119, 136, 153, 1],
                lightslategrey: [119, 136, 153, 1],
                lightsteelblue: [176, 196, 222, 1],
                lightyellow: [255, 255, 224, 1],
                lime: [0, 255, 0, 1],
                limegreen: [50, 205, 50, 1],
                linen: [250, 240, 230, 1],
                magenta: [255, 0, 255, 1],
                maroon: [128, 0, 0, 1],
                mediumaquamarine: [102, 205, 170, 1],
                mediumblue: [0, 0, 205, 1],
                mediumorchid: [186, 85, 211, 1],
                mediumpurple: [147, 112, 219, 1],
                mediumseagreen: [60, 179, 113, 1],
                mediumslateblue: [123, 104, 238, 1],
                mediumspringgreen: [0, 250, 154, 1],
                mediumturquoise: [72, 209, 204, 1],
                mediumvioletred: [199, 21, 133, 1],
                midnightblue: [25, 25, 112, 1],
                mintcream: [245, 255, 250, 1],
                mistyrose: [255, 228, 225, 1],
                moccasin: [255, 228, 181, 1],
                navajowhite: [255, 222, 173, 1],
                navy: [0, 0, 128, 1],
                oldlace: [253, 245, 230, 1],
                olive: [128, 128, 0, 1],
                olivedrab: [107, 142, 35, 1],
                orange: [255, 165, 0, 1],
                orangered: [255, 69, 0, 1],
                orchid: [218, 112, 214, 1],
                palegoldenrod: [238, 232, 170, 1],
                palegreen: [152, 251, 152, 1],
                paleturquoise: [175, 238, 238, 1],
                palevioletred: [219, 112, 147, 1],
                papayawhip: [255, 239, 213, 1],
                peachpuff: [255, 218, 185, 1],
                peru: [205, 133, 63, 1],
                pink: [255, 192, 203, 1],
                plum: [221, 160, 221, 1],
                powderblue: [176, 224, 230, 1],
                purple: [128, 0, 128, 1],
                red: [255, 0, 0, 1],
                rosybrown: [188, 143, 143, 1],
                royalblue: [65, 105, 225, 1],
                saddlebrown: [139, 69, 19, 1],
                salmon: [250, 128, 114, 1],
                sandybrown: [244, 164, 96, 1],
                seagreen: [46, 139, 87, 1],
                seashell: [255, 245, 238, 1],
                sienna: [160, 82, 45, 1],
                silver: [192, 192, 192, 1],
                skyblue: [135, 206, 235, 1],
                slateblue: [106, 90, 205, 1],
                slategray: [112, 128, 144, 1],
                slategrey: [112, 128, 144, 1],
                snow: [255, 250, 250, 1],
                springgreen: [0, 255, 127, 1],
                steelblue: [70, 130, 180, 1],
                tan: [210, 180, 140, 1],
                teal: [0, 128, 128, 1],
                thistle: [216, 191, 216, 1],
                tomato: [255, 99, 71, 1],
                turquoise: [64, 224, 208, 1],
                violet: [238, 130, 238, 1],
                wheat: [245, 222, 179, 1],
                white: [255, 255, 255, 1],
                whitesmoke: [245, 245, 245, 1],
                yellow: [255, 255, 0, 1],
                yellowgreen: [154, 205, 50, 1]
            };
            try {
                exports.parseCSSColor = parseCSSColor
            } catch (e) {}
        }, {}],
        112: [function(require, module, exports) {
            "use strict";

            function infix(t) {
                return function(n, r, i) {
                    return "$type" === r ? "t" + t + VectorTileFeatureTypes.indexOf(i) : "p[" + JSON.stringify(r) + "]" + t + JSON.stringify(i)
                }
            }

            function strictInfix(t) {
                var n = infix(t);
                return function(t, r, i) {
                    return "$type" === r ? n(t, r, i) : "typeof(p[" + JSON.stringify(r) + "]) === typeof(" + JSON.stringify(i) + ") && " + n(t, r, i)
                }
            }

            function compile(t) {
                return operators[t[0]].apply(t, t)
            }

            function truth() {
                return !0
            }
            var VectorTileFeatureTypes = ["Unknown", "Point", "LineString", "Polygon"],
                operators = {
                    "==": infix("==="),
                    "!=": infix("!=="),
                    ">": strictInfix(">"),
                    "<": strictInfix("<"),
                    "<=": strictInfix("<="),
                    ">=": strictInfix(">="),
                    "in": function(t, n) {
                        return Array.prototype.slice.call(arguments, 2).map(function(r) {
                            return "(" + operators["=="](t, n, r) + ")"
                        }).join("||") || "false"
                    },
                    "!in": function() {
                        return "!(" + operators["in"].apply(this, arguments) + ")"
                    },
                    any: function() {
                        return Array.prototype.slice.call(arguments, 1).map(function(t) {
                            return "(" + compile(t) + ")"
                        }).join("||") || "false"
                    },
                    all: function() {
                        return Array.prototype.slice.call(arguments, 1).map(function(t) {
                            return "(" + compile(t) + ")"
                        }).join("&&") || "true"
                    },
                    none: function() {
                        return "!(" + operators.any.apply(this, arguments) + ")"
                    }
                };
            module.exports = function(t) {
                if (!t) return truth;
                var n = "var p = f.properties || f.tags || {}, t = f.type; return " + compile(t) + ";";
                return new Function("f", n)
            };
        }, {}],
        113: [function(require, module, exports) {
            "use strict";

            function clip(e, n, t, r, l, u, i, s) {
                if (t /= n, r /= n, i >= t && r >= s) return e;
                if (i > r || t > s) return null;
                for (var p = [], h = 0; h < e.length; h++) {
                    var c, a, o = e[h],
                        f = o.geometry,
                        g = o.type;
                    if (c = o.min[l], a = o.max[l], c >= t && r >= a) p.push(o);
                    else if (!(c > r || t > a)) {
                        var m = 1 === g ? clipPoints(f, t, r, l) : clipGeometry(f, t, r, l, u, 3 === g);
                        m.length && p.push({
                            geometry: m,
                            type: g,
                            tags: e[h].tags || null,
                            min: o.min,
                            max: o.max
                        })
                    }
                }
                return p.length ? p : null
            }

            function clipPoints(e, n, t, r) {
                for (var l = [], u = 0; u < e.length; u++) {
                    var i = e[u],
                        s = i[r];
                    s >= n && t >= s && l.push(i)
                }
                return l
            }

            function clipGeometry(e, n, t, r, l, u) {
                for (var i = [], s = 0; s < e.length; s++) {
                    var p, h, c = 0,
                        a = 0,
                        o = null,
                        f = e[s],
                        g = f.area,
                        m = f.dist,
                        v = f.length,
                        w = [];
                    for (h = 0; v - 1 > h; h++) p = o || f[h], o = f[h + 1], c = a || p[r], a = o[r], n > c ? a > t ? (w.push(l(p, o, n), l(p, o, t)), u || (w = newSlice(i, w, g, m))) : a >= n && w.push(l(p, o, n)) : c > t ? n > a ? (w.push(l(p, o, t), l(p, o, n)), u || (w = newSlice(i, w, g, m))) : t >= a && w.push(l(p, o, t)) : (w.push(p), n > a ? (w.push(l(p, o, n)), u || (w = newSlice(i, w, g, m))) : a > t && (w.push(l(p, o, t)), u || (w = newSlice(i, w, g, m))));
                    p = f[v - 1], c = p[r], c >= n && t >= c && w.push(p), u && w[0] !== w[w.length - 1] && w.push(w[0]), newSlice(i, w, g, m)
                }
                return i
            }

            function newSlice(e, n, t, r) {
                return n.length && (n.area = t, n.dist = r, e.push(n)), []
            }
            module.exports = clip;
        }, {}],
        114: [function(require, module, exports) {
            "use strict";

            function convert(e, t) {
                var r = [];
                if ("FeatureCollection" === e.type)
                    for (var o = 0; o < e.features.length; o++) convertFeature(r, e.features[o], t);
                else "Feature" === e.type ? convertFeature(r, e, t) : convertFeature(r, {
                    geometry: e
                }, t);
                return r
            }

            function convertFeature(e, t, r) {
                var o, n, a, i = t.geometry,
                    c = i.type,
                    l = i.coordinates,
                    u = t.properties;
                if ("Point" === c) e.push(create(u, 1, [projectPoint(l)]));
                else if ("MultiPoint" === c) e.push(create(u, 1, project(l)));
                else if ("LineString" === c) e.push(create(u, 2, [project(l, r)]));
                else if ("MultiLineString" === c || "Polygon" === c) {
                    for (a = [], o = 0; o < l.length; o++) a.push(project(l[o], r));
                    e.push(create(u, "Polygon" === c ? 3 : 2, a))
                } else if ("MultiPolygon" === c) {
                    for (a = [], o = 0; o < l.length; o++)
                        for (n = 0; n < l[o].length; n++) a.push(project(l[o][n], r));
                    e.push(create(u, 3, a))
                } else if ("GeometryCollection" === c)
                    for (o = 0; o < i.geometries.length; o++) convertFeature(e, {
                        geometry: i.geometries[o],
                        properties: u
                    }, r);
                else console.warn("Unsupported GeoJSON type: " + i.type)
            }

            function create(e, t, r) {
                var o = {
                    geometry: r,
                    type: t,
                    tags: e || null,
                    min: [2, 1],
                    max: [-1, 0]
                };
                return calcBBox(o), o
            }

            function project(e, t) {
                for (var r = [], o = 0; o < e.length; o++) r.push(projectPoint(e[o]));
                return t && (simplify(r, t), calcSize(r)), r
            }

            function projectPoint(e) {
                var t = Math.sin(e[1] * Math.PI / 180),
                    r = e[0] / 360 + .5,
                    o = .5 - .25 * Math.log((1 + t) / (1 - t)) / Math.PI;
                return o = -1 > o ? -1 : o > 1 ? 1 : o, [r, o, 0]
            }

            function calcSize(e) {
                for (var t, r, o = 0, n = 0, a = 0; a < e.length - 1; a++) t = r || e[a], r = e[a + 1], o += t[0] * r[1] - r[0] * t[1], n += Math.abs(r[0] - t[0]) + Math.abs(r[1] - t[1]);
                e.area = Math.abs(o / 2), e.dist = n
            }

            function calcBBox(e) {
                var t = e.geometry,
                    r = e.min,
                    o = e.max;
                if (1 === e.type) calcRingBBox(r, o, t);
                else
                    for (var n = 0; n < t.length; n++) calcRingBBox(r, o, t[n]);
                return e
            }

            function calcRingBBox(e, t, r) {
                for (var o, n = 0; n < r.length; n++) o = r[n], e[0] = Math.min(o[0], e[0]), t[0] = Math.max(o[0], t[0]), e[1] = Math.min(o[1], e[1]), t[1] = Math.max(o[1], t[1])
            }
            module.exports = convert;
            var simplify = require("./simplify");
        }, {
            "./simplify": 116
        }],
        115: [function(require, module, exports) {
            "use strict";

            function geojsonvt(e, t) {
                return new GeoJSONVT(e, t)
            }

            function GeoJSONVT(e, t) {
                t = this.options = extend(Object.create(this.options), t);
                var i = t.debug;
                i && console.time("preprocess data");
                var o = 1 << t.maxZoom,
                    n = convert(e, t.tolerance / (o * t.extent));
                this.tiles = {}, i && (console.timeEnd("preprocess data"), console.log("index: maxZoom: %d, maxPoints: %d", t.indexMaxZoom, t.indexMaxPoints), console.time("generate tiles"), this.stats = {}, this.total = 0), n = wrap(n, t.buffer / t.extent, intersectX), this.splitTile(n, 0, 0, 0), i && (console.log("features: %d, points: %d", this.tiles[0].numFeatures, this.tiles[0].numPoints), console.timeEnd("generate tiles"), console.log("tiles generated:", this.total, JSON.stringify(this.stats)))
            }

            function transformTile(e, t) {
                if (!e || e.transformed) return e;
                var i, o, n, r = e.z2,
                    s = e.x,
                    l = e.y;
                for (i = 0; i < e.features.length; i++) {
                    var a = e.features[i],
                        u = a.geometry,
                        c = a.type;
                    if (1 === c)
                        for (o = 0; o < u.length; o++) u[o] = transformPoint(u[o], t, r, s, l);
                    else
                        for (o = 0; o < u.length; o++) {
                            var f = u[o];
                            for (n = 0; n < f.length; n++) f[n] = transformPoint(f[n], t, r, s, l)
                        }
                }
                return e.transformed = !0, e
            }

            function transformPoint(e, t, i, o, n) {
                var r = Math.round(t * (e[0] * i - o)),
                    s = Math.round(t * (e[1] * i - n));
                return [r, s]
            }

            function isClippedSquare(e, t, i) {
                if (1 !== e.length) return !1;
                var o = e[0];
                if (3 !== o.type || o.geometry.length > 1) return !1;
                for (var n = 0; n < o.geometry[0].length; n++) {
                    var r = o.geometry[0][n];
                    if (r[0] !== -i && r[0] !== t + i || r[1] !== -i && r[1] !== t + i) return !1
                }
                return !0
            }

            function toID(e, t, i) {
                return 32 * ((1 << e) * i + t) + e
            }

            function intersectX(e, t, i) {
                return [i, (i - e[0]) * (t[1] - e[1]) / (t[0] - e[0]) + e[1], 1]
            }

            function intersectY(e, t, i) {
                return [(i - e[1]) * (t[0] - e[0]) / (t[1] - e[1]) + e[0], i, 1]
            }

            function extend(e, t) {
                for (var i in t) e[i] = t[i];
                return e
            }
            module.exports = geojsonvt;
            var convert = require("./convert"),
                clip = require("./clip"),
                wrap = require("./wrap"),
                createTile = require("./tile");
            GeoJSONVT.prototype.options = {
                maxZoom: 14,
                indexMaxZoom: 5,
                indexMaxPoints: 1e5,
                tolerance: 3,
                extent: 4096,
                buffer: 64,
                debug: 0
            }, GeoJSONVT.prototype.splitTile = function(e, t, i, o, n, r, s) {
                for (var l = [e, t, i, o], a = this.options, u = a.debug, c = a.extent, f = a.buffer; l.length;) {
                    e = l.shift(), t = l.shift(), i = l.shift(), o = l.shift();
                    var m = 1 << t,
                        d = toID(t, i, o),
                        p = this.tiles[d],
                        h = t === a.maxZoom ? 0 : a.tolerance / (m * c);
                    if (!p && (u > 1 && console.time("creation"), p = this.tiles[d] = createTile(e, m, i, o, h, t === a.maxZoom), u)) {
                        u > 1 && (console.log("tile z%d-%d-%d (features: %d, points: %d, simplified: %d)", t, i, o, p.numFeatures, p.numPoints, p.numSimplified), console.timeEnd("creation"));
                        var x = "z" + t;
                        this.stats[x] = (this.stats[x] || 0) + 1, this.total++
                    }
                    if (p.source = e, !isClippedSquare(p.features, c, f)) {
                        if (n) {
                            if (t === a.maxZoom || t === n) continue;
                            var g = 1 << n - t;
                            if (i !== Math.floor(r / g) && o !== Math.floor(s / g)) continue
                        } else if (t === a.indexMaxZoom || p.numPoints <= a.indexMaxPoints) continue;
                        p.source = null, u > 1 && console.time("clipping");
                        var v, T, M, y, P, S, b = .5 * f / c,
                            Z = .5 - b,
                            q = .5 + b,
                            w = 1 + b;
                        v = T = M = y = null, P = clip(e, m, i - b, i + q, 0, intersectX, p.min[0], p.max[0]), S = clip(e, m, i + Z, i + w, 0, intersectX, p.min[0], p.max[0]), P && (v = clip(P, m, o - b, o + q, 1, intersectY, p.min[1], p.max[1]), T = clip(P, m, o + Z, o + w, 1, intersectY, p.min[1], p.max[1])), S && (M = clip(S, m, o - b, o + q, 1, intersectY, p.min[1], p.max[1]), y = clip(S, m, o + Z, o + w, 1, intersectY, p.min[1], p.max[1])), u > 1 && console.timeEnd("clipping"), v && l.push(v, t + 1, 2 * i, 2 * o), T && l.push(T, t + 1, 2 * i, 2 * o + 1), M && l.push(M, t + 1, 2 * i + 1, 2 * o), y && l.push(y, t + 1, 2 * i + 1, 2 * o + 1)
                    }
                }
            }, GeoJSONVT.prototype.getTile = function(e, t, i) {
                var o = this.options,
                    n = o.extent,
                    r = o.debug,
                    s = 1 << e;
                t = (t % s + s) % s;
                var l = toID(e, t, i);
                if (this.tiles[l]) return transformTile(this.tiles[l], n);
                r > 1 && console.log("drilling down to z%d-%d-%d", e, t, i);
                for (var a, u = e, c = t, f = i; !a && u > 0;) u--, c = Math.floor(c / 2), f = Math.floor(f / 2), a = this.tiles[toID(u, c, f)];
                if (r > 1 && console.log("found parent tile z%d-%d-%d", u, c, f), a.source) {
                    if (isClippedSquare(a.features, o.extent, o.buffer)) return transformTile(a, n);
                    r > 1 && console.time("drilling down"), this.splitTile(a.source, u, c, f, e, t, i), r > 1 && console.timeEnd("drilling down")
                }
                return transformTile(this.tiles[l], n)
            };
        }, {
            "./clip": 113,
            "./convert": 114,
            "./tile": 117,
            "./wrap": 118
        }],
        116: [function(require, module, exports) {
            "use strict";

            function simplify(t, i) {
                var e, p, r, s, o = i * i,
                    f = t.length,
                    u = 0,
                    n = f - 1,
                    g = [];
                for (t[u][2] = 1, t[n][2] = 1; n;) {
                    for (p = 0, e = u + 1; n > e; e++) r = getSqSegDist(t[e], t[u], t[n]), r > p && (s = e, p = r);
                    p > o ? (t[s][2] = p, g.push(u), g.push(s), u = s) : (n = g.pop(), u = g.pop())
                }
            }

            function getSqSegDist(t, i, e) {
                var p = i[0],
                    r = i[1],
                    s = e[0],
                    o = e[1],
                    f = t[0],
                    u = t[1],
                    n = s - p,
                    g = o - r;
                if (0 !== n || 0 !== g) {
                    var l = ((f - p) * n + (u - r) * g) / (n * n + g * g);
                    l > 1 ? (p = s, r = o) : l > 0 && (p += n * l, r += g * l)
                }
                return n = f - p, g = u - r, n * n + g * g
            }
            module.exports = simplify;
        }, {}],
        117: [function(require, module, exports) {
            "use strict";

            function createTile(e, n, t, m, i, u) {
                for (var r = {
                        features: [],
                        numPoints: 0,
                        numSimplified: 0,
                        numFeatures: 0,
                        source: null,
                        x: t,
                        y: m,
                        z2: n,
                        transformed: !1,
                        min: [2, 1],
                        max: [-1, 0]
                    }, a = 0; a < e.length; a++) {
                    r.numFeatures++, addFeature(r, e[a], i, u);
                    var s = e[a].min,
                        l = e[a].max;
                    s[0] < r.min[0] && (r.min[0] = s[0]), s[1] < r.min[1] && (r.min[1] = s[1]), l[0] > r.max[0] && (r.max[0] = l[0]), l[1] > r.max[1] && (r.max[1] = l[1])
                }
                return r
            }

            function addFeature(e, n, t, m) {
                var i, u, r, a, s = n.geometry,
                    l = n.type,
                    o = [],
                    f = t * t;
                if (1 === l)
                    for (i = 0; i < s.length; i++) o.push(s[i]), e.numPoints++, e.numSimplified++;
                else
                    for (i = 0; i < s.length; i++)
                        if (r = s[i], m || !(2 === l && r.dist < t || 3 === l && r.area < f)) {
                            var d = [];
                            for (u = 0; u < r.length; u++) a = r[u], (m || a[2] > f) && (d.push(a), e.numSimplified++), e.numPoints++;
                            o.push(d)
                        } else e.numPoints += r.length;
                o.length && e.features.push({
                    geometry: o,
                    type: l,
                    tags: n.tags || null
                })
            }
            module.exports = createTile;
        }, {}],
        118: [function(require, module, exports) {
            "use strict";

            function wrap(r, t, e) {
                var o = r,
                    a = clip(r, 1, -1 - t, t, 0, e, -1, 2),
                    s = clip(r, 1, 1 - t, 2 + t, 0, e, -1, 2);
                return (a || s) && (o = clip(r, 1, -t, 1 + t, 0, e, -1, 2), a && (o = shiftFeatureCoords(a, 1).concat(o)), s && (o = o.concat(shiftFeatureCoords(s, -1)))), o
            }

            function shiftFeatureCoords(r, t) {
                for (var e = [], o = 0; o < r.length; o++) {
                    var a, s = r[o],
                        i = s.type;
                    if (1 === i) a = shiftCoords(s.geometry, t);
                    else {
                        a = [];
                        for (var n = 0; n < s.geometry.length; n++) a.push(shiftCoords(s.geometry[n], t))
                    }
                    e.push({
                        geometry: a,
                        type: i,
                        tags: s.tags,
                        min: [s.min[0] + t, s.min[1]],
                        max: [s.max[0] + t, s.max[1]]
                    })
                }
                return e
            }

            function shiftCoords(r, t) {
                var e = [];
                e.area = r.area, e.dist = r.dist;
                for (var o = 0; o < r.length; o++) e.push([r[o][0] + t, r[o][1], r[o][2]]);
                return e
            }
            var clip = require("./clip");
            module.exports = wrap;
        }, {
            "./clip": 113
        }],
        119: [function(require, module, exports) {
            exports.glMatrix = require("./gl-matrix/common.js"), exports.mat2 = require("./gl-matrix/mat2.js"), exports.mat2d = require("./gl-matrix/mat2d.js"), exports.mat3 = require("./gl-matrix/mat3.js"), exports.mat4 = require("./gl-matrix/mat4.js"), exports.quat = require("./gl-matrix/quat.js"), exports.vec2 = require("./gl-matrix/vec2.js"), exports.vec3 = require("./gl-matrix/vec3.js"), exports.vec4 = require("./gl-matrix/vec4.js");
        }, {
            "./gl-matrix/common.js": 120,
            "./gl-matrix/mat2.js": 121,
            "./gl-matrix/mat2d.js": 122,
            "./gl-matrix/mat3.js": 123,
            "./gl-matrix/mat4.js": 124,
            "./gl-matrix/quat.js": 125,
            "./gl-matrix/vec2.js": 126,
            "./gl-matrix/vec3.js": 127,
            "./gl-matrix/vec4.js": 128
        }],
        120: [function(require, module, exports) {
            var glMatrix = {};
            glMatrix.EPSILON = 1e-6, glMatrix.ARRAY_TYPE = "undefined" != typeof Float32Array ? Float32Array : Array, glMatrix.RANDOM = Math.random, glMatrix.setMatrixArrayType = function(r) {
                GLMAT_ARRAY_TYPE = r
            };
            var degree = Math.PI / 180;
            glMatrix.toRadian = function(r) {
                return r * degree
            }, module.exports = glMatrix;
        }, {}],
        121: [function(require, module, exports) {
            var glMatrix = require("./common.js"),
                mat2 = {};
            mat2.create = function() {
                var t = new glMatrix.ARRAY_TYPE(4);
                return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 1, t
            }, mat2.clone = function(t) {
                var n = new glMatrix.ARRAY_TYPE(4);
                return n[0] = t[0], n[1] = t[1], n[2] = t[2], n[3] = t[3], n
            }, mat2.copy = function(t, n) {
                return t[0] = n[0], t[1] = n[1], t[2] = n[2], t[3] = n[3], t
            }, mat2.identity = function(t) {
                return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 1, t
            }, mat2.transpose = function(t, n) {
                if (t === n) {
                    var r = n[1];
                    t[1] = n[2], t[2] = r
                } else t[0] = n[0], t[1] = n[2], t[2] = n[1], t[3] = n[3];
                return t
            }, mat2.invert = function(t, n) {
                var r = n[0],
                    a = n[1],
                    u = n[2],
                    o = n[3],
                    e = r * o - u * a;
                return e ? (e = 1 / e, t[0] = o * e, t[1] = -a * e, t[2] = -u * e, t[3] = r * e, t) : null
            }, mat2.adjoint = function(t, n) {
                var r = n[0];
                return t[0] = n[3], t[1] = -n[1], t[2] = -n[2], t[3] = r, t
            }, mat2.determinant = function(t) {
                return t[0] * t[3] - t[2] * t[1]
            }, mat2.multiply = function(t, n, r) {
                var a = n[0],
                    u = n[1],
                    o = n[2],
                    e = n[3],
                    i = r[0],
                    m = r[1],
                    c = r[2],
                    f = r[3];
                return t[0] = a * i + o * m, t[1] = u * i + e * m, t[2] = a * c + o * f, t[3] = u * c + e * f, t
            }, mat2.mul = mat2.multiply, mat2.rotate = function(t, n, r) {
                var a = n[0],
                    u = n[1],
                    o = n[2],
                    e = n[3],
                    i = Math.sin(r),
                    m = Math.cos(r);
                return t[0] = a * m + o * i, t[1] = u * m + e * i, t[2] = a * -i + o * m, t[3] = u * -i + e * m, t
            }, mat2.scale = function(t, n, r) {
                var a = n[0],
                    u = n[1],
                    o = n[2],
                    e = n[3],
                    i = r[0],
                    m = r[1];
                return t[0] = a * i, t[1] = u * i, t[2] = o * m, t[3] = e * m, t
            }, mat2.fromRotation = function(t, n) {
                var r = Math.sin(n),
                    a = Math.cos(n);
                return t[0] = a, t[1] = r, t[2] = -r, t[3] = a, t
            }, mat2.fromScaling = function(t, n) {
                return t[0] = n[0], t[1] = 0, t[2] = 0, t[3] = n[1], t
            }, mat2.str = function(t) {
                return "mat2(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ")"
            }, mat2.frob = function(t) {
                return Math.sqrt(Math.pow(t[0], 2) + Math.pow(t[1], 2) + Math.pow(t[2], 2) + Math.pow(t[3], 2))
            }, mat2.LDU = function(t, n, r, a) {
                return t[2] = a[2] / a[0], r[0] = a[0], r[1] = a[1], r[3] = a[3] - t[2] * r[1], [t, n, r]
            }, module.exports = mat2;
        }, {
            "./common.js": 120
        }],
        122: [function(require, module, exports) {
            var glMatrix = require("./common.js"),
                mat2d = {};
            mat2d.create = function() {
                var t = new glMatrix.ARRAY_TYPE(6);
                return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 1, t[4] = 0, t[5] = 0, t
            }, mat2d.clone = function(t) {
                var n = new glMatrix.ARRAY_TYPE(6);
                return n[0] = t[0], n[1] = t[1], n[2] = t[2], n[3] = t[3], n[4] = t[4], n[5] = t[5], n
            }, mat2d.copy = function(t, n) {
                return t[0] = n[0], t[1] = n[1], t[2] = n[2], t[3] = n[3], t[4] = n[4], t[5] = n[5], t
            }, mat2d.identity = function(t) {
                return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 1, t[4] = 0, t[5] = 0, t
            }, mat2d.invert = function(t, n) {
                var r = n[0],
                    a = n[1],
                    o = n[2],
                    u = n[3],
                    e = n[4],
                    i = n[5],
                    m = r * u - a * o;
                return m ? (m = 1 / m, t[0] = u * m, t[1] = -a * m, t[2] = -o * m, t[3] = r * m, t[4] = (o * i - u * e) * m, t[5] = (a * e - r * i) * m, t) : null
            }, mat2d.determinant = function(t) {
                return t[0] * t[3] - t[1] * t[2]
            }, mat2d.multiply = function(t, n, r) {
                var a = n[0],
                    o = n[1],
                    u = n[2],
                    e = n[3],
                    i = n[4],
                    m = n[5],
                    c = r[0],
                    d = r[1],
                    f = r[2],
                    l = r[3],
                    M = r[4],
                    h = r[5];
                return t[0] = a * c + u * d, t[1] = o * c + e * d, t[2] = a * f + u * l, t[3] = o * f + e * l, t[4] = a * M + u * h + i, t[5] = o * M + e * h + m, t
            }, mat2d.mul = mat2d.multiply, mat2d.rotate = function(t, n, r) {
                var a = n[0],
                    o = n[1],
                    u = n[2],
                    e = n[3],
                    i = n[4],
                    m = n[5],
                    c = Math.sin(r),
                    d = Math.cos(r);
                return t[0] = a * d + u * c, t[1] = o * d + e * c, t[2] = a * -c + u * d, t[3] = o * -c + e * d, t[4] = i, t[5] = m, t
            }, mat2d.scale = function(t, n, r) {
                var a = n[0],
                    o = n[1],
                    u = n[2],
                    e = n[3],
                    i = n[4],
                    m = n[5],
                    c = r[0],
                    d = r[1];
                return t[0] = a * c, t[1] = o * c, t[2] = u * d, t[3] = e * d, t[4] = i, t[5] = m, t
            }, mat2d.translate = function(t, n, r) {
                var a = n[0],
                    o = n[1],
                    u = n[2],
                    e = n[3],
                    i = n[4],
                    m = n[5],
                    c = r[0],
                    d = r[1];
                return t[0] = a, t[1] = o, t[2] = u, t[3] = e, t[4] = a * c + u * d + i, t[5] = o * c + e * d + m, t
            }, mat2d.fromRotation = function(t, n) {
                var r = Math.sin(n),
                    a = Math.cos(n);
                return t[0] = a, t[1] = r, t[2] = -r, t[3] = a, t[4] = 0, t[5] = 0, t
            }, mat2d.fromScaling = function(t, n) {
                return t[0] = n[0], t[1] = 0, t[2] = 0, t[3] = n[1], t[4] = 0, t[5] = 0, t
            }, mat2d.fromTranslation = function(t, n) {
                return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 1, t[4] = n[0], t[5] = n[1], t
            }, mat2d.str = function(t) {
                return "mat2d(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ", " + t[4] + ", " + t[5] + ")"
            }, mat2d.frob = function(t) {
                return Math.sqrt(Math.pow(t[0], 2) + Math.pow(t[1], 2) + Math.pow(t[2], 2) + Math.pow(t[3], 2) + Math.pow(t[4], 2) + Math.pow(t[5], 2) + 1)
            }, module.exports = mat2d;
        }, {
            "./common.js": 120
        }],
        123: [function(require, module, exports) {
            var glMatrix = require("./common.js"),
                mat3 = {};
            mat3.create = function() {
                var t = new glMatrix.ARRAY_TYPE(9);
                return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 1, t[5] = 0, t[6] = 0, t[7] = 0, t[8] = 1, t
            }, mat3.fromMat4 = function(t, n) {
                return t[0] = n[0], t[1] = n[1], t[2] = n[2], t[3] = n[4], t[4] = n[5], t[5] = n[6], t[6] = n[8], t[7] = n[9], t[8] = n[10], t
            }, mat3.clone = function(t) {
                var n = new glMatrix.ARRAY_TYPE(9);
                return n[0] = t[0], n[1] = t[1], n[2] = t[2], n[3] = t[3], n[4] = t[4], n[5] = t[5], n[6] = t[6], n[7] = t[7], n[8] = t[8], n
            }, mat3.copy = function(t, n) {
                return t[0] = n[0], t[1] = n[1], t[2] = n[2], t[3] = n[3], t[4] = n[4], t[5] = n[5], t[6] = n[6], t[7] = n[7], t[8] = n[8], t
            }, mat3.identity = function(t) {
                return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 1, t[5] = 0, t[6] = 0, t[7] = 0, t[8] = 1, t
            }, mat3.transpose = function(t, n) {
                if (t === n) {
                    var r = n[1],
                        a = n[2],
                        o = n[5];
                    t[1] = n[3], t[2] = n[6], t[3] = r, t[5] = n[7], t[6] = a, t[7] = o
                } else t[0] = n[0], t[1] = n[3], t[2] = n[6], t[3] = n[1], t[4] = n[4], t[5] = n[7], t[6] = n[2], t[7] = n[5], t[8] = n[8];
                return t
            }, mat3.invert = function(t, n) {
                var r = n[0],
                    a = n[1],
                    o = n[2],
                    u = n[3],
                    m = n[4],
                    e = n[5],
                    i = n[6],
                    c = n[7],
                    f = n[8],
                    l = f * m - e * c,
                    M = -f * u + e * i,
                    v = c * u - m * i,
                    h = r * l + a * M + o * v;
                return h ? (h = 1 / h, t[0] = l * h, t[1] = (-f * a + o * c) * h, t[2] = (e * a - o * m) * h, t[3] = M * h, t[4] = (f * r - o * i) * h, t[5] = (-e * r + o * u) * h, t[6] = v * h, t[7] = (-c * r + a * i) * h, t[8] = (m * r - a * u) * h, t) : null
            }, mat3.adjoint = function(t, n) {
                var r = n[0],
                    a = n[1],
                    o = n[2],
                    u = n[3],
                    m = n[4],
                    e = n[5],
                    i = n[6],
                    c = n[7],
                    f = n[8];
                return t[0] = m * f - e * c, t[1] = o * c - a * f, t[2] = a * e - o * m, t[3] = e * i - u * f, t[4] = r * f - o * i, t[5] = o * u - r * e, t[6] = u * c - m * i, t[7] = a * i - r * c, t[8] = r * m - a * u, t
            }, mat3.determinant = function(t) {
                var n = t[0],
                    r = t[1],
                    a = t[2],
                    o = t[3],
                    u = t[4],
                    m = t[5],
                    e = t[6],
                    i = t[7],
                    c = t[8];
                return n * (c * u - m * i) + r * (-c * o + m * e) + a * (i * o - u * e)
            }, mat3.multiply = function(t, n, r) {
                var a = n[0],
                    o = n[1],
                    u = n[2],
                    m = n[3],
                    e = n[4],
                    i = n[5],
                    c = n[6],
                    f = n[7],
                    l = n[8],
                    M = r[0],
                    v = r[1],
                    h = r[2],
                    p = r[3],
                    s = r[4],
                    w = r[5],
                    d = r[6],
                    R = r[7],
                    g = r[8];
                return t[0] = M * a + v * m + h * c, t[1] = M * o + v * e + h * f, t[2] = M * u + v * i + h * l, t[3] = p * a + s * m + w * c, t[4] = p * o + s * e + w * f, t[5] = p * u + s * i + w * l, t[6] = d * a + R * m + g * c, t[7] = d * o + R * e + g * f, t[8] = d * u + R * i + g * l, t
            }, mat3.mul = mat3.multiply, mat3.translate = function(t, n, r) {
                var a = n[0],
                    o = n[1],
                    u = n[2],
                    m = n[3],
                    e = n[4],
                    i = n[5],
                    c = n[6],
                    f = n[7],
                    l = n[8],
                    M = r[0],
                    v = r[1];
                return t[0] = a, t[1] = o, t[2] = u, t[3] = m, t[4] = e, t[5] = i, t[6] = M * a + v * m + c, t[7] = M * o + v * e + f, t[8] = M * u + v * i + l, t
            }, mat3.rotate = function(t, n, r) {
                var a = n[0],
                    o = n[1],
                    u = n[2],
                    m = n[3],
                    e = n[4],
                    i = n[5],
                    c = n[6],
                    f = n[7],
                    l = n[8],
                    M = Math.sin(r),
                    v = Math.cos(r);
                return t[0] = v * a + M * m, t[1] = v * o + M * e, t[2] = v * u + M * i, t[3] = v * m - M * a, t[4] = v * e - M * o, t[5] = v * i - M * u, t[6] = c, t[7] = f, t[8] = l, t
            }, mat3.scale = function(t, n, r) {
                var a = r[0],
                    o = r[1];
                return t[0] = a * n[0], t[1] = a * n[1], t[2] = a * n[2], t[3] = o * n[3], t[4] = o * n[4], t[5] = o * n[5], t[6] = n[6], t[7] = n[7], t[8] = n[8], t
            }, mat3.fromTranslation = function(t, n) {
                return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 1, t[5] = 0, t[6] = n[0], t[7] = n[1], t[8] = 1, t
            }, mat3.fromRotation = function(t, n) {
                var r = Math.sin(n),
                    a = Math.cos(n);
                return t[0] = a, t[1] = r, t[2] = 0, t[3] = -r, t[4] = a, t[5] = 0, t[6] = 0, t[7] = 0, t[8] = 1, t
            }, mat3.fromScaling = function(t, n) {
                return t[0] = n[0], t[1] = 0, t[2] = 0, t[3] = 0, t[4] = n[1], t[5] = 0, t[6] = 0, t[7] = 0, t[8] = 1, t
            }, mat3.fromMat2d = function(t, n) {
                return t[0] = n[0], t[1] = n[1], t[2] = 0, t[3] = n[2], t[4] = n[3], t[5] = 0, t[6] = n[4], t[7] = n[5], t[8] = 1, t
            }, mat3.fromQuat = function(t, n) {
                var r = n[0],
                    a = n[1],
                    o = n[2],
                    u = n[3],
                    m = r + r,
                    e = a + a,
                    i = o + o,
                    c = r * m,
                    f = a * m,
                    l = a * e,
                    M = o * m,
                    v = o * e,
                    h = o * i,
                    p = u * m,
                    s = u * e,
                    w = u * i;
                return t[0] = 1 - l - h, t[3] = f - w, t[6] = M + s, t[1] = f + w, t[4] = 1 - c - h, t[7] = v - p, t[2] = M - s, t[5] = v + p, t[8] = 1 - c - l, t
            }, mat3.normalFromMat4 = function(t, n) {
                var r = n[0],
                    a = n[1],
                    o = n[2],
                    u = n[3],
                    m = n[4],
                    e = n[5],
                    i = n[6],
                    c = n[7],
                    f = n[8],
                    l = n[9],
                    M = n[10],
                    v = n[11],
                    h = n[12],
                    p = n[13],
                    s = n[14],
                    w = n[15],
                    d = r * e - a * m,
                    R = r * i - o * m,
                    g = r * c - u * m,
                    x = a * i - o * e,
                    y = a * c - u * e,
                    A = o * c - u * i,
                    Y = f * p - l * h,
                    T = f * s - M * h,
                    j = f * w - v * h,
                    q = l * s - M * p,
                    E = l * w - v * p,
                    P = M * w - v * s,
                    _ = d * P - R * E + g * q + x * j - y * T + A * Y;
                return _ ? (_ = 1 / _, t[0] = (e * P - i * E + c * q) * _, t[1] = (i * j - m * P - c * T) * _, t[2] = (m * E - e * j + c * Y) * _, t[3] = (o * E - a * P - u * q) * _, t[4] = (r * P - o * j + u * T) * _, t[5] = (a * j - r * E - u * Y) * _, t[6] = (p * A - s * y + w * x) * _, t[7] = (s * g - h * A - w * R) * _, t[8] = (h * y - p * g + w * d) * _, t) : null
            }, mat3.str = function(t) {
                return "mat3(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ", " + t[4] + ", " + t[5] + ", " + t[6] + ", " + t[7] + ", " + t[8] + ")"
            }, mat3.frob = function(t) {
                return Math.sqrt(Math.pow(t[0], 2) + Math.pow(t[1], 2) + Math.pow(t[2], 2) + Math.pow(t[3], 2) + Math.pow(t[4], 2) + Math.pow(t[5], 2) + Math.pow(t[6], 2) + Math.pow(t[7], 2) + Math.pow(t[8], 2))
            }, module.exports = mat3;
        }, {
            "./common.js": 120
        }],
        124: [function(require, module, exports) {
            var glMatrix = require("./common.js"),
                mat4 = {};
            mat4.create = function() {
                var t = new glMatrix.ARRAY_TYPE(16);
                return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = 1, t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[10] = 1, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t
            }, mat4.clone = function(t) {
                var a = new glMatrix.ARRAY_TYPE(16);
                return a[0] = t[0], a[1] = t[1], a[2] = t[2], a[3] = t[3], a[4] = t[4], a[5] = t[5], a[6] = t[6], a[7] = t[7], a[8] = t[8], a[9] = t[9], a[10] = t[10], a[11] = t[11], a[12] = t[12], a[13] = t[13], a[14] = t[14], a[15] = t[15], a
            }, mat4.copy = function(t, a) {
                return t[0] = a[0], t[1] = a[1], t[2] = a[2], t[3] = a[3], t[4] = a[4], t[5] = a[5], t[6] = a[6], t[7] = a[7], t[8] = a[8], t[9] = a[9], t[10] = a[10], t[11] = a[11], t[12] = a[12], t[13] = a[13], t[14] = a[14], t[15] = a[15], t
            }, mat4.identity = function(t) {
                return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = 1, t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[10] = 1, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t
            }, mat4.transpose = function(t, a) {
                if (t === a) {
                    var r = a[1],
                        n = a[2],
                        o = a[3],
                        e = a[6],
                        i = a[7],
                        u = a[11];
                    t[1] = a[4], t[2] = a[8], t[3] = a[12], t[4] = r, t[6] = a[9], t[7] = a[13], t[8] = n, t[9] = e, t[11] = a[14], t[12] = o, t[13] = i, t[14] = u
                } else t[0] = a[0], t[1] = a[4], t[2] = a[8], t[3] = a[12], t[4] = a[1], t[5] = a[5], t[6] = a[9], t[7] = a[13], t[8] = a[2], t[9] = a[6], t[10] = a[10], t[11] = a[14], t[12] = a[3], t[13] = a[7], t[14] = a[11], t[15] = a[15];
                return t
            }, mat4.invert = function(t, a) {
                var r = a[0],
                    n = a[1],
                    o = a[2],
                    e = a[3],
                    i = a[4],
                    u = a[5],
                    M = a[6],
                    m = a[7],
                    h = a[8],
                    c = a[9],
                    f = a[10],
                    s = a[11],
                    l = a[12],
                    v = a[13],
                    p = a[14],
                    w = a[15],
                    g = r * u - n * i,
                    P = r * M - o * i,
                    R = r * m - e * i,
                    x = n * M - o * u,
                    I = n * m - e * u,
                    S = o * m - e * M,
                    d = h * v - c * l,
                    q = h * p - f * l,
                    E = h * w - s * l,
                    O = c * p - f * v,
                    b = c * w - s * v,
                    T = f * w - s * p,
                    Y = g * T - P * b + R * O + x * E - I * q + S * d;
                return Y ? (Y = 1 / Y, t[0] = (u * T - M * b + m * O) * Y, t[1] = (o * b - n * T - e * O) * Y, t[2] = (v * S - p * I + w * x) * Y, t[3] = (f * I - c * S - s * x) * Y, t[4] = (M * E - i * T - m * q) * Y, t[5] = (r * T - o * E + e * q) * Y, t[6] = (p * R - l * S - w * P) * Y, t[7] = (h * S - f * R + s * P) * Y, t[8] = (i * b - u * E + m * d) * Y, t[9] = (n * E - r * b - e * d) * Y, t[10] = (l * I - v * R + w * g) * Y, t[11] = (c * R - h * I - s * g) * Y, t[12] = (u * q - i * O - M * d) * Y, t[13] = (r * O - n * q + o * d) * Y, t[14] = (v * P - l * x - p * g) * Y, t[15] = (h * x - c * P + f * g) * Y, t) : null
            }, mat4.adjoint = function(t, a) {
                var r = a[0],
                    n = a[1],
                    o = a[2],
                    e = a[3],
                    i = a[4],
                    u = a[5],
                    M = a[6],
                    m = a[7],
                    h = a[8],
                    c = a[9],
                    f = a[10],
                    s = a[11],
                    l = a[12],
                    v = a[13],
                    p = a[14],
                    w = a[15];
                return t[0] = u * (f * w - s * p) - c * (M * w - m * p) + v * (M * s - m * f), t[1] = -(n * (f * w - s * p) - c * (o * w - e * p) + v * (o * s - e * f)), t[2] = n * (M * w - m * p) - u * (o * w - e * p) + v * (o * m - e * M), t[3] = -(n * (M * s - m * f) - u * (o * s - e * f) + c * (o * m - e * M)), t[4] = -(i * (f * w - s * p) - h * (M * w - m * p) + l * (M * s - m * f)), t[5] = r * (f * w - s * p) - h * (o * w - e * p) + l * (o * s - e * f), t[6] = -(r * (M * w - m * p) - i * (o * w - e * p) + l * (o * m - e * M)), t[7] = r * (M * s - m * f) - i * (o * s - e * f) + h * (o * m - e * M), t[8] = i * (c * w - s * v) - h * (u * w - m * v) + l * (u * s - m * c), t[9] = -(r * (c * w - s * v) - h * (n * w - e * v) + l * (n * s - e * c)), t[10] = r * (u * w - m * v) - i * (n * w - e * v) + l * (n * m - e * u), t[11] = -(r * (u * s - m * c) - i * (n * s - e * c) + h * (n * m - e * u)), t[12] = -(i * (c * p - f * v) - h * (u * p - M * v) + l * (u * f - M * c)), t[13] = r * (c * p - f * v) - h * (n * p - o * v) + l * (n * f - o * c), t[14] = -(r * (u * p - M * v) - i * (n * p - o * v) + l * (n * M - o * u)), t[15] = r * (u * f - M * c) - i * (n * f - o * c) + h * (n * M - o * u), t
            }, mat4.determinant = function(t) {
                var a = t[0],
                    r = t[1],
                    n = t[2],
                    o = t[3],
                    e = t[4],
                    i = t[5],
                    u = t[6],
                    M = t[7],
                    m = t[8],
                    h = t[9],
                    c = t[10],
                    f = t[11],
                    s = t[12],
                    l = t[13],
                    v = t[14],
                    p = t[15],
                    w = a * i - r * e,
                    g = a * u - n * e,
                    P = a * M - o * e,
                    R = r * u - n * i,
                    x = r * M - o * i,
                    I = n * M - o * u,
                    S = m * l - h * s,
                    d = m * v - c * s,
                    q = m * p - f * s,
                    E = h * v - c * l,
                    O = h * p - f * l,
                    b = c * p - f * v;
                return w * b - g * O + P * E + R * q - x * d + I * S
            }, mat4.multiply = function(t, a, r) {
                var n = a[0],
                    o = a[1],
                    e = a[2],
                    i = a[3],
                    u = a[4],
                    M = a[5],
                    m = a[6],
                    h = a[7],
                    c = a[8],
                    f = a[9],
                    s = a[10],
                    l = a[11],
                    v = a[12],
                    p = a[13],
                    w = a[14],
                    g = a[15],
                    P = r[0],
                    R = r[1],
                    x = r[2],
                    I = r[3];
                return t[0] = P * n + R * u + x * c + I * v, t[1] = P * o + R * M + x * f + I * p, t[2] = P * e + R * m + x * s + I * w, t[3] = P * i + R * h + x * l + I * g, P = r[4], R = r[5], x = r[6], I = r[7], t[4] = P * n + R * u + x * c + I * v, t[5] = P * o + R * M + x * f + I * p, t[6] = P * e + R * m + x * s + I * w, t[7] = P * i + R * h + x * l + I * g, P = r[8], R = r[9], x = r[10], I = r[11], t[8] = P * n + R * u + x * c + I * v, t[9] = P * o + R * M + x * f + I * p, t[10] = P * e + R * m + x * s + I * w, t[11] = P * i + R * h + x * l + I * g, P = r[12], R = r[13], x = r[14], I = r[15], t[12] = P * n + R * u + x * c + I * v, t[13] = P * o + R * M + x * f + I * p, t[14] = P * e + R * m + x * s + I * w, t[15] = P * i + R * h + x * l + I * g, t
            }, mat4.mul = mat4.multiply, mat4.translate = function(t, a, r) {
                var n, o, e, i, u, M, m, h, c, f, s, l, v = r[0],
                    p = r[1],
                    w = r[2];
                return a === t ? (t[12] = a[0] * v + a[4] * p + a[8] * w + a[12], t[13] = a[1] * v + a[5] * p + a[9] * w + a[13], t[14] = a[2] * v + a[6] * p + a[10] * w + a[14], t[15] = a[3] * v + a[7] * p + a[11] * w + a[15]) : (n = a[0], o = a[1], e = a[2], i = a[3], u = a[4], M = a[5], m = a[6], h = a[7], c = a[8], f = a[9], s = a[10], l = a[11], t[0] = n, t[1] = o, t[2] = e, t[3] = i, t[4] = u, t[5] = M, t[6] = m, t[7] = h, t[8] = c, t[9] = f, t[10] = s, t[11] = l, t[12] = n * v + u * p + c * w + a[12], t[13] = o * v + M * p + f * w + a[13], t[14] = e * v + m * p + s * w + a[14], t[15] = i * v + h * p + l * w + a[15]), t
            }, mat4.scale = function(t, a, r) {
                var n = r[0],
                    o = r[1],
                    e = r[2];
                return t[0] = a[0] * n, t[1] = a[1] * n, t[2] = a[2] * n, t[3] = a[3] * n, t[4] = a[4] * o, t[5] = a[5] * o, t[6] = a[6] * o, t[7] = a[7] * o, t[8] = a[8] * e, t[9] = a[9] * e, t[10] = a[10] * e, t[11] = a[11] * e, t[12] = a[12], t[13] = a[13], t[14] = a[14], t[15] = a[15], t
            }, mat4.rotate = function(t, a, r, n) {
                var o, e, i, u, M, m, h, c, f, s, l, v, p, w, g, P, R, x, I, S, d, q, E, O, b = n[0],
                    T = n[1],
                    Y = n[2],
                    y = Math.sqrt(b * b + T * T + Y * Y);
                return Math.abs(y) < glMatrix.EPSILON ? null : (y = 1 / y, b *= y, T *= y, Y *= y, o = Math.sin(r), e = Math.cos(r), i = 1 - e, u = a[0], M = a[1], m = a[2], h = a[3], c = a[4], f = a[5], s = a[6], l = a[7], v = a[8], p = a[9], w = a[10], g = a[11], P = b * b * i + e, R = T * b * i + Y * o, x = Y * b * i - T * o, I = b * T * i - Y * o, S = T * T * i + e, d = Y * T * i + b * o, q = b * Y * i + T * o, E = T * Y * i - b * o, O = Y * Y * i + e, t[0] = u * P + c * R + v * x, t[1] = M * P + f * R + p * x, t[2] = m * P + s * R + w * x, t[3] = h * P + l * R + g * x, t[4] = u * I + c * S + v * d, t[5] = M * I + f * S + p * d, t[6] = m * I + s * S + w * d, t[7] = h * I + l * S + g * d, t[8] = u * q + c * E + v * O, t[9] = M * q + f * E + p * O, t[10] = m * q + s * E + w * O, t[11] = h * q + l * E + g * O, a !== t && (t[12] = a[12], t[13] = a[13], t[14] = a[14], t[15] = a[15]), t)
            }, mat4.rotateX = function(t, a, r) {
                var n = Math.sin(r),
                    o = Math.cos(r),
                    e = a[4],
                    i = a[5],
                    u = a[6],
                    M = a[7],
                    m = a[8],
                    h = a[9],
                    c = a[10],
                    f = a[11];
                return a !== t && (t[0] = a[0], t[1] = a[1], t[2] = a[2], t[3] = a[3], t[12] = a[12], t[13] = a[13], t[14] = a[14], t[15] = a[15]), t[4] = e * o + m * n, t[5] = i * o + h * n, t[6] = u * o + c * n, t[7] = M * o + f * n, t[8] = m * o - e * n, t[9] = h * o - i * n, t[10] = c * o - u * n, t[11] = f * o - M * n, t
            }, mat4.rotateY = function(t, a, r) {
                var n = Math.sin(r),
                    o = Math.cos(r),
                    e = a[0],
                    i = a[1],
                    u = a[2],
                    M = a[3],
                    m = a[8],
                    h = a[9],
                    c = a[10],
                    f = a[11];
                return a !== t && (t[4] = a[4], t[5] = a[5], t[6] = a[6], t[7] = a[7], t[12] = a[12], t[13] = a[13], t[14] = a[14], t[15] = a[15]), t[0] = e * o - m * n, t[1] = i * o - h * n, t[2] = u * o - c * n, t[3] = M * o - f * n, t[8] = e * n + m * o, t[9] = i * n + h * o, t[10] = u * n + c * o, t[11] = M * n + f * o, t
            }, mat4.rotateZ = function(t, a, r) {
                var n = Math.sin(r),
                    o = Math.cos(r),
                    e = a[0],
                    i = a[1],
                    u = a[2],
                    M = a[3],
                    m = a[4],
                    h = a[5],
                    c = a[6],
                    f = a[7];
                return a !== t && (t[8] = a[8], t[9] = a[9], t[10] = a[10], t[11] = a[11], t[12] = a[12], t[13] = a[13], t[14] = a[14], t[15] = a[15]), t[0] = e * o + m * n, t[1] = i * o + h * n, t[2] = u * o + c * n, t[3] = M * o + f * n, t[4] = m * o - e * n, t[5] = h * o - i * n, t[6] = c * o - u * n, t[7] = f * o - M * n, t
            }, mat4.fromTranslation = function(t, a) {
                return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = 1, t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[10] = 1, t[11] = 0, t[12] = a[0], t[13] = a[1], t[14] = a[2], t[15] = 1, t
            }, mat4.fromScaling = function(t, a) {
                return t[0] = a[0], t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = a[1], t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[10] = a[2], t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t
            }, mat4.fromRotation = function(t, a, r) {
                var n, o, e, i = r[0],
                    u = r[1],
                    M = r[2],
                    m = Math.sqrt(i * i + u * u + M * M);
                return Math.abs(m) < glMatrix.EPSILON ? null : (m = 1 / m, i *= m, u *= m, M *= m, n = Math.sin(a), o = Math.cos(a), e = 1 - o, t[0] = i * i * e + o, t[1] = u * i * e + M * n, t[2] = M * i * e - u * n, t[3] = 0, t[4] = i * u * e - M * n, t[5] = u * u * e + o, t[6] = M * u * e + i * n, t[7] = 0, t[8] = i * M * e + u * n, t[9] = u * M * e - i * n, t[10] = M * M * e + o, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t)
            }, mat4.fromXRotation = function(t, a) {
                var r = Math.sin(a),
                    n = Math.cos(a);
                return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = n, t[6] = r, t[7] = 0, t[8] = 0, t[9] = -r, t[10] = n, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t
            }, mat4.fromYRotation = function(t, a) {
                var r = Math.sin(a),
                    n = Math.cos(a);
                return t[0] = n, t[1] = 0, t[2] = -r, t[3] = 0, t[4] = 0, t[5] = 1, t[6] = 0, t[7] = 0, t[8] = r, t[9] = 0, t[10] = n, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t
            }, mat4.fromZRotation = function(t, a) {
                var r = Math.sin(a),
                    n = Math.cos(a);
                return t[0] = n, t[1] = r, t[2] = 0, t[3] = 0, t[4] = -r, t[5] = n, t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[10] = 1, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t
            }, mat4.fromRotationTranslation = function(t, a, r) {
                var n = a[0],
                    o = a[1],
                    e = a[2],
                    i = a[3],
                    u = n + n,
                    M = o + o,
                    m = e + e,
                    h = n * u,
                    c = n * M,
                    f = n * m,
                    s = o * M,
                    l = o * m,
                    v = e * m,
                    p = i * u,
                    w = i * M,
                    g = i * m;
                return t[0] = 1 - (s + v), t[1] = c + g, t[2] = f - w, t[3] = 0, t[4] = c - g, t[5] = 1 - (h + v), t[6] = l + p, t[7] = 0, t[8] = f + w, t[9] = l - p, t[10] = 1 - (h + s), t[11] = 0, t[12] = r[0], t[13] = r[1], t[14] = r[2], t[15] = 1, t
            }, mat4.fromRotationTranslationScale = function(t, a, r, n) {
                var o = a[0],
                    e = a[1],
                    i = a[2],
                    u = a[3],
                    M = o + o,
                    m = e + e,
                    h = i + i,
                    c = o * M,
                    f = o * m,
                    s = o * h,
                    l = e * m,
                    v = e * h,
                    p = i * h,
                    w = u * M,
                    g = u * m,
                    P = u * h,
                    R = n[0],
                    x = n[1],
                    I = n[2];
                return t[0] = (1 - (l + p)) * R, t[1] = (f + P) * R, t[2] = (s - g) * R, t[3] = 0, t[4] = (f - P) * x, t[5] = (1 - (c + p)) * x, t[6] = (v + w) * x, t[7] = 0, t[8] = (s + g) * I, t[9] = (v - w) * I, t[10] = (1 - (c + l)) * I, t[11] = 0, t[12] = r[0], t[13] = r[1], t[14] = r[2], t[15] = 1, t
            }, mat4.fromRotationTranslationScaleOrigin = function(t, a, r, n, o) {
                var e = a[0],
                    i = a[1],
                    u = a[2],
                    M = a[3],
                    m = e + e,
                    h = i + i,
                    c = u + u,
                    f = e * m,
                    s = e * h,
                    l = e * c,
                    v = i * h,
                    p = i * c,
                    w = u * c,
                    g = M * m,
                    P = M * h,
                    R = M * c,
                    x = n[0],
                    I = n[1],
                    S = n[2],
                    d = o[0],
                    q = o[1],
                    E = o[2];
                return t[0] = (1 - (v + w)) * x, t[1] = (s + R) * x, t[2] = (l - P) * x, t[3] = 0, t[4] = (s - R) * I, t[5] = (1 - (f + w)) * I, t[6] = (p + g) * I, t[7] = 0, t[8] = (l + P) * S, t[9] = (p - g) * S, t[10] = (1 - (f + v)) * S, t[11] = 0, t[12] = r[0] + d - (t[0] * d + t[4] * q + t[8] * E), t[13] = r[1] + q - (t[1] * d + t[5] * q + t[9] * E), t[14] = r[2] + E - (t[2] * d + t[6] * q + t[10] * E), t[15] = 1, t
            }, mat4.fromQuat = function(t, a) {
                var r = a[0],
                    n = a[1],
                    o = a[2],
                    e = a[3],
                    i = r + r,
                    u = n + n,
                    M = o + o,
                    m = r * i,
                    h = n * i,
                    c = n * u,
                    f = o * i,
                    s = o * u,
                    l = o * M,
                    v = e * i,
                    p = e * u,
                    w = e * M;
                return t[0] = 1 - c - l, t[1] = h + w, t[2] = f - p, t[3] = 0, t[4] = h - w, t[5] = 1 - m - l, t[6] = s + v, t[7] = 0, t[8] = f + p, t[9] = s - v, t[10] = 1 - m - c, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, t
            }, mat4.frustum = function(t, a, r, n, o, e, i) {
                var u = 1 / (r - a),
                    M = 1 / (o - n),
                    m = 1 / (e - i);
                return t[0] = 2 * e * u, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = 2 * e * M, t[6] = 0, t[7] = 0, t[8] = (r + a) * u, t[9] = (o + n) * M, t[10] = (i + e) * m, t[11] = -1, t[12] = 0, t[13] = 0, t[14] = i * e * 2 * m, t[15] = 0, t
            }, mat4.perspective = function(t, a, r, n, o) {
                var e = 1 / Math.tan(a / 2),
                    i = 1 / (n - o);
                return t[0] = e / r, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = e, t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[10] = (o + n) * i, t[11] = -1, t[12] = 0, t[13] = 0, t[14] = 2 * o * n * i, t[15] = 0, t
            }, mat4.perspectiveFromFieldOfView = function(t, a, r, n) {
                var o = Math.tan(a.upDegrees * Math.PI / 180),
                    e = Math.tan(a.downDegrees * Math.PI / 180),
                    i = Math.tan(a.leftDegrees * Math.PI / 180),
                    u = Math.tan(a.rightDegrees * Math.PI / 180),
                    M = 2 / (i + u),
                    m = 2 / (o + e);
                return t[0] = M, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = m, t[6] = 0, t[7] = 0, t[8] = -((i - u) * M * .5), t[9] = (o - e) * m * .5, t[10] = n / (r - n), t[11] = -1, t[12] = 0, t[13] = 0, t[14] = n * r / (r - n), t[15] = 0, t
            }, mat4.ortho = function(t, a, r, n, o, e, i) {
                var u = 1 / (a - r),
                    M = 1 / (n - o),
                    m = 1 / (e - i);
                return t[0] = -2 * u, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = -2 * M, t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[10] = 2 * m, t[11] = 0, t[12] = (a + r) * u, t[13] = (o + n) * M, t[14] = (i + e) * m, t[15] = 1, t
            }, mat4.lookAt = function(t, a, r, n) {
                var o, e, i, u, M, m, h, c, f, s, l = a[0],
                    v = a[1],
                    p = a[2],
                    w = n[0],
                    g = n[1],
                    P = n[2],
                    R = r[0],
                    x = r[1],
                    I = r[2];
                return Math.abs(l - R) < glMatrix.EPSILON && Math.abs(v - x) < glMatrix.EPSILON && Math.abs(p - I) < glMatrix.EPSILON ? mat4.identity(t) : (h = l - R, c = v - x, f = p - I, s = 1 / Math.sqrt(h * h + c * c + f * f), h *= s, c *= s, f *= s, o = g * f - P * c, e = P * h - w * f, i = w * c - g * h, s = Math.sqrt(o * o + e * e + i * i), s ? (s = 1 / s, o *= s, e *= s, i *= s) : (o = 0, e = 0, i = 0), u = c * i - f * e, M = f * o - h * i, m = h * e - c * o, s = Math.sqrt(u * u + M * M + m * m), s ? (s = 1 / s, u *= s, M *= s, m *= s) : (u = 0, M = 0, m = 0), t[0] = o, t[1] = u, t[2] = h, t[3] = 0, t[4] = e, t[5] = M, t[6] = c, t[7] = 0, t[8] = i, t[9] = m, t[10] = f, t[11] = 0, t[12] = -(o * l + e * v + i * p), t[13] = -(u * l + M * v + m * p), t[14] = -(h * l + c * v + f * p), t[15] = 1, t)
            }, mat4.str = function(t) {
                return "mat4(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ", " + t[4] + ", " + t[5] + ", " + t[6] + ", " + t[7] + ", " + t[8] + ", " + t[9] + ", " + t[10] + ", " + t[11] + ", " + t[12] + ", " + t[13] + ", " + t[14] + ", " + t[15] + ")"
            }, mat4.frob = function(t) {
                return Math.sqrt(Math.pow(t[0], 2) + Math.pow(t[1], 2) + Math.pow(t[2], 2) + Math.pow(t[3], 2) + Math.pow(t[4], 2) + Math.pow(t[5], 2) + Math.pow(t[6], 2) + Math.pow(t[7], 2) + Math.pow(t[8], 2) + Math.pow(t[9], 2) + Math.pow(t[10], 2) + Math.pow(t[11], 2) + Math.pow(t[12], 2) + Math.pow(t[13], 2) + Math.pow(t[14], 2) + Math.pow(t[15], 2))
            }, module.exports = mat4;
        }, {
            "./common.js": 120
        }],
        125: [function(require, module, exports) {
            var glMatrix = require("./common.js"),
                mat3 = require("./mat3.js"),
                vec3 = require("./vec3.js"),
                vec4 = require("./vec4.js"),
                quat = {};
            quat.create = function() {
                var t = new glMatrix.ARRAY_TYPE(4);
                return t[0] = 0, t[1] = 0, t[2] = 0, t[3] = 1, t
            }, quat.rotationTo = function() {
                var t = vec3.create(),
                    a = vec3.fromValues(1, 0, 0),
                    e = vec3.fromValues(0, 1, 0);
                return function(r, u, n) {
                    var c = vec3.dot(u, n);
                    return -.999999 > c ? (vec3.cross(t, a, u), vec3.length(t) < 1e-6 && vec3.cross(t, e, u), vec3.normalize(t, t), quat.setAxisAngle(r, t, Math.PI), r) : c > .999999 ? (r[0] = 0, r[1] = 0, r[2] = 0, r[3] = 1, r) : (vec3.cross(t, u, n), r[0] = t[0], r[1] = t[1], r[2] = t[2], r[3] = 1 + c, quat.normalize(r, r))
                }
            }(), quat.setAxes = function() {
                var t = mat3.create();
                return function(a, e, r, u) {
                    return t[0] = r[0], t[3] = r[1], t[6] = r[2], t[1] = u[0], t[4] = u[1], t[7] = u[2], t[2] = -e[0], t[5] = -e[1], t[8] = -e[2], quat.normalize(a, quat.fromMat3(a, t))
                }
            }(), quat.clone = vec4.clone, quat.fromValues = vec4.fromValues, quat.copy = vec4.copy, quat.set = vec4.set, quat.identity = function(t) {
                return t[0] = 0, t[1] = 0, t[2] = 0, t[3] = 1, t
            }, quat.setAxisAngle = function(t, a, e) {
                e = .5 * e;
                var r = Math.sin(e);
                return t[0] = r * a[0], t[1] = r * a[1], t[2] = r * a[2], t[3] = Math.cos(e), t
            }, quat.add = vec4.add, quat.multiply = function(t, a, e) {
                var r = a[0],
                    u = a[1],
                    n = a[2],
                    c = a[3],
                    q = e[0],
                    o = e[1],
                    s = e[2],
                    i = e[3];
                return t[0] = r * i + c * q + u * s - n * o, t[1] = u * i + c * o + n * q - r * s, t[2] = n * i + c * s + r * o - u * q, t[3] = c * i - r * q - u * o - n * s, t
            }, quat.mul = quat.multiply, quat.scale = vec4.scale, quat.rotateX = function(t, a, e) {
                e *= .5;
                var r = a[0],
                    u = a[1],
                    n = a[2],
                    c = a[3],
                    q = Math.sin(e),
                    o = Math.cos(e);
                return t[0] = r * o + c * q, t[1] = u * o + n * q, t[2] = n * o - u * q, t[3] = c * o - r * q, t
            }, quat.rotateY = function(t, a, e) {
                e *= .5;
                var r = a[0],
                    u = a[1],
                    n = a[2],
                    c = a[3],
                    q = Math.sin(e),
                    o = Math.cos(e);
                return t[0] = r * o - n * q, t[1] = u * o + c * q, t[2] = n * o + r * q, t[3] = c * o - u * q, t
            }, quat.rotateZ = function(t, a, e) {
                e *= .5;
                var r = a[0],
                    u = a[1],
                    n = a[2],
                    c = a[3],
                    q = Math.sin(e),
                    o = Math.cos(e);
                return t[0] = r * o + u * q, t[1] = u * o - r * q, t[2] = n * o + c * q, t[3] = c * o - n * q, t
            }, quat.calculateW = function(t, a) {
                var e = a[0],
                    r = a[1],
                    u = a[2];
                return t[0] = e, t[1] = r, t[2] = u, t[3] = Math.sqrt(Math.abs(1 - e * e - r * r - u * u)), t
            }, quat.dot = vec4.dot, quat.lerp = vec4.lerp, quat.slerp = function(t, a, e, r) {
                var u, n, c, q, o, s = a[0],
                    i = a[1],
                    v = a[2],
                    l = a[3],
                    f = e[0],
                    h = e[1],
                    M = e[2],
                    m = e[3];
                return n = s * f + i * h + v * M + l * m, 0 > n && (n = -n, f = -f, h = -h, M = -M, m = -m), 1 - n > 1e-6 ? (u = Math.acos(n), c = Math.sin(u), q = Math.sin((1 - r) * u) / c, o = Math.sin(r * u) / c) : (q = 1 - r, o = r), t[0] = q * s + o * f, t[1] = q * i + o * h, t[2] = q * v + o * M, t[3] = q * l + o * m, t
            }, quat.sqlerp = function() {
                var t = quat.create(),
                    a = quat.create();
                return function(e, r, u, n, c, q) {
                    return quat.slerp(t, r, c, q), quat.slerp(a, u, n, q), quat.slerp(e, t, a, 2 * q * (1 - q)), e
                }
            }(), quat.invert = function(t, a) {
                var e = a[0],
                    r = a[1],
                    u = a[2],
                    n = a[3],
                    c = e * e + r * r + u * u + n * n,
                    q = c ? 1 / c : 0;
                return t[0] = -e * q, t[1] = -r * q, t[2] = -u * q, t[3] = n * q, t
            }, quat.conjugate = function(t, a) {
                return t[0] = -a[0], t[1] = -a[1], t[2] = -a[2], t[3] = a[3], t
            }, quat.length = vec4.length, quat.len = quat.length, quat.squaredLength = vec4.squaredLength, quat.sqrLen = quat.squaredLength, quat.normalize = vec4.normalize, quat.fromMat3 = function(t, a) {
                var e, r = a[0] + a[4] + a[8];
                if (r > 0) e = Math.sqrt(r + 1), t[3] = .5 * e, e = .5 / e, t[0] = (a[5] - a[7]) * e, t[1] = (a[6] - a[2]) * e, t[2] = (a[1] - a[3]) * e;
                else {
                    var u = 0;
                    a[4] > a[0] && (u = 1), a[8] > a[3 * u + u] && (u = 2);
                    var n = (u + 1) % 3,
                        c = (u + 2) % 3;
                    e = Math.sqrt(a[3 * u + u] - a[3 * n + n] - a[3 * c + c] + 1), t[u] = .5 * e, e = .5 / e, t[3] = (a[3 * n + c] - a[3 * c + n]) * e, t[n] = (a[3 * n + u] + a[3 * u + n]) * e, t[c] = (a[3 * c + u] + a[3 * u + c]) * e
                }
                return t
            }, quat.str = function(t) {
                return "quat(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ")"
            }, module.exports = quat;
        }, {
            "./common.js": 120,
            "./mat3.js": 123,
            "./vec3.js": 127,
            "./vec4.js": 128
        }],
        126: [function(require, module, exports) {
            var glMatrix = require("./common.js"),
                vec2 = {};
            vec2.create = function() {
                var n = new glMatrix.ARRAY_TYPE(2);
                return n[0] = 0, n[1] = 0, n
            }, vec2.clone = function(n) {
                var e = new glMatrix.ARRAY_TYPE(2);
                return e[0] = n[0], e[1] = n[1], e
            }, vec2.fromValues = function(n, e) {
                var r = new glMatrix.ARRAY_TYPE(2);
                return r[0] = n, r[1] = e, r
            }, vec2.copy = function(n, e) {
                return n[0] = e[0], n[1] = e[1], n
            }, vec2.set = function(n, e, r) {
                return n[0] = e, n[1] = r, n
            }, vec2.add = function(n, e, r) {
                return n[0] = e[0] + r[0], n[1] = e[1] + r[1], n
            }, vec2.subtract = function(n, e, r) {
                return n[0] = e[0] - r[0], n[1] = e[1] - r[1], n
            }, vec2.sub = vec2.subtract, vec2.multiply = function(n, e, r) {
                return n[0] = e[0] * r[0], n[1] = e[1] * r[1], n
            }, vec2.mul = vec2.multiply, vec2.divide = function(n, e, r) {
                return n[0] = e[0] / r[0], n[1] = e[1] / r[1], n
            }, vec2.div = vec2.divide, vec2.min = function(n, e, r) {
                return n[0] = Math.min(e[0], r[0]), n[1] = Math.min(e[1], r[1]), n
            }, vec2.max = function(n, e, r) {
                return n[0] = Math.max(e[0], r[0]), n[1] = Math.max(e[1], r[1]), n
            }, vec2.scale = function(n, e, r) {
                return n[0] = e[0] * r, n[1] = e[1] * r, n
            }, vec2.scaleAndAdd = function(n, e, r, t) {
                return n[0] = e[0] + r[0] * t, n[1] = e[1] + r[1] * t, n
            }, vec2.distance = function(n, e) {
                var r = e[0] - n[0],
                    t = e[1] - n[1];
                return Math.sqrt(r * r + t * t)
            }, vec2.dist = vec2.distance, vec2.squaredDistance = function(n, e) {
                var r = e[0] - n[0],
                    t = e[1] - n[1];
                return r * r + t * t
            }, vec2.sqrDist = vec2.squaredDistance, vec2.length = function(n) {
                var e = n[0],
                    r = n[1];
                return Math.sqrt(e * e + r * r)
            }, vec2.len = vec2.length, vec2.squaredLength = function(n) {
                var e = n[0],
                    r = n[1];
                return e * e + r * r
            }, vec2.sqrLen = vec2.squaredLength, vec2.negate = function(n, e) {
                return n[0] = -e[0], n[1] = -e[1], n
            }, vec2.inverse = function(n, e) {
                return n[0] = 1 / e[0], n[1] = 1 / e[1], n
            }, vec2.normalize = function(n, e) {
                var r = e[0],
                    t = e[1],
                    c = r * r + t * t;
                return c > 0 && (c = 1 / Math.sqrt(c), n[0] = e[0] * c, n[1] = e[1] * c), n
            }, vec2.dot = function(n, e) {
                return n[0] * e[0] + n[1] * e[1]
            }, vec2.cross = function(n, e, r) {
                var t = e[0] * r[1] - e[1] * r[0];
                return n[0] = n[1] = 0, n[2] = t, n
            }, vec2.lerp = function(n, e, r, t) {
                var c = e[0],
                    u = e[1];
                return n[0] = c + t * (r[0] - c), n[1] = u + t * (r[1] - u), n
            }, vec2.random = function(n, e) {
                e = e || 1;
                var r = 2 * glMatrix.RANDOM() * Math.PI;
                return n[0] = Math.cos(r) * e, n[1] = Math.sin(r) * e, n
            }, vec2.transformMat2 = function(n, e, r) {
                var t = e[0],
                    c = e[1];
                return n[0] = r[0] * t + r[2] * c, n[1] = r[1] * t + r[3] * c, n
            }, vec2.transformMat2d = function(n, e, r) {
                var t = e[0],
                    c = e[1];
                return n[0] = r[0] * t + r[2] * c + r[4], n[1] = r[1] * t + r[3] * c + r[5], n
            }, vec2.transformMat3 = function(n, e, r) {
                var t = e[0],
                    c = e[1];
                return n[0] = r[0] * t + r[3] * c + r[6], n[1] = r[1] * t + r[4] * c + r[7], n
            }, vec2.transformMat4 = function(n, e, r) {
                var t = e[0],
                    c = e[1];
                return n[0] = r[0] * t + r[4] * c + r[12], n[1] = r[1] * t + r[5] * c + r[13], n
            }, vec2.forEach = function() {
                var n = vec2.create();
                return function(e, r, t, c, u, v) {
                    var a, i;
                    for (r || (r = 2), t || (t = 0), i = c ? Math.min(c * r + t, e.length) : e.length, a = t; i > a; a += r) n[0] = e[a], n[1] = e[a + 1], u(n, n, v), e[a] = n[0], e[a + 1] = n[1];
                    return e
                }
            }(), vec2.str = function(n) {
                return "vec2(" + n[0] + ", " + n[1] + ")"
            }, module.exports = vec2;
        }, {
            "./common.js": 120
        }],
        127: [function(require, module, exports) {
            var glMatrix = require("./common.js"),
                vec3 = {};
            vec3.create = function() {
                var n = new glMatrix.ARRAY_TYPE(3);
                return n[0] = 0, n[1] = 0, n[2] = 0, n
            }, vec3.clone = function(n) {
                var t = new glMatrix.ARRAY_TYPE(3);
                return t[0] = n[0], t[1] = n[1], t[2] = n[2], t
            }, vec3.fromValues = function(n, t, e) {
                var r = new glMatrix.ARRAY_TYPE(3);
                return r[0] = n, r[1] = t, r[2] = e, r
            }, vec3.copy = function(n, t) {
                return n[0] = t[0], n[1] = t[1], n[2] = t[2], n
            }, vec3.set = function(n, t, e, r) {
                return n[0] = t, n[1] = e, n[2] = r, n
            }, vec3.add = function(n, t, e) {
                return n[0] = t[0] + e[0], n[1] = t[1] + e[1], n[2] = t[2] + e[2], n
            }, vec3.subtract = function(n, t, e) {
                return n[0] = t[0] - e[0], n[1] = t[1] - e[1], n[2] = t[2] - e[2], n
            }, vec3.sub = vec3.subtract, vec3.multiply = function(n, t, e) {
                return n[0] = t[0] * e[0], n[1] = t[1] * e[1], n[2] = t[2] * e[2], n
            }, vec3.mul = vec3.multiply, vec3.divide = function(n, t, e) {
                return n[0] = t[0] / e[0], n[1] = t[1] / e[1], n[2] = t[2] / e[2], n
            }, vec3.div = vec3.divide, vec3.min = function(n, t, e) {
                return n[0] = Math.min(t[0], e[0]), n[1] = Math.min(t[1], e[1]), n[2] = Math.min(t[2], e[2]), n
            }, vec3.max = function(n, t, e) {
                return n[0] = Math.max(t[0], e[0]), n[1] = Math.max(t[1], e[1]), n[2] = Math.max(t[2], e[2]), n
            }, vec3.scale = function(n, t, e) {
                return n[0] = t[0] * e, n[1] = t[1] * e, n[2] = t[2] * e, n
            }, vec3.scaleAndAdd = function(n, t, e, r) {
                return n[0] = t[0] + e[0] * r, n[1] = t[1] + e[1] * r, n[2] = t[2] + e[2] * r, n
            }, vec3.distance = function(n, t) {
                var e = t[0] - n[0],
                    r = t[1] - n[1],
                    c = t[2] - n[2];
                return Math.sqrt(e * e + r * r + c * c)
            }, vec3.dist = vec3.distance, vec3.squaredDistance = function(n, t) {
                var e = t[0] - n[0],
                    r = t[1] - n[1],
                    c = t[2] - n[2];
                return e * e + r * r + c * c
            }, vec3.sqrDist = vec3.squaredDistance, vec3.length = function(n) {
                var t = n[0],
                    e = n[1],
                    r = n[2];
                return Math.sqrt(t * t + e * e + r * r)
            }, vec3.len = vec3.length, vec3.squaredLength = function(n) {
                var t = n[0],
                    e = n[1],
                    r = n[2];
                return t * t + e * e + r * r
            }, vec3.sqrLen = vec3.squaredLength, vec3.negate = function(n, t) {
                return n[0] = -t[0], n[1] = -t[1], n[2] = -t[2], n
            }, vec3.inverse = function(n, t) {
                return n[0] = 1 / t[0], n[1] = 1 / t[1], n[2] = 1 / t[2], n
            }, vec3.normalize = function(n, t) {
                var e = t[0],
                    r = t[1],
                    c = t[2],
                    a = e * e + r * r + c * c;
                return a > 0 && (a = 1 / Math.sqrt(a), n[0] = t[0] * a, n[1] = t[1] * a, n[2] = t[2] * a), n
            }, vec3.dot = function(n, t) {
                return n[0] * t[0] + n[1] * t[1] + n[2] * t[2]
            }, vec3.cross = function(n, t, e) {
                var r = t[0],
                    c = t[1],
                    a = t[2],
                    u = e[0],
                    v = e[1],
                    i = e[2];
                return n[0] = c * i - a * v, n[1] = a * u - r * i, n[2] = r * v - c * u, n
            }, vec3.lerp = function(n, t, e, r) {
                var c = t[0],
                    a = t[1],
                    u = t[2];
                return n[0] = c + r * (e[0] - c), n[1] = a + r * (e[1] - a), n[2] = u + r * (e[2] - u), n
            }, vec3.hermite = function(n, t, e, r, c, a) {
                var u = a * a,
                    v = u * (2 * a - 3) + 1,
                    i = u * (a - 2) + a,
                    o = u * (a - 1),
                    s = u * (3 - 2 * a);
                return n[0] = t[0] * v + e[0] * i + r[0] * o + c[0] * s, n[1] = t[1] * v + e[1] * i + r[1] * o + c[1] * s, n[2] = t[2] * v + e[2] * i + r[2] * o + c[2] * s, n
            }, vec3.bezier = function(n, t, e, r, c, a) {
                var u = 1 - a,
                    v = u * u,
                    i = a * a,
                    o = v * u,
                    s = 3 * a * v,
                    f = 3 * i * u,
                    M = i * a;
                return n[0] = t[0] * o + e[0] * s + r[0] * f + c[0] * M, n[1] = t[1] * o + e[1] * s + r[1] * f + c[1] * M, n[2] = t[2] * o + e[2] * s + r[2] * f + c[2] * M, n
            }, vec3.random = function(n, t) {
                t = t || 1;
                var e = 2 * glMatrix.RANDOM() * Math.PI,
                    r = 2 * glMatrix.RANDOM() - 1,
                    c = Math.sqrt(1 - r * r) * t;
                return n[0] = Math.cos(e) * c, n[1] = Math.sin(e) * c, n[2] = r * t, n
            }, vec3.transformMat4 = function(n, t, e) {
                var r = t[0],
                    c = t[1],
                    a = t[2],
                    u = e[3] * r + e[7] * c + e[11] * a + e[15];
                return u = u || 1, n[0] = (e[0] * r + e[4] * c + e[8] * a + e[12]) / u, n[1] = (e[1] * r + e[5] * c + e[9] * a + e[13]) / u, n[2] = (e[2] * r + e[6] * c + e[10] * a + e[14]) / u, n
            }, vec3.transformMat3 = function(n, t, e) {
                var r = t[0],
                    c = t[1],
                    a = t[2];
                return n[0] = r * e[0] + c * e[3] + a * e[6], n[1] = r * e[1] + c * e[4] + a * e[7], n[2] = r * e[2] + c * e[5] + a * e[8], n
            }, vec3.transformQuat = function(n, t, e) {
                var r = t[0],
                    c = t[1],
                    a = t[2],
                    u = e[0],
                    v = e[1],
                    i = e[2],
                    o = e[3],
                    s = o * r + v * a - i * c,
                    f = o * c + i * r - u * a,
                    M = o * a + u * c - v * r,
                    h = -u * r - v * c - i * a;
                return n[0] = s * o + h * -u + f * -i - M * -v, n[1] = f * o + h * -v + M * -u - s * -i, n[2] = M * o + h * -i + s * -v - f * -u, n
            }, vec3.rotateX = function(n, t, e, r) {
                var c = [],
                    a = [];
                return c[0] = t[0] - e[0], c[1] = t[1] - e[1], c[2] = t[2] - e[2], a[0] = c[0], a[1] = c[1] * Math.cos(r) - c[2] * Math.sin(r), a[2] = c[1] * Math.sin(r) + c[2] * Math.cos(r), n[0] = a[0] + e[0], n[1] = a[1] + e[1], n[2] = a[2] + e[2], n
            }, vec3.rotateY = function(n, t, e, r) {
                var c = [],
                    a = [];
                return c[0] = t[0] - e[0], c[1] = t[1] - e[1], c[2] = t[2] - e[2], a[0] = c[2] * Math.sin(r) + c[0] * Math.cos(r), a[1] = c[1], a[2] = c[2] * Math.cos(r) - c[0] * Math.sin(r), n[0] = a[0] + e[0], n[1] = a[1] + e[1], n[2] = a[2] + e[2], n
            }, vec3.rotateZ = function(n, t, e, r) {
                var c = [],
                    a = [];
                return c[0] = t[0] - e[0], c[1] = t[1] - e[1], c[2] = t[2] - e[2], a[0] = c[0] * Math.cos(r) - c[1] * Math.sin(r), a[1] = c[0] * Math.sin(r) + c[1] * Math.cos(r), a[2] = c[2], n[0] = a[0] + e[0], n[1] = a[1] + e[1], n[2] = a[2] + e[2], n
            }, vec3.forEach = function() {
                var n = vec3.create();
                return function(t, e, r, c, a, u) {
                    var v, i;
                    for (e || (e = 3), r || (r = 0), i = c ? Math.min(c * e + r, t.length) : t.length, v = r; i > v; v += e) n[0] = t[v], n[1] = t[v + 1], n[2] = t[v + 2], a(n, n, u), t[v] = n[0], t[v + 1] = n[1], t[v + 2] = n[2];
                    return t
                }
            }(), vec3.angle = function(n, t) {
                var e = vec3.fromValues(n[0], n[1], n[2]),
                    r = vec3.fromValues(t[0], t[1], t[2]);
                vec3.normalize(e, e), vec3.normalize(r, r);
                var c = vec3.dot(e, r);
                return c > 1 ? 0 : Math.acos(c)
            }, vec3.str = function(n) {
                return "vec3(" + n[0] + ", " + n[1] + ", " + n[2] + ")"
            }, module.exports = vec3;
        }, {
            "./common.js": 120
        }],
        128: [function(require, module, exports) {
            var glMatrix = require("./common.js"),
                vec4 = {};
            vec4.create = function() {
                var e = new glMatrix.ARRAY_TYPE(4);
                return e[0] = 0, e[1] = 0, e[2] = 0, e[3] = 0, e
            }, vec4.clone = function(e) {
                var n = new glMatrix.ARRAY_TYPE(4);
                return n[0] = e[0], n[1] = e[1], n[2] = e[2], n[3] = e[3], n
            }, vec4.fromValues = function(e, n, t, r) {
                var c = new glMatrix.ARRAY_TYPE(4);
                return c[0] = e, c[1] = n, c[2] = t, c[3] = r, c
            }, vec4.copy = function(e, n) {
                return e[0] = n[0], e[1] = n[1], e[2] = n[2], e[3] = n[3], e
            }, vec4.set = function(e, n, t, r, c) {
                return e[0] = n, e[1] = t, e[2] = r, e[3] = c, e
            }, vec4.add = function(e, n, t) {
                return e[0] = n[0] + t[0], e[1] = n[1] + t[1], e[2] = n[2] + t[2], e[3] = n[3] + t[3], e
            }, vec4.subtract = function(e, n, t) {
                return e[0] = n[0] - t[0], e[1] = n[1] - t[1], e[2] = n[2] - t[2], e[3] = n[3] - t[3], e
            }, vec4.sub = vec4.subtract, vec4.multiply = function(e, n, t) {
                return e[0] = n[0] * t[0], e[1] = n[1] * t[1], e[2] = n[2] * t[2], e[3] = n[3] * t[3], e
            }, vec4.mul = vec4.multiply, vec4.divide = function(e, n, t) {
                return e[0] = n[0] / t[0], e[1] = n[1] / t[1], e[2] = n[2] / t[2], e[3] = n[3] / t[3], e
            }, vec4.div = vec4.divide, vec4.min = function(e, n, t) {
                return e[0] = Math.min(n[0], t[0]), e[1] = Math.min(n[1], t[1]), e[2] = Math.min(n[2], t[2]), e[3] = Math.min(n[3], t[3]), e
            }, vec4.max = function(e, n, t) {
                return e[0] = Math.max(n[0], t[0]), e[1] = Math.max(n[1], t[1]), e[2] = Math.max(n[2], t[2]), e[3] = Math.max(n[3], t[3]), e
            }, vec4.scale = function(e, n, t) {
                return e[0] = n[0] * t, e[1] = n[1] * t, e[2] = n[2] * t, e[3] = n[3] * t, e
            }, vec4.scaleAndAdd = function(e, n, t, r) {
                return e[0] = n[0] + t[0] * r, e[1] = n[1] + t[1] * r, e[2] = n[2] + t[2] * r, e[3] = n[3] + t[3] * r, e
            }, vec4.distance = function(e, n) {
                var t = n[0] - e[0],
                    r = n[1] - e[1],
                    c = n[2] - e[2],
                    u = n[3] - e[3];
                return Math.sqrt(t * t + r * r + c * c + u * u)
            }, vec4.dist = vec4.distance, vec4.squaredDistance = function(e, n) {
                var t = n[0] - e[0],
                    r = n[1] - e[1],
                    c = n[2] - e[2],
                    u = n[3] - e[3];
                return t * t + r * r + c * c + u * u
            }, vec4.sqrDist = vec4.squaredDistance, vec4.length = function(e) {
                var n = e[0],
                    t = e[1],
                    r = e[2],
                    c = e[3];
                return Math.sqrt(n * n + t * t + r * r + c * c)
            }, vec4.len = vec4.length, vec4.squaredLength = function(e) {
                var n = e[0],
                    t = e[1],
                    r = e[2],
                    c = e[3];
                return n * n + t * t + r * r + c * c
            }, vec4.sqrLen = vec4.squaredLength, vec4.negate = function(e, n) {
                return e[0] = -n[0], e[1] = -n[1], e[2] = -n[2], e[3] = -n[3], e
            }, vec4.inverse = function(e, n) {
                return e[0] = 1 / n[0], e[1] = 1 / n[1], e[2] = 1 / n[2], e[3] = 1 / n[3], e
            }, vec4.normalize = function(e, n) {
                var t = n[0],
                    r = n[1],
                    c = n[2],
                    u = n[3],
                    a = t * t + r * r + c * c + u * u;
                return a > 0 && (a = 1 / Math.sqrt(a), e[0] = t * a, e[1] = r * a, e[2] = c * a, e[3] = u * a), e
            }, vec4.dot = function(e, n) {
                return e[0] * n[0] + e[1] * n[1] + e[2] * n[2] + e[3] * n[3]
            }, vec4.lerp = function(e, n, t, r) {
                var c = n[0],
                    u = n[1],
                    a = n[2],
                    v = n[3];
                return e[0] = c + r * (t[0] - c), e[1] = u + r * (t[1] - u), e[2] = a + r * (t[2] - a), e[3] = v + r * (t[3] - v), e
            }, vec4.random = function(e, n) {
                return n = n || 1, e[0] = glMatrix.RANDOM(), e[1] = glMatrix.RANDOM(), e[2] = glMatrix.RANDOM(), e[3] = glMatrix.RANDOM(), vec4.normalize(e, e), vec4.scale(e, e, n), e
            }, vec4.transformMat4 = function(e, n, t) {
                var r = n[0],
                    c = n[1],
                    u = n[2],
                    a = n[3];
                return e[0] = t[0] * r + t[4] * c + t[8] * u + t[12] * a, e[1] = t[1] * r + t[5] * c + t[9] * u + t[13] * a, e[2] = t[2] * r + t[6] * c + t[10] * u + t[14] * a, e[3] = t[3] * r + t[7] * c + t[11] * u + t[15] * a, e
            }, vec4.transformQuat = function(e, n, t) {
                var r = n[0],
                    c = n[1],
                    u = n[2],
                    a = t[0],
                    v = t[1],
                    i = t[2],
                    o = t[3],
                    f = o * r + v * u - i * c,
                    s = o * c + i * r - a * u,
                    l = o * u + a * c - v * r,
                    M = -a * r - v * c - i * u;
                return e[0] = f * o + M * -a + s * -i - l * -v, e[1] = s * o + M * -v + l * -a - f * -i, e[2] = l * o + M * -i + f * -v - s * -a, e[3] = n[3], e
            }, vec4.forEach = function() {
                var e = vec4.create();
                return function(n, t, r, c, u, a) {
                    var v, i;
                    for (t || (t = 4), r || (r = 0), i = c ? Math.min(c * t + r, n.length) : n.length, v = r; i > v; v += t) e[0] = n[v], e[1] = n[v + 1], e[2] = n[v + 2], e[3] = n[v + 3], u(e, e, a), n[v] = e[0], n[v + 1] = e[1], n[v + 2] = e[2], n[v + 3] = e[3];
                    return n
                }
            }(), vec4.str = function(e) {
                return "vec4(" + e[0] + ", " + e[1] + ", " + e[2] + ", " + e[3] + ")"
            }, module.exports = vec4;
        }, {
            "./common.js": 120
        }],
        129: [function(require, module, exports) {
            "use strict";

            function constant(r) {
                return function() {
                    return r
                }
            }

            function interpolateNumber(r, t, n) {
                return r * (1 - n) + t * n
            }

            function interpolateArray(r, t, n) {
                for (var e = [], o = 0; o < r.length; o++) e[o] = interpolateNumber(r[o], t[o], n);
                return e
            }
            exports.interpolated = function(r) {
                if (!r.stops) return constant(r);
                var t = r.stops,
                    n = r.base || 1,
                    e = Array.isArray(t[0][1]) ? interpolateArray : interpolateNumber;
                return function(r) {
                    for (var o, a, i = 0; i < t.length; i++) {
                        var u = t[i];
                        if (u[0] <= r && (o = u), u[0] > r) {
                            a = u;
                            break
                        }
                    }
                    if (o && a) {
                        var s = a[0] - o[0],
                            f = r - o[0],
                            p = 1 === n ? f / s : (Math.pow(n, f) - 1) / (Math.pow(n, s) - 1);
                        return e(o[1], a[1], p)
                    }
                    return o ? o[1] : a ? a[1] : void 0
                }
            }, exports["piecewise-constant"] = function(r) {
                if (!r.stops) return constant(r);
                var t = r.stops;
                return function(r) {
                    for (var n = 0; n < t.length; n++)
                        if (t[n][0] > r) return t[0 === n ? 0 : n - 1][1];
                    return t[t.length - 1][1]
                }
            };
        }, {}],
        130: [function(require, module, exports) {
            "use strict";
            var reference = require("../../reference/latest.js"),
                validate = require("./parsed");
            module.exports = function(e) {
                return validate(e, reference)
            };
        }, {
            "../../reference/latest.js": 132,
            "./parsed": 131
        }],
        131: [function(require, module, exports) {
            "use strict";

            function typeof_(e) {
                return e instanceof Number ? "number" : e instanceof String ? "string" : e instanceof Boolean ? "boolean" : Array.isArray(e) ? "array" : null === e ? "null" : typeof e
            }

            function unbundle(e) {
                return e instanceof Number || e instanceof String || e instanceof Boolean ? e.valueOf() : e
            }
            var parseCSSColor = require("csscolorparser").parseCSSColor,
                format = require("util").format;
            module.exports = function(e, t) {
                function n(e, t) {
                    var n = {
                        message: (e ? e + ": " : "") + format.apply(format, Array.prototype.slice.call(arguments, 2))
                    };
                    null !== t && void 0 !== t && t.__line__ && (n.line = t.__line__), s.push(n)
                }

                function r(e, o, i) {
                    var s = typeof_(o);
                    if ("string" === s && "@" === o[0]) {
                        if (t.$version > 7) return n(e, o, "constants have been deprecated as of v8");
                        if (!(o in a)) return n(e, o, 'constant "%s" not found', o);
                        o = a[o], s = typeof_(o)
                    }
                    if (i["function"] && "object" === s) return r["function"](e, o, i);
                    if (i.type) {
                        var u = r[i.type];
                        if (u) return u(e, o, i);
                        i = t[i.type]
                    }
                    r.object(e, o, i)
                }

                function o(e) {
                    return function(t, r, o) {
                        var a = typeof_(r);
                        a !== e && n(t, r, "%s expected, %s found", e, a), "minimum" in o && r < o.minimum && n(t, r, "%s is less than the minimum value %s", r, o.minimum), "maximum" in o && r > o.maximum && n(t, r, "%s is greater than the maximum value %s", r, o.maximum)
                    }
                }
                var a = e.constants || {},
                    i = {},
                    s = [];
                return r.constants = function(e, r) {
                    if (t.$version > 7) {
                        if (r) return n(e, r, "constants have been deprecated as of v8")
                    } else {
                        var o = typeof_(r);
                        if ("object" !== o) return n(e, r, "object expected, %s found", o);
                        for (var a in r) "@" !== a[0] && n(e + "." + a, r[a], 'constants must start with "@"')
                    }
                }, r.source = function(e, o) {
                    if (!o.type) return void n(e, o, '"type" is required');
                    var a = unbundle(o.type);
                    switch (a) {
                        case "vector":
                        case "raster":
                            if (r.object(e, o, t.source_tile), "url" in o)
                                for (var i in o)["type", "url", "tileSize"].indexOf(i) < 0 && n(e + "." + i, o[i], 'a source with a "url" property may not include a "%s" property', i);
                            break;
                        case "geojson":
                            r.object(e, o, t.source_geojson);
                            break;
                        case "video":
                            r.object(e, o, t.source_video);
                            break;
                        case "image":
                            r.object(e, o, t.source_image);
                            break;
                        default:
                            r["enum"](e + ".type", o.type, {
                                values: ["vector", "raster", "geojson", "video", "image"]
                            })
                    }
                }, r.layer = function(o, a) {
                    a.type || a.ref || n(o, a, 'either "type" or "ref" is required');
                    var s = unbundle(a.type),
                        u = unbundle(a.ref);
                    if (a.id && (i[a.id] ? n(o, a.id, 'duplicate layer id "%s", previously used at line %d', a.id, i[a.id]) : i[a.id] = a.id.__line__), "ref" in a) {
                        ["type", "source", "source-layer", "filter", "layout"].forEach(function(e) {
                            e in a && n(o, a[e], '"%s" is prohibited for ref layers', e)
                        });
                        var c;
                        e.layers.forEach(function(e) {
                            e.id == u && (c = e)
                        }), c ? c.ref ? n(o, a.ref, "ref cannot reference another ref layer") : s = c.type : n(o, a.ref, 'ref layer "%s" not found', u)
                    } else if ("background" !== s)
                        if (a.source) {
                            var f = e.sources[a.source];
                            f ? "vector" == f.type && "raster" == s ? n(o, a.source, 'layer "%s" requires a raster source', a.id) : "raster" == f.type && "raster" != s && n(o, a.source, 'layer "%s" requires a vector source', a.id) : n(o, a.source, 'source "%s" not found', a.source)
                        } else n(o, a, 'missing required property "source"');
                    r.object(o, a, t.layer, {
                        filter: r.filter,
                        layout: function(e, n) {
                            var o = t["layout_" + s];
                            return s && o && r(e, n, o)
                        },
                        paint: function(e, n) {
                            var o = t["paint_" + s];
                            return s && o && r(e, n, o)
                        }
                    })
                }, r.object = function(e, o, a, i) {
                    i = i || {};
                    var s = typeof_(o);
                    if ("object" !== s) return n(e, o, "object expected, %s found", s);
                    for (var u in o) {
                        var c = u.split(".")[0],
                            f = a[c] || a["*"],
                            l = c.match(/^(.*)-transition$/);
                        f ? (i[c] || r)((e ? e + "." : e) + u, o[u], f) : l && a[l[1]] && a[l[1]].transition ? r((e ? e + "." : e) + u, o[u], t.transition) : "" !== e && 1 !== e.split(".").length && n(e, o[u], 'unknown property "%s"', u)
                    }
                    for (var p in a) a[p].required && void 0 === a[p]["default"] && void 0 === o[p] && n(e, o, 'missing required property "%s"', p)
                }, r.array = function(t, o, a, i) {
                    if ("array" !== typeof_(o)) return n(t, o, "array expected, %s found", typeof_(o));
                    if (a.length && o.length !== a.length) return n(t, o, "array length %d expected, length %d found", a.length, o.length);
                    if (a["min-length"] && o.length < a["min-length"]) return n(t, o, "array length at least %d expected, length %d found", a["min-length"], o.length);
                    var s = {
                        type: a.value
                    };
                    e.version < 7 && (s["function"] = a["function"]), "object" === typeof_(a.value) && (s = a.value);
                    for (var u = 0; u < o.length; u++)(i || r)(t + "[" + u + "]", o[u], s)
                }, r.filter = function(e, o) {
                    var a;
                    if ("array" !== typeof_(o)) return n(e, o, "array expected, %s found", typeof_(o));
                    if (o.length < 1) return n(e, o, "filter array must have at least 1 element");
                    switch (r["enum"](e + "[0]", o[0], t.filter_operator), unbundle(o[0])) {
                        case "<":
                        case "<=":
                        case ">":
                        case ">=":
                            o.length >= 2 && "$type" == o[1] && n(e, o, '"$type" cannot be use with operator "%s"', o[0]);
                        case "==":
                        case "!=":
                            3 != o.length && n(e, o, 'filter array for operator "%s" must have 3 elements', o[0]);
                        case "in":
                        case "!in":
                            o.length >= 2 && (a = typeof_(o[1]), "string" !== a ? n(e + "[1]", o[1], "string expected, %s found", a) : "@" === o[1][0] && n(e + "[1]", o[1], "filter key cannot be a constant"));
                            for (var i = 2; i < o.length; i++) a = typeof_(o[i]), "$type" == o[1] ? r["enum"](e + "[" + i + "]", o[i], t.geometry_type) : "string" === a && "@" === o[i][0] ? n(e + "[" + i + "]", o[i], "filter value cannot be a constant") : "string" !== a && "number" !== a && "boolean" !== a && n(e + "[" + i + "]", o[i], "string, number, or boolean expected, %s found", a);
                            break;
                        case "any":
                        case "all":
                        case "none":
                            for (i = 1; i < o.length; i++) r.filter(e + "[" + i + "]", o[i])
                    }
                }, r["function"] = function(e, o, a) {
                    r.object(e, o, t["function"], {
                        stops: function(e, t, o) {
                            var i = -(1 / 0);
                            r.array(e, t, o, function(e, t) {
                                return "array" !== typeof_(t) ? n(e, t, "array expected, %s found", typeof_(t)) : 2 !== t.length ? n(e, t, "array length %d expected, length %d found", 2, t.length) : (r(e + "[0]", t[0], {
                                    type: "number"
                                }), r(e + "[1]", t[1], a), void("number" === typeof_(t[0]) && ("piecewise-constant" === a["function"] && t[0] % 1 !== 0 && n(e + "[0]", t[0], "zoom level for piecewise-constant functions must be an integer"), t[0] < i && n(e + "[0]", t[0], "array stops must appear in ascending order"), i = t[0])))
                            }), "array" === typeof_(t) && 0 === t.length && n(e, t, "array must have at least one stop")
                        }
                    })
                }, r["enum"] = function(e, t, r) {
                    -1 === r.values.indexOf(unbundle(t)) && n(e, t, "expected one of [%s], %s found", r.values.join(", "), t)
                }, r.color = function(e, t) {
                    var r = typeof_(t);
                    return "string" !== r ? n(e, t, "color expected, %s found", r) : null === parseCSSColor(t) ? n(e, t, 'color expected, "%s" found', t) : void 0
                }, r.number = o("number"), r.string = o("string"), r["boolean"] = o("boolean"), r["*"] = function() {}, r("", e, t.$root), t.$version > 7 && e.constants && r.constants("constants", e.constants), s.sort(function(e, t) {
                    return e.line - t.line
                }), s
            };
        }, {
            "csscolorparser": 111,
            "util": 110
        }],
        132: [function(require, module, exports) {
            module.exports = require("./v8.json");
        }, {
            "./v8.json": 133
        }],
        133: [function(require, module, exports) {
            module.exports = {
                "$version": 8,
                "$root": {
                    "version": {
                        "required": true,
                        "type": "enum",
                        "values": [8],
                        "doc": "Stylesheet version number. Must be 8."
                    },
                    "name": {
                        "type": "string",
                        "doc": "A human-readable name for the style."
                    },
                    "metadata": {
                        "type": "*",
                        "doc": "Arbitrary properties useful to track with the stylesheet, but do not influence rendering. Properties should be prefixed to avoid collisions, like 'mapbox:'."
                    },
                    "center": {
                        "type": "array",
                        "value": "number",
                        "doc": "Default centerpoint in longitude and latitude."
                    },
                    "zoom": {
                        "type": "number",
                        "doc": "Default zoom level."
                    },
                    "bearing": {
                        "type": "number",
                        "default": 0,
                        "period": 360,
                        "units": "degrees",
                        "doc": "Default bearing, in degrees."
                    },
                    "pitch": {
                        "type": "number",
                        "default": 0,
                        "units": "degrees",
                        "doc": "Default pitch, in degrees. Zero is perpendicular to the surface"
                    },
                    "sources": {
                        "required": true,
                        "type": "sources",
                        "doc": "Data source specifications."
                    },
                    "sprite": {
                        "type": "string",
                        "doc": "A base URL for retrieving the sprite image and metadata. The extensions `.png`, `.json` and scale factor `@2x.png` will be automatically appended."
                    },
                    "glyphs": {
                        "type": "string",
                        "doc": "A URL template for loading signed-distance-field glyph sets in PBF format. Valid tokens are {fontstack} and {range}."
                    },
                    "transition": {
                        "type": "transition",
                        "doc": "A global transition definition to use as a default across properties."
                    },
                    "layers": {
                        "required": true,
                        "type": "array",
                        "value": "layer",
                        "doc": "Layers will be drawn in the order of this array."
                    }
                },
                "sources": {
                    "*": {
                        "type": "source",
                        "doc": "Specification of a data source. For vector and raster sources, either TileJSON or a URL to a TileJSON must be provided. For GeoJSON and video sources, a URL must be provided."
                    }
                },
                "source": ["source_tile", "source_geojson", "source_video", "source_image"],
                "source_tile": {
                    "type": {
                        "required": true,
                        "type": "enum",
                        "values": ["vector", "raster"],
                        "doc": "The data type of the source."
                    },
                    "url": {
                        "type": "string",
                        "doc": "A URL to a TileJSON resource. Supported protocols are `http:`, `https:`, and `mapbox://<mapid>`."
                    },
                    "tiles": {
                        "type": "array",
                        "value": "string",
                        "doc": "An array of one or more tile source URLs, as in the TileJSON spec."
                    },
                    "minzoom": {
                        "type": "number",
                        "default": 0,
                        "doc": "Minimum zoom level for which tiles are available, as in the TileJSON spec."
                    },
                    "maxzoom": {
                        "type": "number",
                        "default": 22,
                        "doc": "Maximum zoom level for which tiles are available, as in the TileJSON spec. Data from tiles at the maxzoom are used when displaying the map at higher zoom levels."
                    },
                    "tileSize": {
                        "type": "number",
                        "default": 512,
                        "units": "pixels",
                        "doc": "The minimum visual size to display tiles for this layer. Only configurable for raster layers."
                    },
                    "*": {
                        "type": "*",
                        "doc": "Other keys to configure the data source."
                    }
                },
                "source_geojson": {
                    "type": {
                        "required": true,
                        "type": "enum",
                        "values": ["geojson"]
                    },
                    "data": {
                        "type": "*"
                    },
                    "maxzoom": {
                        "type": "number",
                        "default": 14,
                        "doc": "Maximum zoom to preserve detail at."
                    },
                    "buffer": {
                        "type": "number",
                        "default": 64,
                        "doc": "Tile buffer on each side."
                    },
                    "tolerance": {
                        "type": "number",
                        "default": 3,
                        "doc": "Simplification tolerance (higher means simpler)."
                    }
                },
                "source_video": {
                    "type": {
                        "required": true,
                        "type": "enum",
                        "values": ["video"]
                    },
                    "urls": {
                        "required": true,
                        "type": "array",
                        "value": "string",
                        "doc": "URLs to video content in order of preferred format."
                    },
                    "coordinates": {
                        "required": true,
                        "doc": "Corners of video specified in longitude, latitude pairs.",
                        "type": "array",
                        "length": 4,
                        "value": {
                            "type": "array",
                            "length": 2,
                            "value": "number"
                        }
                    }
                },
                "source_image": {
                    "type": {
                        "required": true,
                        "type": "enum",
                        "values": ["image"]
                    },
                    "url": {
                        "required": true,
                        "type": "string",
                        "doc": "URL that points to an image"
                    },
                    "coordinates": {
                        "required": true,
                        "doc": "Corners of image specified in longitude, latitude pairs.",
                        "type": "array",
                        "length": 4,
                        "value": {
                            "type": "array",
                            "length": 2,
                            "value": "number"
                        }
                    }
                },
                "layer": {
                    "id": {
                        "type": "string",
                        "doc": "Unique layer name."
                    },
                    "type": {
                        "type": "enum",
                        "values": ["fill", "line", "symbol", "circle", "raster", "background"],
                        "doc": "Rendering type of this layer."
                    },
                    "metadata": {
                        "type": "*",
                        "doc": "Arbitrary properties useful to track with the layer, but do not influence rendering. Properties should be prefixed to avoid collisions, like 'mapbox:'."
                    },
                    "ref": {
                        "type": "string",
                        "doc": "References another layer to copy `type`, `source`, `source-layer`, `minzoom`, `maxzoom`, `filter`, and `layout` properties from. This allows the layers to share processing and be more efficient."
                    },
                    "source": {
                        "type": "string",
                        "doc": "Name of a source description to be used for this layer."
                    },
                    "source-layer": {
                        "type": "string",
                        "doc": "Layer to use from a vector tile source. Required if the source supports multiple layers."
                    },
                    "minzoom": {
                        "type": "number",
                        "minimum": 0,
                        "maximum": 22,
                        "doc": "The minimum zoom level on which the layer gets parsed and appears on."
                    },
                    "maxzoom": {
                        "type": "number",
                        "minimum": 0,
                        "maximum": 22,
                        "doc": "The maximum zoom level on which the layer gets parsed and appears on."
                    },
                    "interactive": {
                        "type": "boolean",
                        "doc": "Enable querying of feature data from this layer for interactivity.",
                        "default": false
                    },
                    "filter": {
                        "type": "filter",
                        "doc": "A expression specifying conditions on source features. Only features that match the filter are displayed."
                    },
                    "layout": {
                        "type": "layout",
                        "doc": "Layout properties for the layer."
                    },
                    "paint": {
                        "type": "paint",
                        "doc": "Default paint properties for this layer."
                    },
                    "paint.*": {
                        "type": "paint",
                        "doc": "Class-specific paint properties for this layer. The class name is the part after the first dot."
                    }
                },
                "layout": ["layout_fill", "layout_line", "layout_circle", "layout_symbol", "layout_raster", "layout_background"],
                "layout_background": {
                    "visibility": {
                        "type": "enum",
                        "function": "piecewise-constant",
                        "values": ["visible", "none"],
                        "default": "visible",
                        "doc": "The display of this layer. `none` hides this layer."
                    }
                },
                "layout_fill": {
                    "visibility": {
                        "type": "enum",
                        "function": "piecewise-constant",
                        "values": ["visible", "none"],
                        "default": "visible",
                        "doc": "The display of this layer. `none` hides this layer."
                    }
                },
                "layout_circle": {
                    "visibility": {
                        "type": "enum",
                        "function": "piecewise-constant",
                        "values": ["visible", "none"],
                        "default": "visible",
                        "doc": "The display of this layer. `none` hides this layer."
                    }
                },
                "layout_line": {
                    "line-cap": {
                        "type": "enum",
                        "function": "piecewise-constant",
                        "values": ["butt", "round", "square"],
                        "default": "butt",
                        "doc": "The display of line endings."
                    },
                    "line-join": {
                        "type": "enum",
                        "function": "piecewise-constant",
                        "values": ["bevel", "round", "miter"],
                        "default": "miter",
                        "doc": "The display of lines when joining."
                    },
                    "line-miter-limit": {
                        "type": "number",
                        "default": 2,
                        "function": "interpolated",
                        "doc": "Used to automatically convert miter joins to bevel joins for sharp angles.",
                        "requires": [{
                            "line-join": "miter"
                        }]
                    },
                    "line-round-limit": {
                        "type": "number",
                        "default": 1.05,
                        "function": "interpolated",
                        "doc": "Used to automatically convert round joins to miter joins for shallow angles.",
                        "requires": [{
                            "line-join": "round"
                        }]
                    },
                    "visibility": {
                        "type": "enum",
                        "function": "piecewise-constant",
                        "values": ["visible", "none"],
                        "default": "visible",
                        "doc": "The display of this layer. `none` hides this layer."
                    }
                },
                "layout_symbol": {
                    "symbol-placement": {
                        "type": "enum",
                        "function": "piecewise-constant",
                        "values": ["point", "line"],
                        "default": "point",
                        "doc": "Label placement relative to its geometry. `line` can only be used on LineStrings and Polygons."
                    },
                    "symbol-spacing": {
                        "type": "number",
                        "default": 250,
                        "minimum": 1,
                        "function": "interpolated",
                        "units": "pixels",
                        "doc": "Minimum distance between two symbol anchors.",
                        "requires": [{
                            "symbol-placement": "line"
                        }]
                    },
                    "symbol-avoid-edges": {
                        "type": "boolean",
                        "function": "piecewise-constant",
                        "default": false,
                        "doc": "If true, the symbols will not cross tile edges to avoid mutual collisions. Recommended in layers that don't have enough padding in the vector tile to prevent collisions, or if it is a point symbol layer placed after a line symbol layer."
                    },
                    "icon-allow-overlap": {
                        "type": "boolean",
                        "function": "piecewise-constant",
                        "default": false,
                        "doc": "If true, the icon will be visible even if it collides with other icons and text.",
                        "requires": ["icon-image"]
                    },
                    "icon-ignore-placement": {
                        "type": "boolean",
                        "function": "piecewise-constant",
                        "default": false,
                        "doc": "If true, the icon won't affect placement of other icons and text.",
                        "requires": ["icon-image"]
                    },
                    "icon-optional": {
                        "type": "boolean",
                        "function": "piecewise-constant",
                        "default": false,
                        "doc": "If true, the symbol will appear without its icon, in spaces where the icon would make it too large to fit.",
                        "requires": ["icon-image", "text-field"]
                    },
                    "icon-rotation-alignment": {
                        "type": "enum",
                        "function": "piecewise-constant",
                        "values": ["map", "viewport"],
                        "default": "viewport",
                        "doc": "Orientation of icon when map is rotated.",
                        "requires": ["icon-image"]
                    },
                    "icon-size": {
                        "type": "number",
                        "default": 1,
                        "minimum": 0,
                        "function": "interpolated",
                        "doc": "Scale factor for icon. 1 is original size, 3 triples the size.",
                        "requires": ["icon-image"]
                    },
                    "icon-image": {
                        "type": "string",
                        "function": "piecewise-constant",
                        "doc": "A string with {tokens} replaced, referencing the data property to pull from.",
                        "tokens": true
                    },
                    "icon-rotate": {
                        "type": "number",
                        "default": 0,
                        "period": 360,
                        "function": "interpolated",
                        "units": "degrees",
                        "doc": "Rotates the icon clockwise.",
                        "requires": ["icon-image"]
                    },
                    "icon-padding": {
                        "type": "number",
                        "default": 2,
                        "minimum": 0,
                        "function": "interpolated",
                        "units": "pixels",
                        "doc": "Padding value around icon bounding box to avoid icon collisions.",
                        "requires": ["icon-image"]
                    },
                    "icon-keep-upright": {
                        "type": "boolean",
                        "function": "piecewise-constant",
                        "default": false,
                        "doc": "If true, the icon may be flipped to prevent it from being rendered upside-down",
                        "requires": ["icon-image", {
                            "icon-rotation-alignment": "map"
                        }, {
                            "symbol-placement": "line"
                        }]
                    },
                    "icon-offset": {
                        "type": "array",
                        "value": "number",
                        "length": 2,
                        "default": [0, 0],
                        "function": "interpolated",
                        "doc": "Icon's offset distance. Values are [x, y] where negatives indicate left and up, respectively.",
                        "requires": ["icon-image"]
                    },
                    "text-rotation-alignment": {
                        "type": "enum",
                        "function": "piecewise-constant",
                        "values": ["map", "viewport"],
                        "default": "viewport",
                        "doc": "Orientation of icon or text when map is rotated.",
                        "requires": ["text-field"]
                    },
                    "text-field": {
                        "type": "string",
                        "function": "piecewise-constant",
                        "default": "",
                        "tokens": true,
                        "doc": "Value to use for a text label. Feature properties are specified using tokens like {field_name}."
                    },
                    "text-font": {
                        "type": "array",
                        "value": "string",
                        "function": "piecewise-constant",
                        "default": ["Open Sans Regular", "Arial Unicode MS Regular"],
                        "doc": "Font stack to use for displaying text.",
                        "requires": ["text-field"]
                    },
                    "text-size": {
                        "type": "number",
                        "default": 16,
                        "minimum": 0,
                        "units": "pixels",
                        "function": "interpolated",
                        "doc": "Font size. If unspecified, the text will be as big as allowed by the layer definition.",
                        "requires": ["text-field"]
                    },
                    "text-max-width": {
                        "type": "number",
                        "default": 10,
                        "minimum": 0,
                        "units": "em",
                        "function": "interpolated",
                        "doc": "The maximum line width for text wrapping.",
                        "requires": ["text-field"]
                    },
                    "text-line-height": {
                        "type": "number",
                        "default": 1.2,
                        "units": "em",
                        "function": "interpolated",
                        "doc": "Text leading value for multi-line text.",
                        "requires": ["text-field"]
                    },
                    "text-letter-spacing": {
                        "type": "number",
                        "default": 0,
                        "units": "em",
                        "function": "interpolated",
                        "doc": "Text kerning value.",
                        "requires": ["text-field"]
                    },
                    "text-justify": {
                        "type": "enum",
                        "function": "piecewise-constant",
                        "values": ["left", "center", "right"],
                        "default": "center",
                        "doc": "Text justification options.",
                        "requires": ["text-field"]
                    },
                    "text-anchor": {
                        "type": "enum",
                        "function": "piecewise-constant",
                        "values": ["center", "left", "right", "top", "bottom", "top-left", "top-right", "bottom-left", "bottom-right"],
                        "default": "center",
                        "doc": "Which part of the text to place closest to the anchor.",
                        "requires": ["text-field"]
                    },
                    "text-max-angle": {
                        "type": "number",
                        "default": 45,
                        "units": "degrees",
                        "function": "interpolated",
                        "doc": "Maximum angle change between adjacent characters.",
                        "requires": ["text-field", {
                            "symbol-placement": "line"
                        }]
                    },
                    "text-rotate": {
                        "type": "number",
                        "default": 0,
                        "period": 360,
                        "units": "degrees",
                        "function": "interpolated",
                        "doc": "Rotates the text clockwise.",
                        "requires": ["text-field"]
                    },
                    "text-padding": {
                        "type": "number",
                        "default": 2,
                        "minimum": 0,
                        "units": "pixels",
                        "function": "interpolated",
                        "doc": "Padding value around text bounding box to avoid label collisions.",
                        "requires": ["text-field"]
                    },
                    "text-keep-upright": {
                        "type": "boolean",
                        "function": "piecewise-constant",
                        "default": true,
                        "doc": "If true, the text may be flipped vertically to prevent it from being rendered upside-down.",
                        "requires": ["text-field", {
                            "text-rotation-alignment": "map"
                        }, {
                            "symbol-placement": "line"
                        }]
                    },
                    "text-transform": {
                        "type": "enum",
                        "function": "piecewise-constant",
                        "values": ["none", "uppercase", "lowercase"],
                        "default": "none",
                        "doc": "Specifies how to capitalize text, similar to the CSS `text-transform` property.",
                        "requires": ["text-field"]
                    },
                    "text-offset": {
                        "type": "array",
                        "doc": "Specifies the distance that text is offset from its anchor horizontally and vertically.",
                        "value": "number",
                        "units": "ems",
                        "function": "interpolated",
                        "length": 2,
                        "default": [0, 0],
                        "requires": ["text-field"]
                    },
                    "text-allow-overlap": {
                        "type": "boolean",
                        "function": "piecewise-constant",
                        "default": false,
                        "doc": "If true, the text will be visible even if it collides with other icons and labels.",
                        "requires": ["text-field"]
                    },
                    "text-ignore-placement": {
                        "type": "boolean",
                        "function": "piecewise-constant",
                        "default": false,
                        "doc": "If true, the text won't affect placement of other icons and labels.",
                        "requires": ["text-field"]
                    },
                    "text-optional": {
                        "type": "boolean",
                        "function": "piecewise-constant",
                        "default": false,
                        "doc": "If true, icons can be shown without their corresponding text.",
                        "requires": ["text-field", "icon-image"]
                    },
                    "visibility": {
                        "type": "enum",
                        "function": "piecewise-constant",
                        "values": ["visible", "none"],
                        "default": "visible",
                        "doc": "The display of this layer. `none` hides this layer."
                    }
                },
                "layout_raster": {
                    "visibility": {
                        "type": "enum",
                        "function": "piecewise-constant",
                        "values": ["visible", "none"],
                        "default": "visible",
                        "doc": "The display of this layer. `none` hides this layer."
                    }
                },
                "filter": {
                    "type": "array",
                    "value": "*"
                },
                "filter_operator": {
                    "type": "enum",
                    "values": ["==", "!=", ">", ">=", "<", "<=", "in", "!in", "all", "any", "none"]
                },
                "geometry_type": {
                    "type": "enum",
                    "values": ["Point", "LineString", "Polygon"]
                },
                "color_operation": {
                    "type": "enum",
                    "values": ["lighten", "saturate", "spin", "fade", "mix"]
                },
                "function": {
                    "stops": {
                        "type": "array",
                        "required": true,
                        "doc": "An array of stops.",
                        "value": "function_stop"
                    },
                    "base": {
                        "type": "number",
                        "default": 1,
                        "minimum": 0,
                        "doc": "The exponential base of the interpolation curve. It controls the rate at which the result increases. Higher values make the result increase more towards the high end of the range. With `1` the stops are interpolated linearly."
                    }
                },
                "function_stop": {
                    "type": "array",
                    "minimum": 0,
                    "maximum": 22,
                    "value": ["number", "color"],
                    "length": 2,
                    "doc": "Zoom level and value pair."
                },
                "paint": ["paint_fill", "paint_line", "paint_circle", "paint_symbol", "paint_raster", "paint_background"],
                "paint_fill": {
                    "fill-antialias": {
                        "type": "boolean",
                        "function": "piecewise-constant",
                        "default": true,
                        "doc": "Whether or not the fill should be antialiased."
                    },
                    "fill-opacity": {
                        "type": "number",
                        "function": "interpolated",
                        "default": 1,
                        "minimum": 0,
                        "maximum": 1,
                        "doc": "The opacity given to the fill color.",
                        "transition": true
                    },
                    "fill-color": {
                        "type": "color",
                        "default": "#000000",
                        "doc": "The color of the fill.",
                        "function": "interpolated",
                        "transition": true,
                        "requires": [{
                            "!": "fill-pattern"
                        }]
                    },
                    "fill-outline-color": {
                        "type": "color",
                        "doc": "The outline color of the fill. Matches the value of `fill-color` if unspecified.",
                        "function": "interpolated",
                        "transition": true,
                        "requires": [{
                            "!": "fill-pattern"
                        }, {
                            "fill-antialias": true
                        }]
                    },
                    "fill-translate": {
                        "type": "array",
                        "value": "number",
                        "length": 2,
                        "default": [0, 0],
                        "function": "interpolated",
                        "transition": true,
                        "units": "pixels",
                        "doc": "The geometry's offset. Values are [x, y] where negatives indicate left and up, respectively."
                    },
                    "fill-translate-anchor": {
                        "type": "enum",
                        "function": "piecewise-constant",
                        "values": ["map", "viewport"],
                        "doc": "Control whether the translation is relative to the map (north) or viewport (screen)",
                        "default": "map",
                        "requires": ["fill-translate"]
                    },
                    "fill-pattern": {
                        "type": "string",
                        "function": "piecewise-constant",
                        "transition": true,
                        "doc": "Name of image in sprite to use for drawing image fills."
                    }
                },
                "paint_line": {
                    "line-opacity": {
                        "type": "number",
                        "doc": "The opacity at which the line will be drawn.",
                        "function": "interpolated",
                        "default": 1,
                        "minimum": 0,
                        "maximum": 1,
                        "transition": true
                    },
                    "line-color": {
                        "type": "color",
                        "doc": "The color with which the line will be drawn.",
                        "default": "#000000",
                        "function": "interpolated",
                        "transition": true,
                        "requires": [{
                            "!": "line-pattern"
                        }]
                    },
                    "line-translate": {
                        "type": "array",
                        "value": "number",
                        "length": 2,
                        "default": [0, 0],
                        "function": "interpolated",
                        "transition": true,
                        "units": "pixels",
                        "doc": "The geometry's offset. Values are [x, y] where negatives indicate left and up, respectively."
                    },
                    "line-translate-anchor": {
                        "type": "enum",
                        "function": "piecewise-constant",
                        "values": ["map", "viewport"],
                        "doc": "Control whether the translation is relative to the map (north) or viewport (screen)",
                        "default": "map",
                        "requires": ["line-translate"]
                    },
                    "line-width": {
                        "type": "number",
                        "default": 1,
                        "minimum": 0,
                        "function": "interpolated",
                        "transition": true,
                        "units": "pixels",
                        "doc": "Stroke thickness."
                    },
                    "line-gap-width": {
                        "type": "number",
                        "default": 0,
                        "minimum": 0,
                        "doc": "Draws a line casing outside of a line's actual path. Value indicates the width of the inner gap.",
                        "function": "interpolated",
                        "transition": true,
                        "units": "pixels"
                    },
                    "line-blur": {
                        "type": "number",
                        "default": 0,
                        "minimum": 0,
                        "function": "interpolated",
                        "transition": true,
                        "units": "pixels",
                        "doc": "Blur applied to the line, in pixels."
                    },
                    "line-dasharray": {
                        "type": "array",
                        "value": "number",
                        "function": "piecewise-constant",
                        "doc": "Specifies the lengths of the alternating dashes and gaps that form the dash pattern. The lengths are later scaled by the line width. To convert a dash length to pixels, multiply the length by the current line width.",
                        "minimum": 0,
                        "transition": true,
                        "units": "line widths",
                        "requires": [{
                            "!": "line-pattern"
                        }]
                    },
                    "line-pattern": {
                        "type": "string",
                        "function": "piecewise-constant",
                        "transition": true,
                        "doc": "Name of image in sprite to use for drawing image lines."
                    }
                },
                "paint_circle": {
                    "circle-radius": {
                        "type": "number",
                        "default": 5,
                        "minimum": 0,
                        "function": "interpolated",
                        "transition": true,
                        "units": "pixels",
                        "doc": "Circle radius."
                    },
                    "circle-color": {
                        "type": "color",
                        "default": "#000000",
                        "doc": "The color of the circle.",
                        "function": "interpolated",
                        "transition": true
                    },
                    "circle-blur": {
                        "type": "number",
                        "default": 0,
                        "doc": "Amount to blur the circle. 1 blurs the circle such that only the centerpoint is full opacity.",
                        "function": "interpolated",
                        "transition": true
                    },
                    "circle-opacity": {
                        "type": "number",
                        "doc": "The opacity at which the circle will be drawn.",
                        "default": 1,
                        "minimum": 0,
                        "maximum": 1,
                        "function": "interpolated",
                        "transition": true
                    },
                    "circle-translate": {
                        "type": "array",
                        "value": "number",
                        "length": 2,
                        "default": [0, 0],
                        "function": "interpolated",
                        "transition": true,
                        "units": "pixels",
                        "doc": "The geometry's offset. Values are [x, y] where negatives indicate left and up, respectively."
                    },
                    "circle-translate-anchor": {
                        "type": "enum",
                        "function": "piecewise-constant",
                        "values": ["map", "viewport"],
                        "doc": "Control whether the translation is relative to the map (north) or viewport (screen)",
                        "default": "map",
                        "requires": ["circle-translate"]
                    }
                },
                "paint_symbol": {
                    "icon-opacity": {
                        "doc": "The opacity at which the icon will be drawn.",
                        "type": "number",
                        "default": 1,
                        "minimum": 0,
                        "maximum": 1,
                        "function": "interpolated",
                        "transition": true,
                        "requires": ["icon-image"]
                    },
                    "icon-color": {
                        "type": "color",
                        "default": "#000000",
                        "function": "interpolated",
                        "transition": true,
                        "doc": "The color of the icon. This can only be used with sdf icons.",
                        "requires": ["icon-image"]
                    },
                    "icon-halo-color": {
                        "type": "color",
                        "default": "rgba(0, 0, 0, 0)",
                        "function": "interpolated",
                        "transition": true,
                        "doc": "The color of the icon's halo. Icon halos can only be used with sdf icons.",
                        "requires": ["icon-image"]
                    },
                    "icon-halo-width": {
                        "type": "number",
                        "default": 0,
                        "minimum": 0,
                        "function": "interpolated",
                        "transition": true,
                        "units": "pixels",
                        "doc": "Distance of halo to the icon outline.",
                        "requires": ["icon-image"]
                    },
                    "icon-halo-blur": {
                        "type": "number",
                        "default": 0,
                        "minimum": 0,
                        "function": "interpolated",
                        "transition": true,
                        "units": "pixels",
                        "doc": "Fade out the halo towards the outside.",
                        "requires": ["icon-image"]
                    },
                    "icon-translate": {
                        "type": "array",
                        "value": "number",
                        "length": 2,
                        "default": [0, 0],
                        "function": "interpolated",
                        "transition": true,
                        "units": "pixels",
                        "doc": "An icon's offset distance. Values are [x, y] where negatives indicate left and up, respectively.",
                        "requires": ["icon-image"]
                    },
                    "icon-translate-anchor": {
                        "type": "enum",
                        "function": "piecewise-constant",
                        "values": ["map", "viewport"],
                        "doc": "Control whether the translation is relative to the map (north) or viewport (screen)",
                        "default": "map",
                        "requires": ["icon-image", "icon-translate"]
                    },
                    "text-opacity": {
                        "type": "number",
                        "doc": "The opacity at which the text will be drawn.",
                        "default": 1,
                        "minimum": 0,
                        "maximum": 1,
                        "function": "interpolated",
                        "transition": true,
                        "requires": ["text-field"]
                    },
                    "text-color": {
                        "type": "color",
                        "doc": "The color with which the text will be drawn.",
                        "default": "#000000",
                        "function": "interpolated",
                        "transition": true,
                        "requires": ["text-field"]
                    },
                    "text-halo-color": {
                        "type": "color",
                        "default": "rgba(0, 0, 0, 0)",
                        "function": "interpolated",
                        "transition": true,
                        "doc": "The color of the text's halo, which helps it stand out from backgrounds.",
                        "requires": ["text-field"]
                    },
                    "text-halo-width": {
                        "type": "number",
                        "default": 0,
                        "minimum": 0,
                        "function": "interpolated",
                        "transition": true,
                        "units": "pixels",
                        "doc": "Distance of halo to the font outline. Max text halo width is 1/4 of the font-size.",
                        "requires": ["text-field"]
                    },
                    "text-halo-blur": {
                        "type": "number",
                        "default": 0,
                        "minimum": 0,
                        "function": "interpolated",
                        "transition": true,
                        "units": "pixels",
                        "doc": "The halo's fadeout distance towards the outside.",
                        "requires": ["text-field"]
                    },
                    "text-translate": {
                        "type": "array",
                        "value": "number",
                        "length": 2,
                        "default": [0, 0],
                        "function": "interpolated",
                        "transition": true,
                        "units": "pixels",
                        "doc": "Label offset. Values are [x, y] where negatives indicate left and up, respectively.",
                        "requires": ["text-field"]
                    },
                    "text-translate-anchor": {
                        "type": "enum",
                        "function": "piecewise-constant",
                        "values": ["map", "viewport"],
                        "doc": "Control whether the translation is relative to the map (north) or viewport (screen)",
                        "default": "map",
                        "requires": ["text-field", "text-translate"]
                    }
                },
                "paint_raster": {
                    "raster-opacity": {
                        "type": "number",
                        "doc": "The opacity at which the image will be drawn.",
                        "default": 1,
                        "minimum": 0,
                        "maximum": 1,
                        "function": "interpolated",
                        "transition": true
                    },
                    "raster-hue-rotate": {
                        "type": "number",
                        "default": 0,
                        "period": 360,
                        "function": "interpolated",
                        "transition": true,
                        "units": "degrees",
                        "doc": "Rotates hues around the color wheel."
                    },
                    "raster-brightness-min": {
                        "type": "number",
                        "function": "interpolated",
                        "doc": "Increase or reduce the brightness of the image. The value is the minimum brightness.",
                        "default": 0,
                        "minimum": 0,
                        "maximum": 1,
                        "transition": true
                    },
                    "raster-brightness-max": {
                        "type": "number",
                        "function": "interpolated",
                        "doc": "Increase or reduce the brightness of the image. The value is the maximum brightness.",
                        "default": 1,
                        "minimum": 0,
                        "maximum": 1,
                        "transition": true
                    },
                    "raster-saturation": {
                        "type": "number",
                        "doc": "Increase or reduce the saturation of the image.",
                        "default": 0,
                        "minimum": -1,
                        "maximum": 1,
                        "function": "interpolated",
                        "transition": true
                    },
                    "raster-contrast": {
                        "type": "number",
                        "doc": "Increase or reduce the contrast of the image.",
                        "default": 0,
                        "minimum": -1,
                        "maximum": 1,
                        "function": "interpolated",
                        "transition": true
                    },
                    "raster-fade-duration": {
                        "type": "number",
                        "default": 300,
                        "minimum": 0,
                        "function": "interpolated",
                        "transition": true,
                        "units": "milliseconds",
                        "doc": "Fade duration when a new tile is added."
                    }
                },
                "paint_background": {
                    "background-color": {
                        "type": "color",
                        "default": "#000000",
                        "doc": "The color with which the background will be drawn.",
                        "function": "interpolated",
                        "transition": true,
                        "requires": [{
                            "!": "background-pattern"
                        }]
                    },
                    "background-pattern": {
                        "type": "string",
                        "function": "piecewise-constant",
                        "transition": true,
                        "doc": "Optionally an image which is drawn as the background."
                    },
                    "background-opacity": {
                        "type": "number",
                        "default": 1,
                        "minimum": 0,
                        "maximum": 1,
                        "doc": "The opacity at which the background will be drawn.",
                        "function": "interpolated",
                        "transition": true
                    }
                },
                "transition": {
                    "duration": {
                        "type": "number",
                        "default": 300,
                        "minimum": 0,
                        "units": "milliseconds",
                        "doc": "Time allotted for transitions to complete."
                    },
                    "delay": {
                        "type": "number",
                        "default": 0,
                        "minimum": 0,
                        "units": "milliseconds",
                        "doc": "Length of time before a transition begins."
                    }
                }
            }
        }, {}],
        134: [function(require, module, exports) {
            "use strict";

            function Buffer(t) {
                var e;
                t && t.length && (e = t, t = e.length);
                var r = new Uint8Array(t || 0);
                return e && r.set(e), r.readUInt32LE = BufferMethods.readUInt32LE, r.writeUInt32LE = BufferMethods.writeUInt32LE, r.readInt32LE = BufferMethods.readInt32LE, r.writeInt32LE = BufferMethods.writeInt32LE, r.readFloatLE = BufferMethods.readFloatLE, r.writeFloatLE = BufferMethods.writeFloatLE, r.readDoubleLE = BufferMethods.readDoubleLE, r.writeDoubleLE = BufferMethods.writeDoubleLE, r.toString = BufferMethods.toString, r.write = BufferMethods.write, r.slice = BufferMethods.slice, r.copy = BufferMethods.copy, r._isBuffer = !0, r
            }

            function encodeString(t) {
                for (var e, r, n = t.length, i = [], o = 0; n > o; o++) {
                    if (e = t.charCodeAt(o), e > 55295 && 57344 > e) {
                        if (!r) {
                            e > 56319 || o + 1 === n ? i.push(239, 191, 189) : r = e;
                            continue
                        }
                        if (56320 > e) {
                            i.push(239, 191, 189), r = e;
                            continue
                        }
                        e = r - 55296 << 10 | e - 56320 | 65536, r = null
                    } else r && (i.push(239, 191, 189), r = null);
                    128 > e ? i.push(e) : 2048 > e ? i.push(e >> 6 | 192, 63 & e | 128) : 65536 > e ? i.push(e >> 12 | 224, e >> 6 & 63 | 128, 63 & e | 128) : i.push(e >> 18 | 240, e >> 12 & 63 | 128, e >> 6 & 63 | 128, 63 & e | 128)
                }
                return i
            }
            module.exports = Buffer;
            var ieee754 = require("ieee754"),
                BufferMethods, lastStr, lastStrEncoded;
            BufferMethods = {
                readUInt32LE: function(t) {
                    return (this[t] | this[t + 1] << 8 | this[t + 2] << 16) + 16777216 * this[t + 3]
                },
                writeUInt32LE: function(t, e) {
                    this[e] = t, this[e + 1] = t >>> 8, this[e + 2] = t >>> 16, this[e + 3] = t >>> 24
                },
                readInt32LE: function(t) {
                    return (this[t] | this[t + 1] << 8 | this[t + 2] << 16) + (this[t + 3] << 24)
                },
                readFloatLE: function(t) {
                    return ieee754.read(this, t, !0, 23, 4)
                },
                readDoubleLE: function(t) {
                    return ieee754.read(this, t, !0, 52, 8)
                },
                writeFloatLE: function(t, e) {
                    return ieee754.write(this, t, e, !0, 23, 4)
                },
                writeDoubleLE: function(t, e) {
                    return ieee754.write(this, t, e, !0, 52, 8)
                },
                toString: function(t, e, r) {
                    var n = "",
                        i = "";
                    e = e || 0, r = Math.min(this.length, r || this.length);
                    for (var o = e; r > o; o++) {
                        var u = this[o];
                        127 >= u ? (n += decodeURIComponent(i) + String.fromCharCode(u), i = "") : i += "%" + u.toString(16)
                    }
                    return n += decodeURIComponent(i)
                },
                write: function(t, e) {
                    for (var r = t === lastStr ? lastStrEncoded : encodeString(t), n = 0; n < r.length; n++) this[e + n] = r[n]
                },
                slice: function(t, e) {
                    return this.subarray(t, e)
                },
                copy: function(t, e) {
                    e = e || 0;
                    for (var r = 0; r < this.length; r++) t[e + r] = this[r]
                }
            }, BufferMethods.writeInt32LE = BufferMethods.writeUInt32LE, Buffer.byteLength = function(t) {
                return lastStr = t, lastStrEncoded = encodeString(t), lastStrEncoded.length
            }, Buffer.isBuffer = function(t) {
                return !(!t || !t._isBuffer)
            };
        }, {
            "ieee754": 136
        }],
        135: [function(require, module, exports) {
            (function(global) {
                "use strict";

                function Pbf(t) {
                    this.buf = Buffer.isBuffer(t) ? t : new Buffer(t || 0), this.pos = 0, this.length = this.buf.length
                }

                function writePackedVarint(t, i) {
                    for (var e = 0; e < t.length; e++) i.writeVarint(t[e])
                }

                function writePackedSVarint(t, i) {
                    for (var e = 0; e < t.length; e++) i.writeSVarint(t[e])
                }

                function writePackedFloat(t, i) {
                    for (var e = 0; e < t.length; e++) i.writeFloat(t[e])
                }

                function writePackedDouble(t, i) {
                    for (var e = 0; e < t.length; e++) i.writeDouble(t[e])
                }

                function writePackedBoolean(t, i) {
                    for (var e = 0; e < t.length; e++) i.writeBoolean(t[e])
                }

                function writePackedFixed32(t, i) {
                    for (var e = 0; e < t.length; e++) i.writeFixed32(t[e])
                }

                function writePackedSFixed32(t, i) {
                    for (var e = 0; e < t.length; e++) i.writeSFixed32(t[e])
                }

                function writePackedFixed64(t, i) {
                    for (var e = 0; e < t.length; e++) i.writeFixed64(t[e])
                }

                function writePackedSFixed64(t, i) {
                    for (var e = 0; e < t.length; e++) i.writeSFixed64(t[e])
                }
                module.exports = Pbf;
                var Buffer = global.Buffer || require("./buffer");
                Pbf.Varint = 0, Pbf.Fixed64 = 1, Pbf.Bytes = 2, Pbf.Fixed32 = 5;
                var SHIFT_LEFT_32 = 4294967296,
                    SHIFT_RIGHT_32 = 1 / SHIFT_LEFT_32,
                    POW_2_63 = Math.pow(2, 63);
                Pbf.prototype = {
                    destroy: function() {
                        this.buf = null
                    },
                    readFields: function(t, i, e) {
                        for (e = e || this.length; this.pos < e;) {
                            var r = this.readVarint(),
                                s = r >> 3,
                                n = this.pos;
                            t(s, i, this), this.pos === n && this.skip(r)
                        }
                        return i
                    },
                    readMessage: function(t, i) {
                        return this.readFields(t, i, this.readVarint() + this.pos)
                    },
                    readFixed32: function() {
                        var t = this.buf.readUInt32LE(this.pos);
                        return this.pos += 4, t
                    },
                    readSFixed32: function() {
                        var t = this.buf.readInt32LE(this.pos);
                        return this.pos += 4, t
                    },
                    readFixed64: function() {
                        var t = this.buf.readUInt32LE(this.pos) + this.buf.readUInt32LE(this.pos + 4) * SHIFT_LEFT_32;
                        return this.pos += 8, t
                    },
                    readSFixed64: function() {
                        var t = this.buf.readUInt32LE(this.pos) + this.buf.readInt32LE(this.pos + 4) * SHIFT_LEFT_32;
                        return this.pos += 8, t
                    },
                    readFloat: function() {
                        var t = this.buf.readFloatLE(this.pos);
                        return this.pos += 4, t
                    },
                    readDouble: function() {
                        var t = this.buf.readDoubleLE(this.pos);
                        return this.pos += 8, t
                    },
                    readVarint: function() {
                        var t, i, e, r, s, n, o = this.buf;
                        if (e = o[this.pos++], 128 > e) return e;
                        if (e = 127 & e, r = o[this.pos++], 128 > r) return e | r << 7;
                        if (r = (127 & r) << 7, s = o[this.pos++], 128 > s) return e | r | s << 14;
                        if (s = (127 & s) << 14, n = o[this.pos++], 128 > n) return e | r | s | n << 21;
                        if (t = e | r | s | (127 & n) << 21, i = o[this.pos++], t += 268435456 * (127 & i), 128 > i) return t;
                        if (i = o[this.pos++], t += 34359738368 * (127 & i), 128 > i) return t;
                        if (i = o[this.pos++], t += 4398046511104 * (127 & i), 128 > i) return t;
                        if (i = o[this.pos++], t += 562949953421312 * (127 & i), 128 > i) return t;
                        if (i = o[this.pos++], t += 72057594037927940 * (127 & i), 128 > i) return t;
                        if (i = o[this.pos++], t += 0x8000000000000000 * (127 & i), 128 > i) return t;
                        throw new Error("Expected varint not more than 10 bytes")
                    },
                    readVarint64: function() {
                        var t = this.pos,
                            i = this.readVarint();
                        if (POW_2_63 > i) return i;
                        for (var e = this.pos - 2; 255 === this.buf[e];) e--;
                        t > e && (e = t), i = 0;
                        for (var r = 0; e - t + 1 > r; r++) {
                            var s = 127 & ~this.buf[t + r];
                            i += 4 > r ? s << 7 * r : s * Math.pow(2, 7 * r)
                        }
                        return -i - 1
                    },
                    readSVarint: function() {
                        var t = this.readVarint();
                        return t % 2 === 1 ? (t + 1) / -2 : t / 2
                    },
                    readBoolean: function() {
                        return Boolean(this.readVarint())
                    },
                    readString: function() {
                        var t = this.readVarint() + this.pos,
                            i = this.buf.toString("utf8", this.pos, t);
                        return this.pos = t, i
                    },
                    readBytes: function() {
                        var t = this.readVarint() + this.pos,
                            i = this.buf.slice(this.pos, t);
                        return this.pos = t, i
                    },
                    readPackedVarint: function() {
                        for (var t = this.readVarint() + this.pos, i = []; this.pos < t;) i.push(this.readVarint());
                        return i
                    },
                    readPackedSVarint: function() {
                        for (var t = this.readVarint() + this.pos, i = []; this.pos < t;) i.push(this.readSVarint());
                        return i
                    },
                    readPackedBoolean: function() {
                        for (var t = this.readVarint() + this.pos, i = []; this.pos < t;) i.push(this.readBoolean());
                        return i
                    },
                    readPackedFloat: function() {
                        for (var t = this.readVarint() + this.pos, i = []; this.pos < t;) i.push(this.readFloat());
                        return i
                    },
                    readPackedDouble: function() {
                        for (var t = this.readVarint() + this.pos, i = []; this.pos < t;) i.push(this.readDouble());
                        return i
                    },
                    readPackedFixed32: function() {
                        for (var t = this.readVarint() + this.pos, i = []; this.pos < t;) i.push(this.readFixed32());
                        return i
                    },
                    readPackedSFixed32: function() {
                        for (var t = this.readVarint() + this.pos, i = []; this.pos < t;) i.push(this.readSFixed32());
                        return i
                    },
                    readPackedFixed64: function() {
                        for (var t = this.readVarint() + this.pos, i = []; this.pos < t;) i.push(this.readFixed64());
                        return i
                    },
                    readPackedSFixed64: function() {
                        for (var t = this.readVarint() + this.pos, i = []; this.pos < t;) i.push(this.readSFixed64());
                        return i
                    },
                    skip: function(t) {
                        var i = 7 & t;
                        if (i === Pbf.Varint)
                            for (; this.buf[this.pos++] > 127;);
                        else if (i === Pbf.Bytes) this.pos = this.readVarint() + this.pos;
                        else if (i === Pbf.Fixed32) this.pos += 4;
                        else {
                            if (i !== Pbf.Fixed64) throw new Error("Unimplemented type: " + i);
                            this.pos += 8
                        }
                    },
                    writeTag: function(t, i) {
                        this.writeVarint(t << 3 | i)
                    },
                    realloc: function(t) {
                        for (var i = this.length || 16; i < this.pos + t;) i *= 2;
                        if (i !== this.length) {
                            var e = new Buffer(i);
                            this.buf.copy(e), this.buf = e, this.length = i
                        }
                    },
                    finish: function() {
                        return this.length = this.pos, this.pos = 0, this.buf.slice(0, this.length)
                    },
                    writeFixed32: function(t) {
                        this.realloc(4), this.buf.writeUInt32LE(t, this.pos), this.pos += 4
                    },
                    writeSFixed32: function(t) {
                        this.realloc(4), this.buf.writeInt32LE(t, this.pos), this.pos += 4
                    },
                    writeFixed64: function(t) {
                        this.realloc(8), this.buf.writeInt32LE(-1 & t, this.pos), this.buf.writeUInt32LE(Math.floor(t * SHIFT_RIGHT_32), this.pos + 4), this.pos += 8
                    },
                    writeSFixed64: function(t) {
                        this.realloc(8), this.buf.writeInt32LE(-1 & t, this.pos), this.buf.writeInt32LE(Math.floor(t * SHIFT_RIGHT_32), this.pos + 4), this.pos += 8
                    },
                    writeVarint: function(t) {
                        if (t = +t, 127 >= t) this.realloc(1), this.buf[this.pos++] = t;
                        else if (16383 >= t) this.realloc(2), this.buf[this.pos++] = t >>> 0 & 127 | 128, this.buf[this.pos++] = t >>> 7 & 127;
                        else if (2097151 >= t) this.realloc(3), this.buf[this.pos++] = t >>> 0 & 127 | 128, this.buf[this.pos++] = t >>> 7 & 127 | 128, this.buf[this.pos++] = t >>> 14 & 127;
                        else if (268435455 >= t) this.realloc(4), this.buf[this.pos++] = t >>> 0 & 127 | 128, this.buf[this.pos++] = t >>> 7 & 127 | 128, this.buf[this.pos++] = t >>> 14 & 127 | 128, this.buf[this.pos++] = t >>> 21 & 127;
                        else {
                            for (var i = this.pos; t >= 128;) this.realloc(1), this.buf[this.pos++] = 255 & t | 128, t /= 128;
                            if (this.realloc(1), this.buf[this.pos++] = 0 | t, this.pos - i > 10) throw new Error("Given varint doesn't fit into 10 bytes")
                        }
                    },
                    writeSVarint: function(t) {
                        this.writeVarint(0 > t ? 2 * -t - 1 : 2 * t)
                    },
                    writeBoolean: function(t) {
                        this.writeVarint(Boolean(t))
                    },
                    writeString: function(t) {
                        t = String(t);
                        var i = Buffer.byteLength(t);
                        this.writeVarint(i), this.realloc(i), this.buf.write(t, this.pos), this.pos += i
                    },
                    writeFloat: function(t) {
                        this.realloc(4), this.buf.writeFloatLE(t, this.pos), this.pos += 4
                    },
                    writeDouble: function(t) {
                        this.realloc(8), this.buf.writeDoubleLE(t, this.pos), this.pos += 8
                    },
                    writeBytes: function(t) {
                        var i = t.length;
                        this.writeVarint(i), this.realloc(i);
                        for (var e = 0; i > e; e++) this.buf[this.pos++] = t[e]
                    },
                    writeMessage: function(t, i, e) {
                        this.writeTag(t, Pbf.Bytes), this.pos++;
                        var r = this.pos;
                        i(e, this);
                        var s = this.pos - r,
                            n = 127 >= s ? 1 : 16383 >= s ? 2 : 2097151 >= s ? 3 : 268435455 >= s ? 4 : Math.ceil(Math.log(s) / (7 * Math.LN2));
                        if (n > 1) {
                            this.realloc(n - 1);
                            for (var o = this.pos - 1; o >= r; o--) this.buf[o + n - 1] = this.buf[o]
                        }
                        this.pos = r - 1, this.writeVarint(s), this.pos += s
                    },
                    writePackedVarint: function(t, i) {
                        this.writeMessage(t, writePackedVarint, i)
                    },
                    writePackedSVarint: function(t, i) {
                        this.writeMessage(t, writePackedSVarint, i)
                    },
                    writePackedBoolean: function(t, i) {
                        this.writeMessage(t, writePackedBoolean, i)
                    },
                    writePackedFloat: function(t, i) {
                        this.writeMessage(t, writePackedFloat, i)
                    },
                    writePackedDouble: function(t, i) {
                        this.writeMessage(t, writePackedDouble, i)
                    },
                    writePackedFixed32: function(t, i) {
                        this.writeMessage(t, writePackedFixed32, i)
                    },
                    writePackedSFixed32: function(t, i) {
                        this.writeMessage(t, writePackedSFixed32, i)
                    },
                    writePackedFixed64: function(t, i) {
                        this.writeMessage(t, writePackedFixed64, i)
                    },
                    writePackedSFixed64: function(t, i) {
                        this.writeMessage(t, writePackedSFixed64, i)
                    },
                    writeBytesField: function(t, i) {
                        this.writeTag(t, Pbf.Bytes), this.writeBytes(i)
                    },
                    writeFixed32Field: function(t, i) {
                        this.writeTag(t, Pbf.Fixed32), this.writeFixed32(i)
                    },
                    writeSFixed32Field: function(t, i) {
                        this.writeTag(t, Pbf.Fixed32), this.writeSFixed32(i)
                    },
                    writeFixed64Field: function(t, i) {
                        this.writeTag(t, Pbf.Fixed64), this.writeFixed64(i)
                    },
                    writeSFixed64Field: function(t, i) {
                        this.writeTag(t, Pbf.Fixed64), this.writeSFixed64(i)
                    },
                    writeVarintField: function(t, i) {
                        this.writeTag(t, Pbf.Varint), this.writeVarint(i)
                    },
                    writeSVarintField: function(t, i) {
                        this.writeTag(t, Pbf.Varint), this.writeSVarint(i)
                    },
                    writeStringField: function(t, i) {
                        this.writeTag(t, Pbf.Bytes), this.writeString(i)
                    },
                    writeFloatField: function(t, i) {
                        this.writeTag(t, Pbf.Fixed32), this.writeFloat(i)
                    },
                    writeDoubleField: function(t, i) {
                        this.writeTag(t, Pbf.Fixed64), this.writeDouble(i)
                    },
                    writeBooleanField: function(t, i) {
                        this.writeVarintField(t, Boolean(i))
                    }
                };
            }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

        }, {
            "./buffer": 134
        }],
        136: [function(require, module, exports) {
            exports.read = function(a, o, t, r, h) {
                var M, p, w = 8 * h - r - 1,
                    f = (1 << w) - 1,
                    e = f >> 1,
                    i = -7,
                    N = t ? h - 1 : 0,
                    n = t ? -1 : 1,
                    s = a[o + N];
                for (N += n, M = s & (1 << -i) - 1, s >>= -i, i += w; i > 0; M = 256 * M + a[o + N], N += n, i -= 8);
                for (p = M & (1 << -i) - 1, M >>= -i, i += r; i > 0; p = 256 * p + a[o + N], N += n, i -= 8);
                if (0 === M) M = 1 - e;
                else {
                    if (M === f) return p ? NaN : (s ? -1 : 1) * (1 / 0);
                    p += Math.pow(2, r), M -= e
                }
                return (s ? -1 : 1) * p * Math.pow(2, M - r)
            }, exports.write = function(a, o, t, r, h, M) {
                var p, w, f, e = 8 * M - h - 1,
                    i = (1 << e) - 1,
                    N = i >> 1,
                    n = 23 === h ? Math.pow(2, -24) - Math.pow(2, -77) : 0,
                    s = r ? 0 : M - 1,
                    u = r ? 1 : -1,
                    l = 0 > o || 0 === o && 0 > 1 / o ? 1 : 0;
                for (o = Math.abs(o), isNaN(o) || o === 1 / 0 ? (w = isNaN(o) ? 1 : 0, p = i) : (p = Math.floor(Math.log(o) / Math.LN2), o * (f = Math.pow(2, -p)) < 1 && (p--, f *= 2), o += p + N >= 1 ? n / f : n * Math.pow(2, 1 - N), o * f >= 2 && (p++, f /= 2), p + N >= i ? (w = 0, p = i) : p + N >= 1 ? (w = (o * f - 1) * Math.pow(2, h), p += N) : (w = o * Math.pow(2, N - 1) * Math.pow(2, h), p = 0)); h >= 8; a[t + s] = 255 & w, s += u, w /= 256, h -= 8);
                for (p = p << h | w, e += h; e > 0; a[t + s] = 255 & p, s += u, p /= 256, e -= 8);
                a[t + s - u] |= 128 * l
            };
        }, {}],
        137: [function(require, module, exports) {
            "use strict";

            function Point(t, n) {
                this.x = t, this.y = n
            }
            module.exports = Point, Point.prototype = {
                clone: function() {
                    return new Point(this.x, this.y)
                },
                add: function(t) {
                    return this.clone()._add(t)
                },
                sub: function(t) {
                    return this.clone()._sub(t)
                },
                mult: function(t) {
                    return this.clone()._mult(t)
                },
                div: function(t) {
                    return this.clone()._div(t)
                },
                rotate: function(t) {
                    return this.clone()._rotate(t)
                },
                matMult: function(t) {
                    return this.clone()._matMult(t)
                },
                unit: function() {
                    return this.clone()._unit()
                },
                perp: function() {
                    return this.clone()._perp()
                },
                round: function() {
                    return this.clone()._round()
                },
                mag: function() {
                    return Math.sqrt(this.x * this.x + this.y * this.y)
                },
                equals: function(t) {
                    return this.x === t.x && this.y === t.y
                },
                dist: function(t) {
                    return Math.sqrt(this.distSqr(t))
                },
                distSqr: function(t) {
                    var n = t.x - this.x,
                        i = t.y - this.y;
                    return n * n + i * i
                },
                angle: function() {
                    return Math.atan2(this.y, this.x)
                },
                angleTo: function(t) {
                    return Math.atan2(this.y - t.y, this.x - t.x)
                },
                angleWith: function(t) {
                    return this.angleWithSep(t.x, t.y)
                },
                angleWithSep: function(t, n) {
                    return Math.atan2(this.x * n - this.y * t, this.x * t + this.y * n)
                },
                _matMult: function(t) {
                    var n = t[0] * this.x + t[1] * this.y,
                        i = t[2] * this.x + t[3] * this.y;
                    return this.x = n, this.y = i, this
                },
                _add: function(t) {
                    return this.x += t.x, this.y += t.y, this
                },
                _sub: function(t) {
                    return this.x -= t.x, this.y -= t.y, this
                },
                _mult: function(t) {
                    return this.x *= t, this.y *= t, this
                },
                _div: function(t) {
                    return this.x /= t, this.y /= t, this
                },
                _unit: function() {
                    return this._div(this.mag()), this
                },
                _perp: function() {
                    var t = this.y;
                    return this.y = this.x, this.x = -t, this
                },
                _rotate: function(t) {
                    var n = Math.cos(t),
                        i = Math.sin(t),
                        s = n * this.x - i * this.y,
                        r = i * this.x + n * this.y;
                    return this.x = s, this.y = r, this
                },
                _round: function() {
                    return this.x = Math.round(this.x), this.y = Math.round(this.y), this
                }
            }, Point.convert = function(t) {
                return t instanceof Point ? t : Array.isArray(t) ? new Point(t[0], t[1]) : t
            };
        }, {}],
        138: [function(require, module, exports) {
            ! function() {
                "use strict";

                function t(i, n) {
                    return this instanceof t ? (this._maxEntries = Math.max(4, i || 9), this._minEntries = Math.max(2, Math.ceil(.4 * this._maxEntries)), n && this._initFormat(n), void this.clear()) : new t(i, n)
                }

                function i(t, i) {
                    t.bbox = n(t, 0, t.children.length, i)
                }

                function n(t, i, n, r) {
                    for (var o, a = e(), s = i; n > s; s++) o = t.children[s], h(a, t.leaf ? r(o) : o.bbox);
                    return a
                }

                function e() {
                    return [1 / 0, 1 / 0, -(1 / 0), -(1 / 0)]
                }

                function h(t, i) {
                    return t[0] = Math.min(t[0], i[0]), t[1] = Math.min(t[1], i[1]), t[2] = Math.max(t[2], i[2]), t[3] = Math.max(t[3], i[3]), t
                }

                function r(t, i) {
                    return t.bbox[0] - i.bbox[0]
                }

                function o(t, i) {
                    return t.bbox[1] - i.bbox[1]
                }

                function a(t) {
                    return (t[2] - t[0]) * (t[3] - t[1])
                }

                function s(t) {
                    return t[2] - t[0] + (t[3] - t[1])
                }

                function l(t, i) {
                    return (Math.max(i[2], t[2]) - Math.min(i[0], t[0])) * (Math.max(i[3], t[3]) - Math.min(i[1], t[1]))
                }

                function u(t, i) {
                    var n = Math.max(t[0], i[0]),
                        e = Math.max(t[1], i[1]),
                        h = Math.min(t[2], i[2]),
                        r = Math.min(t[3], i[3]);
                    return Math.max(0, h - n) * Math.max(0, r - e)
                }

                function c(t, i) {
                    return t[0] <= i[0] && t[1] <= i[1] && i[2] <= t[2] && i[3] <= t[3]
                }

                function f(t, i) {
                    return i[0] <= t[2] && i[1] <= t[3] && i[2] >= t[0] && i[3] >= t[1]
                }

                function d(t, i, n, e, h) {
                    for (var r, o = [i, n]; o.length;) n = o.pop(), i = o.pop(), e >= n - i || (r = i + Math.ceil((n - i) / e / 2) * e, x(t, i, n, r, h), o.push(i, r, r, n))
                }

                function x(t, i, n, e, h) {
                    for (var r, o, a, s, l, u, c, f, d; n > i;) {
                        for (n - i > 600 && (r = n - i + 1, o = e - i + 1, a = Math.log(r), s = .5 * Math.exp(2 * a / 3), l = .5 * Math.sqrt(a * s * (r - s) / r) * (0 > o - r / 2 ? -1 : 1), u = Math.max(i, Math.floor(e - o * s / r + l)), c = Math.min(n, Math.floor(e + (r - o) * s / r + l)), x(t, u, c, e, h)), f = t[e], o = i, d = n, p(t, i, e), h(t[n], f) > 0 && p(t, i, n); d > o;) {
                            for (p(t, o, d), o++, d--; h(t[o], f) < 0;) o++;
                            for (; h(t[d], f) > 0;) d--
                        }
                        0 === h(t[i], f) ? p(t, i, d) : (d++, p(t, d, n)), e >= d && (i = d + 1), d >= e && (n = d - 1)
                    }
                }

                function p(t, i, n) {
                    var e = t[i];
                    t[i] = t[n], t[n] = e
                }
                t.prototype = {
                    all: function() {
                        return this._all(this.data, [])
                    },
                    search: function(t) {
                        var i = this.data,
                            n = [],
                            e = this.toBBox;
                        if (!f(t, i.bbox)) return n;
                        for (var h, r, o, a, s = []; i;) {
                            for (h = 0, r = i.children.length; r > h; h++) o = i.children[h], a = i.leaf ? e(o) : o.bbox, f(t, a) && (i.leaf ? n.push(o) : c(t, a) ? this._all(o, n) : s.push(o));
                            i = s.pop()
                        }
                        return n
                    },
                    collides: function(t) {
                        var i = this.data,
                            n = this.toBBox;
                        if (!f(t, i.bbox)) return !1;
                        for (var e, h, r, o, a = []; i;) {
                            for (e = 0, h = i.children.length; h > e; e++)
                                if (r = i.children[e], o = i.leaf ? n(r) : r.bbox, f(t, o)) {
                                    if (i.leaf || c(t, o)) return !0;
                                    a.push(r)
                                }
                            i = a.pop()
                        }
                        return !1
                    },
                    load: function(t) {
                        if (!t || !t.length) return this;
                        if (t.length < this._minEntries) {
                            for (var i = 0, n = t.length; n > i; i++) this.insert(t[i]);
                            return this
                        }
                        var e = this._build(t.slice(), 0, t.length - 1, 0);
                        if (this.data.children.length)
                            if (this.data.height === e.height) this._splitRoot(this.data, e);
                            else {
                                if (this.data.height < e.height) {
                                    var h = this.data;
                                    this.data = e, e = h
                                }
                                this._insert(e, this.data.height - e.height - 1, !0)
                            } else this.data = e;
                        return this
                    },
                    insert: function(t) {
                        return t && this._insert(t, this.data.height - 1), this
                    },
                    clear: function() {
                        return this.data = {
                            children: [],
                            height: 1,
                            bbox: e(),
                            leaf: !0
                        }, this
                    },
                    remove: function(t) {
                        if (!t) return this;
                        for (var i, n, e, h, r = this.data, o = this.toBBox(t), a = [], s = []; r || a.length;) {
                            if (r || (r = a.pop(), n = a[a.length - 1], i = s.pop(), h = !0), r.leaf && (e = r.children.indexOf(t), -1 !== e)) return r.children.splice(e, 1), a.push(r), this._condense(a), this;
                            h || r.leaf || !c(r.bbox, o) ? n ? (i++, r = n.children[i], h = !1) : r = null : (a.push(r), s.push(i), i = 0, n = r, r = r.children[0])
                        }
                        return this
                    },
                    toBBox: function(t) {
                        return t
                    },
                    compareMinX: function(t, i) {
                        return t[0] - i[0]
                    },
                    compareMinY: function(t, i) {
                        return t[1] - i[1]
                    },
                    toJSON: function() {
                        return this.data
                    },
                    fromJSON: function(t) {
                        return this.data = t, this
                    },
                    _all: function(t, i) {
                        for (var n = []; t;) t.leaf ? i.push.apply(i, t.children) : n.push.apply(n, t.children), t = n.pop();
                        return i
                    },
                    _build: function(t, n, e, h) {
                        var r, o = e - n + 1,
                            a = this._maxEntries;
                        if (a >= o) return r = {
                            children: t.slice(n, e + 1),
                            height: 1,
                            bbox: null,
                            leaf: !0
                        }, i(r, this.toBBox), r;
                        h || (h = Math.ceil(Math.log(o) / Math.log(a)), a = Math.ceil(o / Math.pow(a, h - 1))), r = {
                            children: [],
                            height: h,
                            bbox: null
                        };
                        var s, l, u, c, f = Math.ceil(o / a),
                            x = f * Math.ceil(Math.sqrt(a));
                        for (d(t, n, e, x, this.compareMinX), s = n; e >= s; s += x)
                            for (u = Math.min(s + x - 1, e), d(t, s, u, f, this.compareMinY), l = s; u >= l; l += f) c = Math.min(l + f - 1, u), r.children.push(this._build(t, l, c, h - 1));
                        return i(r, this.toBBox), r
                    },
                    _chooseSubtree: function(t, i, n, e) {
                        for (var h, r, o, s, u, c, f, d;;) {
                            if (e.push(i), i.leaf || e.length - 1 === n) break;
                            for (f = d = 1 / 0, h = 0, r = i.children.length; r > h; h++) o = i.children[h], u = a(o.bbox), c = l(t, o.bbox) - u, d > c ? (d = c, f = f > u ? u : f, s = o) : c === d && f > u && (f = u, s = o);
                            i = s
                        }
                        return i
                    },
                    _insert: function(t, i, n) {
                        var e = this.toBBox,
                            r = n ? t.bbox : e(t),
                            o = [],
                            a = this._chooseSubtree(r, this.data, i, o);
                        for (a.children.push(t), h(a.bbox, r); i >= 0 && o[i].children.length > this._maxEntries;) this._split(o, i), i--;
                        this._adjustParentBBoxes(r, o, i)
                    },
                    _split: function(t, n) {
                        var e = t[n],
                            h = e.children.length,
                            r = this._minEntries;
                        this._chooseSplitAxis(e, r, h);
                        var o = {
                            children: e.children.splice(this._chooseSplitIndex(e, r, h)),
                            height: e.height
                        };
                        e.leaf && (o.leaf = !0), i(e, this.toBBox), i(o, this.toBBox), n ? t[n - 1].children.push(o) : this._splitRoot(e, o)
                    },
                    _splitRoot: function(t, n) {
                        this.data = {
                            children: [t, n],
                            height: t.height + 1
                        }, i(this.data, this.toBBox)
                    },
                    _chooseSplitIndex: function(t, i, e) {
                        var h, r, o, s, l, c, f, d;
                        for (c = f = 1 / 0, h = i; e - i >= h; h++) r = n(t, 0, h, this.toBBox), o = n(t, h, e, this.toBBox), s = u(r, o), l = a(r) + a(o), c > s ? (c = s, d = h, f = f > l ? l : f) : s === c && f > l && (f = l, d = h);
                        return d
                    },
                    _chooseSplitAxis: function(t, i, n) {
                        var e = t.leaf ? this.compareMinX : r,
                            h = t.leaf ? this.compareMinY : o,
                            a = this._allDistMargin(t, i, n, e),
                            s = this._allDistMargin(t, i, n, h);
                        s > a && t.children.sort(e)
                    },
                    _allDistMargin: function(t, i, e, r) {
                        t.children.sort(r);
                        var o, a, l = this.toBBox,
                            u = n(t, 0, i, l),
                            c = n(t, e - i, e, l),
                            f = s(u) + s(c);
                        for (o = i; e - i > o; o++) a = t.children[o], h(u, t.leaf ? l(a) : a.bbox), f += s(u);
                        for (o = e - i - 1; o >= i; o--) a = t.children[o], h(c, t.leaf ? l(a) : a.bbox), f += s(c);
                        return f
                    },
                    _adjustParentBBoxes: function(t, i, n) {
                        for (var e = n; e >= 0; e--) h(i[e].bbox, t)
                    },
                    _condense: function(t) {
                        for (var n, e = t.length - 1; e >= 0; e--) 0 === t[e].children.length ? e > 0 ? (n = t[e - 1].children, n.splice(n.indexOf(t[e]), 1)) : this.clear() : i(t[e], this.toBBox)
                    },
                    _initFormat: function(t) {
                        var i = ["return a", " - b", ";"];
                        this.compareMinX = new Function("a", "b", i.join(t[0])), this.compareMinY = new Function("a", "b", i.join(t[1])), this.toBBox = new Function("a", "return [a" + t.join(", a") + "];")
                    }
                }, "function" == typeof define && define.amd ? define("rbush", function() {
                    return t
                }) : "undefined" != typeof module ? module.exports = t : "undefined" != typeof self ? self.rbush = t : window.rbush = t
            }();
        }, {}],
        139: [function(require, module, exports) {
            void
            function(e, r) {
                "function" == typeof define && define.amd ? define(r) : "object" == typeof exports ? module.exports = r() : e.resolveUrl = r()
            }(this, function() {
                function e() {
                    var e = arguments.length;
                    if (0 === e) throw new Error("resolveUrl requires at least one argument; got none.");
                    var r = document.createElement("base");
                    if (r.href = arguments[0], 1 === e) return r.href;
                    var t = document.getElementsByTagName("head")[0];
                    t.insertBefore(r, t.firstChild);
                    for (var n, o = document.createElement("a"), f = 1; e > f; f++) o.href = arguments[f], n = o.href, r.href = n;
                    return t.removeChild(r), n
                }
                return e
            });
        }, {}],
        140: [function(require, module, exports) {
            function UnitBezier(t, i, e, r) {
                this.cx = 3 * t, this.bx = 3 * (e - t) - this.cx, this.ax = 1 - this.cx - this.bx, this.cy = 3 * i, this.by = 3 * (r - i) - this.cy, this.ay = 1 - this.cy - this.by, this.p1x = t, this.p1y = r, this.p2x = e, this.p2y = r
            }
            module.exports = UnitBezier, UnitBezier.prototype.sampleCurveX = function(t) {
                return ((this.ax * t + this.bx) * t + this.cx) * t
            }, UnitBezier.prototype.sampleCurveY = function(t) {
                return ((this.ay * t + this.by) * t + this.cy) * t
            }, UnitBezier.prototype.sampleCurveDerivativeX = function(t) {
                return (3 * this.ax * t + 2 * this.bx) * t + this.cx
            }, UnitBezier.prototype.solveCurveX = function(t, i) {
                "undefined" == typeof i && (i = 1e-6);
                var e, r, s, h, n;
                for (s = t, n = 0; 8 > n; n++) {
                    if (h = this.sampleCurveX(s) - t, Math.abs(h) < i) return s;
                    var u = this.sampleCurveDerivativeX(s);
                    if (Math.abs(u) < 1e-6) break;
                    s -= h / u
                }
                if (e = 0, r = 1, s = t, e > s) return e;
                if (s > r) return r;
                for (; r > e;) {
                    if (h = this.sampleCurveX(s), Math.abs(h - t) < i) return s;
                    t > h ? e = s : r = s, s = .5 * (r - e) + e
                }
                return s
            }, UnitBezier.prototype.solve = function(t, i) {
                return this.sampleCurveY(this.solveCurveX(t, i))
            };
        }, {}],
        141: [function(require, module, exports) {
            module.exports.VectorTile = require("./lib/vectortile.js"), module.exports.VectorTileFeature = require("./lib/vectortilefeature.js"), module.exports.VectorTileLayer = require("./lib/vectortilelayer.js");
        }, {
            "./lib/vectortile.js": 142,
            "./lib/vectortilefeature.js": 143,
            "./lib/vectortilelayer.js": 144
        }],
        142: [function(require, module, exports) {
            "use strict";

            function VectorTile(e, r) {
                this.layers = e.readFields(readTile, {}, r)
            }

            function readTile(e, r, i) {
                if (3 === e) {
                    var t = new VectorTileLayer(i, i.readVarint() + i.pos);
                    t.length && (r[t.name] = t)
                }
            }
            var VectorTileLayer = require("./vectortilelayer");
            module.exports = VectorTile;
        }, {
            "./vectortilelayer": 144
        }],
        143: [function(require, module, exports) {
            "use strict";

            function VectorTileFeature(e, t, r, i, o) {
                this.properties = {}, this.extent = r, this.type = 0, this._pbf = e, this._geometry = -1, this._keys = i, this._values = o, e.readFields(readFeature, this, t)
            }

            function readFeature(e, t, r) {
                1 == e ? t._id = r.readVarint() : 2 == e ? readTag(r, t) : 3 == e ? t.type = r.readVarint() : 4 == e && (t._geometry = r.pos)
            }

            function readTag(e, t) {
                for (var r = e.readVarint() + e.pos; e.pos < r;) {
                    var i = t._keys[e.readVarint()],
                        o = t._values[e.readVarint()];
                    t.properties[i] = o
                }
            }
            var Point = require("point-geometry");
            module.exports = VectorTileFeature, VectorTileFeature.types = ["Unknown", "Point", "LineString", "Polygon"], VectorTileFeature.prototype.loadGeometry = function() {
                var e = this._pbf;
                e.pos = this._geometry;
                for (var t, r = e.readVarint() + e.pos, i = 1, o = 0, a = 0, n = 0, s = []; e.pos < r;) {
                    if (!o) {
                        var p = e.readVarint();
                        i = 7 & p, o = p >> 3
                    }
                    if (o--, 1 === i || 2 === i) a += e.readSVarint(), n += e.readSVarint(), 1 === i && (t && s.push(t), t = []), t.push(new Point(a, n));
                    else {
                        if (7 !== i) throw new Error("unknown command " + i);
                        t && t.push(t[0].clone())
                    }
                }
                return t && s.push(t), s
            }, VectorTileFeature.prototype.bbox = function() {
                var e = this._pbf;
                e.pos = this._geometry;
                for (var t = e.readVarint() + e.pos, r = 1, i = 0, o = 0, a = 0, n = 1 / 0, s = -(1 / 0), p = 1 / 0, h = -(1 / 0); e.pos < t;) {
                    if (!i) {
                        var u = e.readVarint();
                        r = 7 & u, i = u >> 3
                    }
                    if (i--, 1 === r || 2 === r) o += e.readSVarint(), a += e.readSVarint(), n > o && (n = o), o > s && (s = o), p > a && (p = a), a > h && (h = a);
                    else if (7 !== r) throw new Error("unknown command " + r)
                }
                return [n, p, s, h]
            }, VectorTileFeature.prototype.toGeoJSON = function(e, t, r) {
                for (var i = this.extent * Math.pow(2, r), o = this.extent * e, a = this.extent * t, n = this.loadGeometry(), s = VectorTileFeature.types[this.type], p = 0; p < n.length; p++)
                    for (var h = n[p], u = 0; u < h.length; u++) {
                        var d = h[u],
                            l = 180 - 360 * (d.y + a) / i;
                        h[u] = [360 * (d.x + o) / i - 180, 360 / Math.PI * Math.atan(Math.exp(l * Math.PI / 180)) - 90]
                    }
                return "Point" === s && 1 === n.length ? n = n[0][0] : "Point" === s ? (n = n[0], s = "MultiPoint") : "LineString" === s && 1 === n.length ? n = n[0] : "LineString" === s && (s = "MultiLineString"), {
                    type: "Feature",
                    geometry: {
                        type: s,
                        coordinates: n
                    },
                    properties: this.properties
                }
            };
        }, {
            "point-geometry": 137
        }],
        144: [function(require, module, exports) {
            "use strict";

            function VectorTileLayer(e, t) {
                this.version = 1, this.name = null, this.extent = 4096, this.length = 0, this._pbf = e, this._keys = [], this._values = [], this._features = [], e.readFields(readLayer, this, t), this.length = this._features.length
            }

            function readLayer(e, t, r) {
                15 === e ? t.version = r.readVarint() : 1 === e ? t.name = r.readString() : 5 === e ? t.extent = r.readVarint() : 2 === e ? t._features.push(r.pos) : 3 === e ? t._keys.push(r.readString()) : 4 === e && t._values.push(readValueMessage(r))
            }

            function readValueMessage(e) {
                for (var t = null, r = e.readVarint() + e.pos; e.pos < r;) {
                    var a = e.readVarint() >> 3;
                    t = 1 === a ? e.readString() : 2 === a ? e.readFloat() : 3 === a ? e.readDouble() : 4 === a ? e.readVarint64() : 5 === a ? e.readVarint() : 6 === a ? e.readSVarint() : 7 === a ? e.readBoolean() : null
                }
                return t
            }
            var VectorTileFeature = require("./vectortilefeature.js");
            module.exports = VectorTileLayer, VectorTileLayer.prototype.feature = function(e) {
                if (0 > e || e >= this._features.length) throw new Error("feature index out of bounds");
                this._pbf.pos = this._features[e];
                var t = this._pbf.readVarint() + this._pbf.pos;
                return new VectorTileFeature(this._pbf, t, this.extent, this._keys, this._values)
            };
        }, {
            "./vectortilefeature.js": 143
        }],
        145: [function(require, module, exports) {
            var bundleFn = arguments[3],
                sources = arguments[4],
                cache = arguments[5],
                stringify = JSON.stringify;
            module.exports = function(r) {
                for (var e, t = Object.keys(cache), n = 0, o = t.length; o > n; n++) {
                    var i = t[n];
                    if (cache[i].exports === r) {
                        e = i;
                        break
                    }
                }
                if (!e) {
                    e = Math.floor(Math.pow(16, 8) * Math.random()).toString(16);
                    for (var s = {}, n = 0, o = t.length; o > n; n++) {
                        var i = t[n];
                        s[i] = i
                    }
                    sources[e] = [Function(["require", "module", "exports"], "(" + r + ")(self)"), s]
                }
                var a = Math.floor(Math.pow(16, 8) * Math.random()).toString(16),
                    u = {};
                u[e] = e, sources[a] = [Function(["require"], "require(" + stringify(e) + ")(self)"), u];
                var c = "(" + bundleFn + ")({" + Object.keys(sources).map(function(r) {
                        return stringify(r) + ":[" + sources[r][0] + "," + stringify(sources[r][1]) + "]"
                    }).join(",") + "},{},[" + stringify(a) + "])",
                    f = window.URL || window.webkitURL || window.mozURL || window.msURL;
                return new Worker(f.createObjectURL(new Blob([c], {
                    type: "text/javascript"
                })))
            };
        }, {}]
    }, {}, [24])(24)
});


//# sourceMappingURL=mapbox-gl.js.map