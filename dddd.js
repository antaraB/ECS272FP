EmViz = function() {
    var a = {},
        b = {};
    a.moodstrs = ["anger", "anticipation", "disgust", "fear", "joy", "sadness", "surprise", "trust"];
    a.emcolors = {
        joy: "rgb(250,219,77)",
        trust: "rgb(153,204,51)",
        fear: "rgb(53,164,80)",
        surprise: "rgb(63,165,192)",
        sadness: "rgb(114,157,201)",
        disgust: "rgb(159,120,186)",
        anger: "rgb(228,48,84)",
        anticipation: "rgb(242,153,58)"
    };
    a.showTooltip = function(f, d, e) {
        e = e || 20;
        var c = document.getElementById("tooltip");
        c.innerHTML = d;
        c.style.visibility = "visible";
        c.style.left = (f[0] + e) + "px";
        c.style.top = (f[1] + e) + "px"
    };
    a.hideTooltip = function() {
        var c = document.getElementById("tooltip");
        c.style.visibility = "hidden"
    };
    return a
}();
EmViz.EmBands = function() {
    var j = {},
        c, a, e, g = [28, 50];
    j.emData = function(k) {
        if (!arguments.length) {
            return c
        }
        c = k;
        return j
    };
    j.container = function(k) {
        if (!arguments.length) {
            return a
        }
        a = k;
        return j
    };
    j.rootsvg = function(k) {
        if (!arguments.length) {
            return e
        }
        e = k;
        return j
    };
    j.bandSize = function(k) {
        if (!arguments.length) {
            return g
        }
        g = k;
        return j
    };
    var b, d;
    j.chart = function(k, l) {
        b = k;
        d = l;
        h();
        i(["anger", "anticipation", "joy", "trust", "fear", "surprise", "sadness", "disgust"]);
        EmViz.moodstrs.forEach(function(m) {
            e.select("defs").append("clipPath").datum(c).attr("id", function(n) {
                return "clip-" + m
            }).append("path").attr("class", m + " emclip");
            a.append("g").attr("class", m + " emband").attr("opacity", 0.9).attr("clip-path", "url(#clip-" + m + ")").selectAll("rect").data(c).enter().append("rect");
            a.select("." + m + ".emband").on("mouseover", function(n) {
                EmViz.showTooltip([d3.event.pageX, d3.event.pageY], "<p><em>" + m + "</em></p>", 20);
                d3.selectAll(".emband").filter(function(o) {
                    return !d3.select(this).classed(m)
                }).selectAll("rect").attr("opacity", 0.5)
            }).on("mouseout", function(n) {
                EmViz.hideTooltip();
                d3.selectAll(".emband").selectAll("rect").attr("opacity", 1)
            })
        });
        f(true);
        return j
    };
    j.redraw = function(k) {
        if (!k) {
            EmViz.moodstrs.map(function(m, l) {
                e.select("." + m + ".emclip").attr("d", function(n) {
                    return emBandArea[l](n)
                });
                a.select("." + m + ".emband").selectAll("rect").attr("x", function(n) {
                    return b(n.time[0])
                }).attr("y", 0).attr("width", function(o, n) {
                    if (n >= c.length - 1) {
                        return 0
                    }
                    return b(c[n + 1].time[0]) - b(o.time[0])
                }).attr("height", e.attr("height")).attr("fill", function(o, n) {
                    return "url(#grad-2-" + m + n + ")"
                })
            })
        } else {
            EmViz.moodstrs.map(function(m, l) {
                e.select("." + m + ".emclip").attr("d", function(n) {
                    return emBandArea[l](n)
                });
                a.select("." + m + ".emband").selectAll("rect").attr("x", function(n) {
                    return b(n.time[0])
                }).attr("y", 0).attr("width", function(o, n) {
                    if (n >= c.length - 1) {
                        return 0
                    }
                    return b(c[n + 1].time[0]) - b(o.time[0])
                }).attr("height", e.attr("height")).attr("fill", function(o, n) {
                    return "url(#grad-1-" + m + n + ")"
                })
            })
        }
    };
    j.bandTransition = function(k) {
        f(k);
        if (!k) {
            EmViz.moodstrs.map(function(m, l) {
                e.select("." + m + ".emclip").transition().duration(2000).each("end", function(n) {
                    a.select("." + m + ".emband").selectAll("rect").attr("fill", function(p, o) {
                        return "url(#grad-2-" + m + o + ")"
                    })
                }).attr("d", function(n) {
                    return emBandArea[l](n)
                })
            })
        } else {
            EmViz.moodstrs.map(function(m, l) {
                e.select("." + m + ".emclip").transition().duration(2000).each("end", function(n) {
                    a.select("." + m + ".emband").selectAll("rect").attr("fill", function(p, o) {
                        return "url(#grad-1-" + m + o + ")"
                    })
                }).attr("d", function(n) {
                    return emBandArea[l](n)
                })
            })
        }
    };
    j.filtering = function(k, l) {
        a.selectAll("." + k + ".emband").transition().duration(500).attr("opacity", l);
        a.selectAll("." + k + ".embandout").transition().duration(500).attr("opacity", l)
    };

    function h() {
        var k = d3.scale.linear().domain([0, 1]).range([0.2, 0.95]);
        EmViz.moodstrs.forEach(function(m) {
            var l = e.select("defs").selectAll("linearGradient ." + m).data(c).enter().append("linearGradient").attr("class", m).attr("id", function(o, n) {
                return "grad-1-" + m + n
            });
            l.append("stop").attr("class", "stop1").attr("offset", "0%").attr("stop-color", function(n) {
                var o = d3.hsl(EmViz.emcolors[m]);
                o.l = k(n.vad_score[2]);
                return o.toString()
            });
            l.append("stop").attr("class", "stop2").attr("offset", "100%").attr("stop-color", function(o, n) {
                if (n >= c.length - 1) {
                    return "black"
                }
                var p = d3.hsl(EmViz.emcolors[m]);
                p.l = k(c[n + 1].vad_score[2]);
                return p.toString()
            })
        });
        EmViz.moodstrs.forEach(function(n, l) {
            var m = e.select("defs").selectAll("linearGradient ." + n).data(c).enter().append("linearGradient").attr("class", n).attr("id", function(p, o) {
                return "grad-2-" + n + o
            });
            m.append("stop").attr("class", "stop1").attr("offset", "0%").attr("stop-color", function(o) {
                var p = d3.hsl(EmViz.emcolors[n]);
                p.l = k(o.detail_a[l]);
                return p.toString()
            });
            m.append("stop").attr("class", "stop2").attr("offset", "100%").attr("stop-color", function(p, o) {
                if (o >= c.length - 1) {
                    return "black"
                }
                var q = d3.hsl(EmViz.emcolors[n]);
                q.l = k(c[o + 1].detail_a[l]);
                return q.toString()
            })
        })
    }

    function f(k) {
        if (k) {
            emBandArea = EmViz.moodstrs.map(function(n, l) {
                var m = d3.svg.area().interpolate("monotone").x(function(o) {
                    return b(o.time[0])
                }).y0(function(o) {
                    return o.y0[l] * g[0] * 2 + d(o.vad_score[0]) - g[0]
                }).y1(function(o) {
                    return (o.y0[l] + o.y[l]) * g[0] * 2 + d(o.vad_score[0]) - g[0]
                });
                return m
            })
        } else {
            emBandArea = EmViz.moodstrs.map(function(n, l) {
                var m = d3.svg.area().interpolate("monotone").x(function(o) {
                    return b(o.time[0])
                }).y0(function(o) {
                    return o.detail_v[l] > 0 ? d(o.detail_v[l]) - o.y[l] * g[0] : d(o.vad_score[0]) - o.y[l] * g[0]
                }).y1(function(o) {
                    return o.detail_v[l] > 0 ? d(o.detail_v[l]) + o.y[l] * g[0] : d(o.vad_score[0]) + o.y[l] * g[0]
                });
                return m
            })
        }
    }

    function i(n) {
        var p = d3.scale.linear().domain([0, 1]).range([0, 2 * g[0]]),
            k = d3.layout.stack().offset("silhouette"),
            l = n.map(function(q) {
                return EmViz.moodstrs.indexOf(q)
            });

        function o(r, q) {
            return c.map(function(s) {
                return {
                    x: s.time[0],
                    y: s.emsum ? s.mood_score[l[q]] / s.emsum : 0
                }
            })
        }
        var m = k(n.map(function(r, q) {
            return o(r, q)
        }));
        var l = EmViz.moodstrs.map(function(q) {
            return n.indexOf(q)
        });
        c.forEach(function(r, q) {
            r.y = [];
            r.y0 = [];
            EmViz.moodstrs.forEach(function(t, s) {
                r.y.push(m[l[s]][q].y);
                r.y0.push(m[l[s]][q].y0)
            })
        })
    }
    return j
};
EmViz.EmTimeline = function() {
    var n = {},
        w = "",
        B = [],
        b = [],
        s = [1, 1],
        r = 24,
        G = d3.dispatch("emstateClick", "emstateMouseover", "emstateMouseout");
    n.elemID = function(H) {
        if (!arguments.length) {
            return w
        }
        w = H;
        return n
    };
    n.emData = function(H) {
        if (!arguments.length) {
            return B
        }
        B = H;
        return n
    };
    n.texts = function(H) {
        if (!arguments.length) {
            return b
        }
        b = H;
        return n
    };
    n.size = function(H) {
        if (!arguments.length) {
            return s
        }
        s = H;
        return n
    };
    n.margin = function(H) {
        if (!arguments.length) {
            return r
        }
        r = H;
        return n
    };
    n.dispatch = G;
    var l = true,
        v, g, f = 35,
        x, C, o, F, D, A, q, t, d, i, e, c, k, p, m, E, u = null,
        z = [false, false, false],
        j = d3.time.format("%Y.%m.%d");
    n.chart = function() {
        i = B.filter(function(P) {
            return P.vad_score[0] > 0 && P.emsum > 0
        });
        v = s[0] - 2 * r;
        g = s[1] - 2 * r - f - 5;
        q = d3.select("#" + w).append("svg").attr("width", s[0]).attr("height", s[1]);
        q.append("defs");
        t = q.append("g").attr("class", "focus").attr("transform", "translate(" + r + "," + (f + r + 5) + ")");
        d = q.append("g").attr("class", "context").attr("transform", "translate(" + r + "," + 5 + ")");
        x = d3.time.scale().domain([i[0].time[0], i[i.length - 1].time[0]]).range([0, v]);
        C = d3.scale.linear().domain([1, 0]).range([0, g]);
        o = d3.scale.linear().domain([d3.max(B, function(P) {
            return P.tweet_number
        }) * 1.2, 0]).range([0, g]);
        t.append("line").attr("class", "selline").attr("y1", 0).attr("y2", g).attr("x1", -100).attr("x2", -100);
        t.append("line").attr("class", "hovline").attr("y1", 0).attr("y2", g - 20).attr("visibility", "hidden");
        t.append("text").attr("class", "hovtime").attr("y", g - 10).attr("visibility", "hidden");
        var M = t.selectAll("style0").data(i.filter(function(P) {
            return P.emotion_extreme
        })).enter().append("g").attr("class", "styleline style0");
        M.append("line");
        M.append("text").attr("y", 10).text("E");
        M = t.selectAll("style1").data(i.filter(function(P) {
            return P.emotion_outlook
        })).enter().append("g").attr("class", "styleline style1");
        M.append("line");
        M.append("text").attr("y", 20).text("O");
        M = t.selectAll("style2").data(i.filter(function(P) {
            return P.emotion_resilience
        })).enter().append("g").attr("class", "styleline style2");
        M.append("line");
        M.append("text").attr("y", 30).text("R");
        t.selectAll(".styleline").attr("visibility", "hidden");
        E = EmViz.EmTweets().emData(i).container(t).rootsvg(q).maxwords(40).chart(x, o);
        m = EmViz.EmBands().emData(i).container(t).rootsvg(q).bandSize([35, 42]).chart(x, C);
        p = EmViz.EmStates().emData(i).container(t).circleSize([6, 35, 42]).chart(x, C);
        t.append("line").attr("x1", 0).attr("y1", g / 2).attr("x2", v).attr("y2", g / 2).attr("stroke", "black");
        e = d3.svg.axis().scale(x).orient("bottom").ticks(10);
        var J = d3.svg.axis().scale(C).orient("left").ticks(11),
            I = d3.svg.axis().scale(o).orient("right").ticks(5);
        t.append("g").attr("class", "x axis").attr("transform", "translate(0," + g + ")").call(e);
        t.append("g").attr("class", "y axis").call(J);
        t.append("text").attr("class", "y axislabel").attr("x", 3).attr("y", 8).text("Valence");
        t.append("g").attr("class", "yt axis").attr("transform", "translate(" + v + ",0)").attr("visibility", "hidden").call(I);
        t.append("text").attr("class", "yt axislabel").attr("x", v - 40).attr("y", 8).attr("visibility", "hidden").text("Tweets");
        F = d3.time.scale().domain([i[0].time[0], i[i.length - 1].time[0]]).range([0, v]);
        var O = d3.scale.linear().domain([1, 0]).range([0, f]),
            N = d3.scale.linear().domain([d3.max(B, function(P) {
                return P.tweet_number
            }) * 1.2, 0]).range([0, f]);
        d.append("line").attr("class", "selline").attr("y1", 0).attr("y2", f).attr("x1", -100).attr("x2", -100);
        d.selectAll("style0").data(i.filter(function(P) {
            return P.emotion_extreme
        })).enter().append("g").attr("class", "styleline style0").append("line");
        d.selectAll("style1").data(i.filter(function(P) {
            return P.emotion_outlook
        })).enter().append("g").attr("class", "styleline style1").append("line");
        d.selectAll("style2").data(i.filter(function(P) {
            return P.emotion_resilience
        })).enter().append("g").attr("class", "styleline style2").append("line");
        d.selectAll(".styleline").attr("visibility", "hidden").select("line").attr("x1", function(P) {
            return F(P.time[0])
        }).attr("y1", 0).attr("x2", function(P) {
            return F(P.time[0])
        }).attr("y2", f);
        var H = d3.svg.area().interpolate("monotone").x(function(P) {
            return F(P.time[0])
        }).y0(function(P) {
            return N(P.tweet_number)
        }).y1(function(P) {
            return f
        });
        d.append("path").datum(B).attr("class", "tweets").attr("d", H);
        var L = d3.svg.line().interpolate("monotone").x(function(P) {
            return F(P.time[0])
        }).y(function(P) {
            return O(P.vad_score[0])
        });
        d.append("path").datum(i).attr("class", "emline").attr("d", L);
        d.selectAll(".emcircle").data(i).enter().append("circle").attr("class", "emcircle").attr("cx", function(P) {
            return F(P.time[0])
        }).attr("cy", function(P) {
            return O(P.vad_score[0])
        }).attr("r", 3);
        var K = d3.svg.axis().scale(F).orient("bottom").ticks(10);
        d.append("g").attr("class", "x2 axis").attr("transform", "translate(0," + f + ")").call(K);
        c = d3.svg.brush().x(F).on("brush", h);
        d.append("g").attr("class", "x brush").call(c).selectAll("rect").attr("y", -4).attr("height", f + 4);
        p.dispatch.on("stateClick.emtimeline", function(Q, P) {
            u = Q;
            d3.select(".focus .selline").attr("x1", x(Q.time[0])).attr("x2", x(Q.time[0]));
            d3.select(".context .selline").attr("x1", F(Q.time[0])).attr("x2", F(Q.time[0]));
            G.emstateClick(Q, P)
        });
        p.dispatch.on("stateMouseover", function(P) {
            t.select(".hovline").attr("x1", x(P.time[0])).attr("x2", x(P.time[0])).attr("visibility", "visible");
            t.select(".hovtime").attr("x", x(P.time[0])).text(j(P.time[0])).attr("visibility", "visible")
        });
        p.dispatch.on("stateMouseout", function(P) {
            t.select(".hovline").attr("visibility", "hidden");
            t.select(".hovtime").attr("visibility", "hidden")
        });
        p.dispatch.on("moodMouseover", function(Q, P) {
            if (u != null && u.time[0] == Q.time[0]) {
                G.emstateMouseover(Q, P)
            }
        });
        p.dispatch.on("moodMouseout", function(Q, P) {
            if (u != null && u.time[0] == Q.time[0]) {
                G.emstateMouseout(Q, P)
            }
        });
        E.dispatch.on("triggerMouseover", function(P) {
            t.select(".yt.axis").attr("visibility", "visible");
            t.select(".yt.axislabel").attr("visibility", "visible");
            t.select(".hovline").attr("x1", x(P.time[0])).attr("x2", x(P.time[0])).attr("visibility", "visible");
            t.select(".hovtime").attr("x", x(P.time[0])).text(j(P.time[0])).attr("visibility", "visible")
        });
        E.dispatch.on("triggerMouseout", function(P) {
            t.select(".yt.axis").attr("visibility", "hidden");
            t.select(".yt.axislabel").attr("visibility", "hidden");
            t.select(".hovline").attr("visibility", "hidden");
            t.select(".hovtime").attr("visibility", "hidden")
        });
        E.dispatch.on("triggerClick", function(Q, P) {
            u = Q;
            d3.select(".focus .selline").attr("x1", x(Q.time[0])).attr("x2", x(Q.time[0]));
            d3.select(".context .selline").attr("x1", F(Q.time[0])).attr("x2", F(Q.time[0]));
            G.emstateClick(Q, P)
        });
        y();
        return n
    };
    n.bandTransition = function() {
        l = !l;
        m.bandTransition(l);
        p.stateTransition(l)
    };
    n.filtering = function(H, I) {
        m.filtering(H, I);
        p.filtering(H, I)
    };
    n.destroy = function() {
        q.remove()
    };
    n.showTweet = function(I, H) {
        if (H) {
            t.append("circle").attr("class", "twcircle").attr("cx", function(J) {
                return x(I.time)
            }).attr("cy", g - 10).attr("r", 6)
        } else {
            t.select(".twcircle").remove()
        }
    };
    n.highlightStyle = function(H) {
        z[H] = !z[H];
        if (z[H]) {
            q.selectAll(".styleline.style" + H).attr("visibility", "visible")
        } else {
            q.selectAll(".styleline.style" + H).attr("visibility", "hidden")
        }
    };

    function y() {
        E.redraw();
        p.redraw();
        m.redraw(l);
        t.selectAll(".styleline").select("line").attr("x1", function(I) {
            return x(I.time[0])
        }).attr("y1", 0).attr("x2", function(I) {
            return x(I.time[0])
        }).attr("y2", g);
        t.selectAll(".styleline").select("text").attr("x", function(I) {
            return x(I.time[0]) + 2
        });
        var H = t.select(".seltopic");
        if (!H.empty()) {
            H.select(".tpline").attr("x1", x(selTopic.tweets[0].time)).attr("y1", g - 10).attr("x2", x(selTopic.tweets[selTopic.tweets.length - 1].time)).attr("y2", g - 10);
            H.selectAll(".tpcircle").attr("cx", function(I) {
                return x(I.time)
            }).attr("cy", g - 10).attr("r", 6)
        }
        t.select(".x.axis").call(e);
        if (u != null) {
            d3.select(".focus .selline").attr("x1", x(u.time[0])).attr("x2", x(u.time[0]))
        }
    }

    function h() {
        x.domain(c.empty() ? F.domain() : c.extent());
        y()
    }

    function a(I) {
        var H = [];
        I.forEach(function(K) {
            for (var J in K.trigger) {
                H.push({
                    time: new Date(J),
                    keywords: K.trigger[J].keywords
                })
            }
        });
        return H
    }
    return n
};
EmViz.EmStates = function() {
    var p = {},
        a = [3, 28, 50],
        c, f, k = d3.dispatch("stateClick", "stateMouseover", "stateMouseout", "moodMouseover", "moodMouseout");
    p.emData = function(q) {
        if (!arguments.length) {
            return f
        }
        f = q;
        return p
    };
    p.container = function(q) {
        if (!arguments.length) {
            return c
        }
        c = q;
        return p
    };
    p.circleSize = function(q) {
        if (!arguments.length) {
            return a
        }
        a = q;
        return p
    };
    p.dispatch = k;
    var o, d, g, b, h, n = d3.scale.linear().clamp(true).domain([0, 1]).range([0.1, 0.9]),
        j = {
            joy: false,
            trust: false,
            fear: false,
            surprise: false,
            sadness: false,
            disgust: false,
            anger: false,
            anticipation: false
        };
    p.chart = function(r, t) {
        d = r;
        g = t;
        b = d3.scale.linear().domain([0, 1]).range([Math.PI / 2, -Math.PI / 2]);
        var w = d3.format(".2f");
        var v = c.selectAll(".emstate").data(f).enter().append("g").attr("class", "emstate").on("mouseover", m).on("mouseout", i).on("click", e);
        var q = v.append("g").attr("class", "emdetail").attr("visibility", "hidden").attr("opacity", 0);
        q.append("circle").attr("class", "outerr").on("mouseover", function(y) {
            var x = "<p><strong>valence</strong> " + w(y.vad_score[0]) + "</p> <p><strong>arousal</strong> " + w(y.vad_score[2]) + "</p> <p><strong>dominance</strong> " + w(y.vad_score[4]) + "</p>";
            EmViz.showTooltip([d3.event.pageX, d3.event.pageY], x, 20)
        }).on("mouseout", function(x) {
            EmViz.hideTooltip()
        });
        q.append("circle").attr("class", "outerc");
        var u = d3.layout.pack().size([a[1] * 2, a[1] * 2]);
        h = l(u);
        var s = q.selectAll(".moodg").data(function(y, x) {
            return h[x].filter(function(z) {
                return !z.children
            })
        }).enter().append("g").attr("class", "moodg");
        s.append("circle").attr("class", "moodc");
        s.append("line").attr("class", "domlined");
        s.on("mouseover", function(y) {
            var x = "<p><em>" + EmViz.moodstrs[y.em] + "</em></p> <p><strong>valence</strong> " + w(f[y.idx].detail_v[y.em]) + "</p> <p><strong>arousal</strong> " + w(f[y.idx].detail_a[y.em]) + "</p> <p><strong>dominance</strong> " + w(f[y.idx].detail_d[y.em]) + "</p> <p><strong>strength</strong> " + Math.round(y.value / f[y.idx].emsum * 100) + "%</p>";
            EmViz.showTooltip([d3.event.pageX, d3.event.pageY], x, 20);
            k.moodMouseover(f[y.idx], y.em)
        }).on("mouseout", function(x) {
            EmViz.hideTooltip();
            k.moodMouseout(f[x.idx], x.em)
        });
        v.append("circle").attr("class", "innerc");
        v.append("line").attr("class", "domline");
        EmViz.moodstrs.forEach(function(A, y) {
            var x = c.selectAll("." + A + ".emstate2").data(f.filter(function(B) {
                return B.detail_v[y]
            })).enter().append("g").attr("class", A + " emstate2").attr("opacity", 0).attr("visibility", "hidden").on("mouseover", m).on("mouseout", i).on("click", e);
            var z = x.append("g").attr("class", "emdetail").attr("visibility", "hidden").attr("opacity", 0).on("mouseover", function(C) {
                var B = "<p><em>" + A + "</em></p> <p><strong>valence</strong> " + w(C.detail_v[y]) + "</p> <p><strong>arousal</strong> " + w(C.detail_a[y]) + "</p> <p><strong>dominance</strong> " + w(C.detail_d[y]);
                EmViz.showTooltip([d3.event.pageX, d3.event.pageY], B, 20);
                k.moodMouseover(C, y)
            }).on("mouseout", function(B) {
                EmViz.hideTooltip();
                k.moodMouseout(B, y)
            });
            z.append("circle").attr("class", "outerr");
            z.append("circle").attr("class", "outerc");
            z.append("line").attr("class", "domlined");
            x.append("circle").attr("class", "innerc");
            x.append("line").attr("class", "domline")
        });
        return p
    };
    p.redraw = function() {
        var q = c.selectAll(".emstate");
        q.select(".outerr").attr("cx", function(r) {
            return d(r.time[0])
        }).attr("cy", function(r) {
            return g(r.vad_score[0])
        }).attr("r", a[2]);
        q.select(".outerc").attr("cx", function(r) {
            return d(r.time[0])
        }).attr("cy", function(r) {
            return g(r.vad_score[0])
        }).attr("r", a[1]);
        q.select(".innerc").attr("cx", function(r) {
            return d(r.time[0])
        }).attr("cy", function(r) {
            return g(r.vad_score[0])
        }).attr("r", a[0]);
        q.selectAll(".moodc").attr("cx", function(r) {
            return r.x + d(f[r.idx].time[0]) - a[1]
        }).attr("cy", function(r) {
            return r.y + g(f[r.idx].vad_score[0]) - a[1]
        }).attr("r", function(r) {
            return r.r
        }).attr("fill", function(r) {
            var s = d3.hsl(EmViz.emcolors[EmViz.moodstrs[r.em]]);
            s.l = n(f[r.idx].detail_a[r.em]);
            return s.toString()
        });
        q.selectAll(".domlined").attr("x2", function(r) {
            return r.r * Math.cos(b(f[r.idx].detail_d[r.em])) + r.x + d(f[r.idx].time[0]) - a[1]
        }).attr("y2", function(r) {
            return r.r * Math.sin(b(f[r.idx].detail_d[r.em])) + r.y + g(f[r.idx].vad_score[0]) - a[1]
        }).attr("x1", function(r) {
            return -r.r * Math.cos(b(f[r.idx].detail_d[r.em])) + r.x + d(f[r.idx].time[0]) - a[1]
        }).attr("y1", function(r) {
            return -r.r * Math.sin(b(f[r.idx].detail_d[r.em])) + r.y + g(f[r.idx].vad_score[0]) - a[1]
        });
        q.selectAll(".domline").attr("x2", function(r) {
            return a[0] * Math.cos(b(r.vad_score[4])) + d(r.time[0])
        }).attr("y2", function(r) {
            return a[0] * Math.sin(b(r.vad_score[4])) + g(r.vad_score[0])
        }).attr("x1", function(r) {
            return -a[0] * Math.cos(b(r.vad_score[4])) + d(r.time[0])
        }).attr("y1", function(r) {
            return -a[0] * Math.sin(b(r.vad_score[4])) + g(r.vad_score[0])
        });
        EmViz.moodstrs.forEach(function(t, s) {
            var r = c.selectAll("." + t + ".emstate2");
            r.selectAll(".innerc").attr("cx", function(u) {
                return d(u.time[0])
            }).attr("cy", function(u) {
                return g(u.detail_v[s])
            }).attr("r", a[0]).attr("fill", function(u) {
                return EmViz.emcolors[t]
            });
            r.selectAll(".outerr").attr("cx", function(u) {
                return d(u.time[0])
            }).attr("cy", function(u) {
                return g(u.detail_v[s])
            }).attr("r", function(u) {
                return u.y[s] ? a[2] - a[1] + a[1] * u.y[s] : 0
            });
            r.selectAll(".outerc").attr("cx", function(u) {
                return d(u.time[0])
            }).attr("cy", function(u) {
                return g(u.detail_v[s])
            }).attr("r", function(u) {
                return a[1] * u.y[s]
            }).attr("fill", function(u) {
                var v = d3.hsl(EmViz.emcolors[t]);
                v.l = n(u.detail_a[s]);
                return v.toString()
            });
            r.selectAll(".domline").attr("x2", function(u) {
                return a[0] * Math.cos(b(u.detail_d[s])) + d(u.time[0])
            }).attr("y2", function(u) {
                return a[0] * Math.sin(b(u.detail_d[s])) + g(u.detail_v[s])
            }).attr("x1", function(u) {
                return -a[0] * Math.cos(b(u.detail_d[s])) + d(u.time[0])
            }).attr("y1", function(u) {
                return -a[0] * Math.sin(b(u.detail_d[s])) + g(u.detail_v[s])
            });
            r.selectAll(".domlined").attr("x2", function(u) {
                return a[1] * u.y[s] * Math.cos(b(u.detail_d[s])) + d(u.time[0])
            }).attr("y2", function(u) {
                return a[1] * u.y[s] * Math.sin(b(u.detail_d[s])) + g(u.detail_v[s])
            }).attr("x1", function(u) {
                return -a[1] * u.y[s] * Math.cos(b(u.detail_d[s])) + d(u.time[0])
            }).attr("y1", function(u) {
                return -a[1] * u.y[s] * Math.sin(b(u.detail_d[s])) + g(u.detail_v[s])
            })
        })
    };
    p.stateTransition = function(q) {
        if (!q) {
            c.selectAll(".emstate").transition().duration(2000).each("end", function(r) {
                d3.select(this).attr("visibility", "hidden")
            }).attr("opacity", 0);
            c.selectAll(".emstate2").transition().duration(2000).each("start", function(r) {
                if (!j[d3.select(this).attr("class").split(" ")[0]]) {
                    d3.select(this).attr("visibility", "visible")
                }
            }).attr("opacity", 1)
        } else {
            c.selectAll(".emstate").transition().duration(2000).each("start", function(r) {
                d3.select(this).attr("visibility", "visible")
            }).attr("opacity", 1);
            c.selectAll(".emstate2").transition().duration(2000).each("end", function(r) {
                d3.select(this).attr("visibility", "hidden")
            }).attr("opacity", 0)
        }
    };
    p.filtering = function(q, r) {
        if (r > 0.5) {
            j[q] = false
        } else {
            j[q] = true
        }
        if (c.select(".emstate").attr("visibility") == "hidden") {
            c.selectAll("." + q + ".emstate2").attr("visibility", function(s) {
                return r > 0.5 ? "visibile" : "hidden"
            })
        }
    };

    function l(q) {
        function r(t) {
            var s = [];
            t.mood_score.forEach(function(u, v) {
                if (u > 0) {
                    s.push({
                        em: v,
                        value: u
                    })
                }
            });
            return {
                children: s
            }
        }
        return f.map(function(u, s) {
            var t = q.nodes(r(u));
            t.forEach(function(v) {
                v.idx = s
            });
            return t
        })
    }

    function m(q) {
        d3.select(this).select(".innerc").transition().duration(500).attr("opacity", 0);
        d3.select(this).select(".domline").transition().duration(500).attr("opacity", 0);
        d3.select(this).select(".emdetail").transition().duration(500).each("start", function(r) {
            d3.select(this).attr("visibility", "visible")
        }).attr("opacity", 1);
        k.stateMouseover(q);
        d3.event.stopPropagation()
    }

    function i(q) {
        d3.select(this).select(".innerc").transition().duration(500).attr("opacity", 1);
        d3.select(this).select(".domline").transition().duration(500).attr("opacity", 1);
        d3.select(this).select(".emdetail").transition().delay(200).duration(500).each("end", function(r) {
            d3.select(this).attr("visibility", "hidden")
        }).attr("opacity", 0);
        k.stateMouseout(q);
        d3.event.stopPropagation()
    }

    function e(r, q) {
        k.stateClick(r, q)
    }
    return p
};
EmViz.EmTweets = function() {
    var g = {},
        d, b, f, i = 30,
        h = d3.dispatch("triggerMouseover", "triggerMouseout", "triggerClick");
    g.emData = function(k) {
        if (!arguments.length) {
            return d
        }
        d = k;
        return g
    };
    g.container = function(k) {
        if (!arguments.length) {
            return b
        }
        b = k;
        return g
    };
    g.rootsvg = function(k) {
        if (!arguments.length) {
            return f
        }
        f = k;
        return g
    };
    g.maxwords = function(k) {
        if (!arguments.length) {
            return i
        }
        i = k;
        return g
    };
    g.dispatch = h;
    var c, e, a;
    g.chart = function(k, l) {
        c = k;
        e = l;
        tweetsArea = d3.svg.area().interpolate("monotone").x(function(m) {
            return c(m.time[0])
        }).y0(function(m) {
            return e(m.tweet_number)
        }).y1(function(m) {
            return e.range()[1]
        });
        f.select("defs").append("clipPath").attr("id", "tweet-clip").append("path").datum(d).attr("class", "tweetarea");
        b.append("g").attr("clip-path", "url(#tweet-clip)").selectAll("rect").data(d).enter().append("rect").attr("class", "emtweets").on("mouseover", function(m) {
            EmViz.showTooltip([d3.event.pageX, d3.event.pageY], j(m), 20);
            h.triggerMouseover(m)
        }).on("mouseout", function(m) {
            EmViz.hideTooltip();
            h.triggerMouseout(m)
        }).on("click", function(n, m) {
            h.triggerClick(n, m)
        });
        return g
    };
    g.redraw = function() {
        f.select(".tweetarea").attr("d", tweetsArea);
        b.selectAll(".emtweets").attr("x", function(k) {
            return c(k.time[0])
        }).attr("y", 0).attr("width", function(l, k) {
            if (k >= d.length - 1) {
                return 0
            }
            return c(d[k + 1].time[0]) - c(l.time[0])
        }).attr("height", f.attr("height"))
    };

    function j(m) {
        var l = d3.select("#tooltip").html("").append("svg").attr("width", 300).attr("height", 240);
        d3.layout.cloud().size([300, 240]).words(m.words.map(function(n) {
            return {
                text: n.content,
                size: 8 + n.score * 10
            }
        })).padding(2).rotate(0).font("sans-serif").fontSize(function(n) {
            return n.size
        }).timeInterval(Infinity).on("end", k).start();

        function k(n) {
            l.append("g").attr("transform", "translate(150,120)").selectAll("text").data(n).enter().append("text").style("font-size", function(o) {
                return o.size + "px"
            }).style("font-family", "sans-serif").style("fill", "black").attr("text-anchor", "middle").attr("transform", function(o) {
                return "translate(" + [o.x, o.y] + ")"
            }).text(function(o) {
                return o.text
            })
        }
        return d3.select("#tooltip").html()
    }
    return g
};
EmViz.PADplot = function() {
    var d = {},
        l = "",
        r = [],
        b = [],
        n = {},
        e = {},
        i = [1, 1],
        g = 10,
        f = [2, 12],
        q = d3.dispatch("padMouseover", "padMouseout", "padSelect", "padDeselect");
    d.elemID = function(t) {
        if (!arguments.length) {
            return l
        }
        l = t;
        return d
    };
    d.texts = function(t) {
        if (!arguments.length) {
            return b
        }
        b = t;
        return d
    };
    d.data = function(t) {
        if (!arguments.length) {
            return r
        }
        r = t;
        return d
    };
    d.vadDict = function(t) {
        if (!arguments.length) {
            return n
        }
        n = t;
        return d
    };
    d.nrcDict = function(t) {
        if (!arguments.length) {
            return e
        }
        e = t;
        return d
    };
    d.size = function(t) {
        if (!arguments.length) {
            return i
        }
        i = t;
        return d
    };
    d.margin = function(t) {
        if (!arguments.length) {
            return g
        }
        g = t;
        return d
    };
    d.circleSize = function(t) {
        if (!arguments.length) {
            return f
        }
        f = t;
        return d
    };
    d.dispatch = q;
    var h, k, j, m, o, s, p = -1;
    d.chart = function() {
        var t = i[1] - 2 * g,
            y = i[0] - 2 * g,
            A = d3.format(".2f");
        j = c();
        h = d3.select("#" + l).append("svg").attr("width", i[0]).attr("height", i[1]);
        k = h.append("g").attr("class", "chartarea").attr("transform", "translate(" + g + "," + g + ")");
        m = d3.scale.linear().domain([0, 1]).range([0, y]);
        o = d3.scale.linear().domain([0, 1]).range([t, 0]);
        s = d3.scale.linear().domain([0, 1]).range(f);
        var z = d3.svg.axis().scale(m).orient("bottom").ticks(10),
            x = d3.svg.axis().scale(o).orient("right").ticks(10);
        k.append("g").attr("class", "x axis").attr("transform", "translate(0," + t / 2 + ")").call(z);
        k.append("g").attr("class", "y axis").attr("transform", "translate(" + y / 2 + ",0)").call(x);
        k.append("text").attr("class", "axislabel").attr("x", y / 2 - 43).attr("y", 8).text("Valence");
        k.append("text").attr("class", "axislabel").attr("x", y - 40).attr("y", t / 2 - 5).text("Arousal");
        var v = d3.layout.pie().value(function(B) {
                return B.value
            }),
            w = d3.svg.arc().innerRadius(0).outerRadius(function(B) {
                return s(n.get(B.data.word)[4])
            });
        var u = k.selectAll(".padpoint").data(j).enter().append("g").attr("class", "padpoint").attr("transform", function(B) {
            return "translate(" + m(n.get(B)[2]) + "," + o(n.get(B)[0]) + ")"
        });
        u.on("mouseover", function(C) {
            var B = "<p><em>" + C + "</em></p> <p><strong>valence</strong> " + A(n.get(C)[0]) + "</p> <p><strong>arousal</strong> " + A(n.get(C)[2]) + "</p> <p><strong>dominance</strong> " + A(n.get(C)[4]) + "</p> <p><strong>emotion</strong> ";
            e.get(C).forEach(function(D, E) {
                if (D != 0 && E < 8) {
                    B = B + EmViz.moodstrs[E] + " "
                }
            });
            EmViz.showTooltip([d3.event.pageX, d3.event.pageY], B + "</p>", 20);
            q.padMouseover(C)
        }).on("mouseout", function(B) {
            EmViz.hideTooltip();
            q.padMouseout(B)
        }).on("click", function(C, B) {
            k.selectAll(".padpoint.select").classed("select", false);
            if (p == B) {
                p = -1;
                q.padDeselect(C)
            } else {
                p = B;
                d3.select(this).classed("select", true);
                q.padSelect(C)
            }
        });
        u.selectAll(".arc").data(function(B) {
            return v(a(B))
        }).enter().append("path").attr("class", "arc").attr("d", w).attr("fill", function(B) {
            return EmViz.emcolors[B.data.etype]
        });
        return d
    };
    d.destroy = function() {
        h.remove()
    };
    d.highlightWords = function(u, v) {
        if (v) {
            var t = b.get(u.tweet_id.toString()).ewords;
            k.selectAll(".padpoint").filter(function(w) {
                return t.indexOf(w) != -1
            }).classed("highlight", true).append("text").attr("class", "padlabel").attr("x", function(w) {
                return s(n.get(w)[4]) + 2
            }).attr("y", function(w) {
                return s(n.get(w)[4]) / 2 - 3
            }).text(function(w) {
                return w
            });
            k.selectAll(".padpoint").filter(function(w) {
                return t.indexOf(w) == -1
            }).classed("dehighlight", true)
        } else {
            k.selectAll(".padpoint.highlight").classed("highlight", false).select(".padlabel").remove();
            k.selectAll(".padpoint.dehighlight").classed("dehighlight", false)
        }
    };
    d.highlightEmotion = function(u, t) {
        if (t) {
            k.selectAll(".padpoint").filter(function(v) {
                return e.get(v)[u] != 0
            }).classed("highlight", true).append("text").attr("class", "padlabel").attr("x", function(v) {
                return s(n.get(v)[4]) + 2
            }).attr("y", function(v) {
                return s(n.get(v)[4]) / 2 - 3
            }).text(function(v) {
                return v
            });
            k.selectAll(".padpoint").filter(function(v) {
                return e.get(v)[u] == 0
            }).classed("dehighlight", true)
        } else {
            k.selectAll(".padpoint.highlight").classed("highlight", false).select(".padlabel").remove();
            k.selectAll(".padpoint.dehighlight").classed("dehighlight", false)
        }
    };
    d.fixWords = function(u) {
        k.selectAll(".padpoint.select").classed("select", false);
        var t = b.get(u.tweet_id.toString()).ewords;
        k.selectAll(".padpoint").filter(function(v) {
            return t.indexOf(v) != -1
        }).classed("select", true)
    };
    d.unfixWords = function(t) {
        k.selectAll(".padpoint.select").classed("select", false)
    };

    function a(t) {
        var u = e.get(t).slice(0, 8).map(function(w, v) {
            return {
                word: t,
                value: w,
                etype: EmViz.moodstrs[v]
            }
        });
        return u.filter(function(v) {
            return v.value
        })
    }

    function c() {
        var t = [];
        r.forEach(function(u) {
            var v = u.tweet_id.toString();
            if (b.has(v)) {
                t = t.concat(b.get(v).ewords)
            }
        });
        return jQuery.unique(t)
    }
    return d
};
EmViz.TweetsView = function() {
    var d = {},
        g = "",
        f = [],
        c = [],
        j = {},
        k = {},
        h = d3.dispatch("tweetMouseover", "tweetMouseout", "tweetSelect", "tweetDeselect");
    d.elemID = function(m) {
        if (!arguments.length) {
            return g
        }
        g = m;
        return d
    };
    d.texts = function(m) {
        if (!arguments.length) {
            return c
        }
        c = m;
        return d
    };
    d.data = function(m) {
        if (!arguments.length) {
            return f
        }
        f = m;
        return d
    };
    d.vadDict = function(m) {
        if (!arguments.length) {
            return j
        }
        j = m;
        return d
    };
    d.nrcDict = function(m) {
        if (!arguments.length) {
            return k
        }
        k = m;
        return d
    };
    d.dispatch = h;
    var a, e = [],
        i = -1;
    d.chart = function() {
        a = d3.select("#" + g);
        e = l();
        var m = a.selectAll(".textbox").data(e).enter().append("div").attr("class", "textbox").on("mouseover", function(n) {
            h.tweetMouseover(n)
        }).on("mouseout", function(n) {
            h.tweetMouseout(n)
        }).on("click", function(o, n) {
            a.selectAll(".textbox.select").classed("select", false);
            if (i == n) {
                i = -1;
                h.tweetDeselect(o)
            } else {
                i = n;
                d3.select(this).classed("select", true);
                h.tweetSelect(o)
            }
        });
        m.append("p").html(function(n) {
            return b(n.text)
        });
        m.append("p").attr("class", "timep").html(function(n) {
            return "[" + n.time + "]"
        });
        return d
    };
    d.destroy = function() {
        a.selectAll(".textbox").remove()
    };
    d.highlightTweet = function(m, n) {
        if (n) {
            if (typeof(m) == "string") {
                a.selectAll(".textbox").filter(function(o) {
                    return c.get(o.tweet_id.toString()).ewords.indexOf(m) != -1
                }).classed("highlight", true)
            } else {
                a.selectAll(".textbox").filter(function(o) {
                    return o.tweet_id == m.tweet_id
                }).classed("highlight", true)
            }
            $("#tweets_box").scrollTop($(".textbox.highlight")[0].offsetTop - 8)
        } else {
            a.selectAll(".textbox.highlight").classed("highlight", false)
        }
    };
    d.fixTweets = function(n, m) {
        a.selectAll(".textbox").classed("select", false);
        if (m == "topic") {
            var o = n.tweets.map(function(p) {
                return p.tweet_id
            });
            a.selectAll(".textbox").filter(function(p) {
                return o.indexOf(p.tweet_id) != -1
            }).classed("select", true)
        } else {
            if (m == "word") {
                a.selectAll(".textbox").filter(function(p) {
                    return c.get(p.tweet_id.toString()).ewords.indexOf(n) != -1
                }).classed("select", true)
            }
        }
    };
    d.unfixTweets = function(m) {
        a.selectAll(".textbox").classed("select", false)
    };
    d.highlightEmotion = function(n, m) {
        if (m) {
            a.selectAll(".textbox").filter(function(r) {
                var q = false,
                    o = c.get(r.tweet_id.toString()).ewords;
                for (var p = 0; p < o.length; p++) {
                    if (k.get(o[p])[n] != 0) {
                        q = true;
                        break
                    }
                }
                return q
            }).classed("highlight", true);
            if ($(".textbox.highlight").size() != 0) {
                $("#tweets_box").scrollTop($(".textbox.highlight")[0].offsetTop - 8)
            }
        } else {
            a.selectAll(".textbox.highlight").classed("highlight", false)
        }
    };

    function l() {
        var m = d3.set();
        var n = [];
        f.forEach(function(o) {
            var p = o.tweet_id.toString();
            if (c.has(p) && !m.has(o.tweet_id)) {
                m.add(o.tweet_id);
                n.push({
                    tweet_id: o.tweet_id,
                    time: o.time,
                    text: c.get(p).text
                })
            }
        });
        return n
    }

    function b(m) {
        return m.replace(/\w+/g, function(o) {
            var n = o.toLowerCase();
            if (k.has(n) && j.has(n)) {
                return "<strong>" + o + "</strong>"
            } else {
                return o
            }
        })
    }
    return d
};
$(function() {
    $("#userid_text").button();
    $("#show_button").button({
        icons: {
            primary: "ui-icon-search"
        },
        label: "Show",
        text: false
    }).click(function(d) {
        $("#vizcontent").hide();
        $("#progressbar").show();
        display()
    });
    $("#split_button").button({
        icons: {
            primary: "ui-icon-shuffle"
        },
        text: false
    }).click(function(d) {
        emtimeline.bandTransition()
    });
    $("#emotionstyle").buttonset();
    $("#emstyle1").click(function(d) {
        emtimeline.highlightStyle(0)
    });
    $("#emstyle2").click(function(d) {
        emtimeline.highlightStyle(1)
    });
    $("#emstyle3").click(function(d) {
        emtimeline.highlightStyle(2)
    });
    $("#progressbar").progressbar({
        value: false
    }).hide();
    $("#mode_button").button().click(function(d) {
        local = !local
    });
    var b = d3.select("#legend"),
        c = 75;
    var a = b.selectAll(".legendc").data(EmViz.moodstrs).enter().append("g").attr("class", "legendc");
    a.append("circle").attr("cx", function(f, e) {
        return Math.floor(e / 2) * c + 7
    }).attr("cy", function(f, e) {
        return e % 2 == 0 ? 8 : 24
    }).attr("r", 5).attr("stroke", function(e) {
        return EmViz.emcolors[e]
    }).attr("fill", function(e) {
        return EmViz.emcolors[e]
    }).attr("fill-opacity", 0.8).style("cursor", "hand").on("click", function(f) {
        var e = d3.select(this).attr("fill-opacity");
        if (e == 0.8) {
            d3.select(this).attr("fill-opacity", 0.4);
            emtimeline.filtering(f, 0.4)
        } else {
            d3.select(this).attr("fill-opacity", 0.8);
            emtimeline.filtering(f, 0.8)
        }
    });
    a.append("text").attr("x", function(f, e) {
        return Math.floor(e / 2) * c + 14
    }).attr("y", function(f, e) {
        return e % 2 == 0 ? 11 : 27
    }).text(function(e) {
        return e
    })
});