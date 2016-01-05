/* Doony v2.1 | (c) 2014 Kevin Burke | License: MIT */ ! function(window, document) {
    var absPos = function(element) {
            var offsetLeft, offsetTop;
            if (offsetLeft = offsetTop = 0, element.offsetParent)
                do offsetLeft += element.offsetLeft, offsetTop += element.offsetTop; while (null !== (element = element.offsetParent));
            return [offsetLeft, offsetTop]
        },
        ProgressCircle = function(params) {
            this.canvas = params.canvas, this.minRadius = params.minRadius || 15, this.arcWidth = params.arcWidth || 5, this.gapWidth = params.gapWidth || 3, this.centerX = params.centerX || this.canvas.width / 2, this.centerY = params.centerY || this.canvas.height / 2, this.infoLineLength = params.infoLineLength || 60, this.horizLineLength = params.horizLineLength || 10, this.infoLineAngleInterval = params.infoLineAngleInterval || Math.PI / 8, this.infoLineBaseAngle = params.infoLineBaseAngle || Math.PI / 6, this.context = this.canvas.getContext("2d"), this.width = this.canvas.width, this.height = this.canvas.height, this.circles = [], this.runningCount = 0
        };
    ProgressCircle.prototype = {
        constructor: ProgressCircle,
        addEntry: function(params) {
            return this.circles.push(new Circle({
                canvas: this.canvas,
                context: this.context,
                centerX: this.centerX,
                centerY: this.centerY,
                innerRadius: this.minRadius + this.circles.length * (this.gapWidth + this.arcWidth),
                arcWidth: this.arcWidth,
                infoLineLength: this.infoLineLength,
                horizLineLength: this.horizLineLength,
                id: this.circles.length,
                fillColor: params.fillColor,
                outlineColor: params.outlineColor,
                progressListener: params.progressListener,
                infoListener: params.infoListener,
                infoLineAngle: this.infoLineBaseAngle + this.circles.length * this.infoLineAngleInterval
            })), this
        },
        start: function(interval) {
            var self = this;
            return this.timer = setInterval(function() {
                self._update()
            }, interval || 33), this
        },
        stop: function() {
            clearTimeout(this.timer)
        },
        _update: function() {
            return this._clear(), this.circles.forEach(function(circle) {
                circle.update()
            }), this
        },
        _clear: function() {
            return this.context.clearRect(0, 0, this.canvas.width, this.canvas.height), this
        }
    };
    var Circle = function(params) {
        if (this.id = params.id, this.canvas = params.canvas, this.context = params.context, this.centerX = params.centerX, this.centerY = params.centerY, this.arcWidth = params.arcWidth, this.innerRadius = params.innerRadius || 0, this.fillColor = params.fillColor || "#fff", this.outlineColor = params.outlineColor || this.fillColor, this.progressListener = params.progressListener, this.infoLineLength = params.infoLineLength || 250, this.horizLineLength = params.horizLineLength || 50, this.infoListener = params.infoListener, this.infoLineAngle = params.infoLineAngle, this.outerRadius = this.innerRadius + this.arcWidth, this.infoListener) {
            var angle = this.infoLineAngle,
                arcDistance = (this.innerRadius + this.outerRadius) / 2,
                sinA = Math.sin(angle),
                cosA = Math.cos(angle);
            this.infoLineStartX = this.centerX + sinA * arcDistance, this.infoLineStartY = this.centerY - cosA * arcDistance, this.infoLineMidX = this.centerX + sinA * this.infoLineLength, this.infoLineMidY = this.centerY - cosA * this.infoLineLength, this.infoLineEndX = this.infoLineMidX + (0 > sinA ? -this.horizLineLength : this.horizLineLength), this.infoLineEndY = this.infoLineMidY;
            var infoText = document.createElement("div"),
                style = infoText.style;
            style.color = this.fillColor, style.position = "absolute", style.left = this.infoLineEndX + absPos(this.canvas)[0] + "px", infoText.className = "ProgressCircleInfo", infoText.id = "progress_circle_info_" + this.id, document.body.appendChild(infoText), this.infoText = infoText
        }
    };
    Circle.prototype = {
        constructor: Circle,
        update: function() {
            this.progress = this.progressListener(), this._draw(), this.infoListener && (this.info = this.infoListener(), this._drawInfo())
        },
        _draw: function() {
            var ctx = this.context,
                ANGLE_OFFSET = -Math.PI / 2,
                startAngle = 0 + ANGLE_OFFSET,
                endAngle = startAngle + this.progress * Math.PI * 2,
                x = this.centerX,
                y = this.centerY,
                innerRadius = this.innerRadius,
                outerRadius = this.outerRadius;
            return ctx.fillStyle = this.fillColor, ctx.strokeStyle = this.outlineColor, ctx.beginPath(), ctx.arc(x, y, innerRadius, startAngle, endAngle, !1), ctx.arc(x, y, outerRadius, endAngle, startAngle, !0), ctx.closePath(), ctx.stroke(), ctx.fill(), this
        },
        _drawInfo: function() {
            var pointList, lineHeight;
            return pointList = [
                [this.infoLineStartX, this.infoLineStartY],
                [this.infoLineMidX, this.infoLineMidY],
                [this.infoLineEndX, this.infoLineEndY]
            ], this._drawSegments(pointList, !1), this.infoText.innerHTML = this.info, lineHeight = this.infoText.offsetHeight, this.infoText.style.top = this.infoLineEndY + absPos(this.canvas)[1] - lineHeight / 2 + "px", this
        },
        _drawSegments: function(pointList, close) {
            var ctx = this.context;
            ctx.beginPath(), ctx.moveTo(pointList[0][0], pointList[0][1]);
            for (var i = 1; i < pointList.length; ++i) ctx.lineTo(pointList[i][0], pointList[i][1]);
            close && ctx.closePath(), ctx.stroke()
        }
    }, window.ProgressCircle = ProgressCircle
}(window, document), jQuery(function($) {
    var colors = ["#C02942", "#4ecdc4", "#d95b43", "#556270", "#542437", "#8fbe00"],
        Alert = {
            ERROR: "alert-danger",
            WARNING: "alert-warning"
        },
        getSubdomain = function(domain) {
            if (/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(domain)) return domain;
            var parts = domain.split(".");
            return parts.length <= 2 ? parts.join(".") : parts.slice(0, -3).join(".")
        },
        hashCode = function(string) {
            var i, l, char, hash = 0;
            if (0 === string.length) return hash;
            for (i = 0, l = string.length; l > i; i++) char = string.charCodeAt(i), hash = (hash << 5) - hash + char, hash |= 0;
            return hash
        },
        isJobPage = function(path) {
            return null !== path.match(/^\/job\/.*?\//)
        },
        isJobHomepage = function(path) {
            return null !== path.match(/^\/job\/.*?\/(.*?=.*?\/)?$/)
        },
        isRootHomepage = function(path) {
            return null !== path.match(/^\/job\/.*?\/$/)
        },
        getRootJobUrl = function(path) {
            return path.match(/^\/job\/.*?\//)[0]
        },
        getJobUrl = function(path) {
            return path.match(/^\/job\/.*?\/(.*?=.*?\/)?/)[0]
        },
        redirectForUrl = function(jobUrl, buildNumber) {
            $.getJSON(jobUrl + "api/json?tree=builds[number]", function(data) {
                for (var i = 0; i < data.builds.length; i++) {
                    var build = data.builds[i];
                    build.number === buildNumber && (window.location.href = jobUrl + buildNumber + "/consoleFull")
                }
                setTimeout(function() {
                    redirectForUrl(jobUrl, buildNumber)
                }, 1e3)
            })
        },
        redirectToNewJobConsole = function(jobUrl, buildNumber) {
            return isRootHomepage(jobUrl) ? void $.getJSON(jobUrl + "api/json?tree=activeConfigurations[name]", function(data) {
                if ("{}" !== JSON.stringify(data) && "activeConfigurations" in data) {
                    var downstreamUrl = jobUrl + data.activeConfigurations[0].name + "/";
                    return redirectForUrl(downstreamUrl, buildNumber)
                }
                return redirectForUrl(jobUrl, buildNumber)
            }) : redirectForUrl(jobUrl, buildNumber)
        },
        showButterBar = function(message, alertName) {
            var div = document.createElement("div");
            div.className = "alert doony-alert " + alertName, div.innerHTML = message, $("#main-panel").prepend(div)
        },
        domain = getSubdomain(window.location.hostname),
        doonyTitleLink = $("#jenkins-home-link");
    0 === doonyTitleLink.length ? (doonyTitleLink = $("#top-panel a").first(), doonyTitleLink.html("<div id='doony-title'>" + domain + "</div>")) : (doonyTitleLink.html(domain), 0 === doonyTitleLink.parent("td").length && doonyTitleLink.addClass("new-header-link"));
    var color = colors[Math.abs(hashCode(domain)) % colors.length];
    $("#top-panel, #header").css("background-color", color), $(".task").each(function() {
        $("a img", $(this)).remove(), $(this).html(function(_, oldHtml) {
            var replaced = oldHtml.replace(/&nbsp;/g, "", "g");
            return replaced
        })
    });
    var getCallout = function(message, href) {
            return "<div class='doony-callout doony-callout-info'><a " + (null === href ? "" : "href='" + href + "'") + ">" + message + "</a></div>"
        },
        updateConfiguration = function(jobUrl, name) {
            $.getJSON(jobUrl + name + "api/json?tree=lastBuild[number]", function(data) {
                null !== data.lastBuild && "number" in data.lastBuild && $("#matrix .model-link").each(function(_, item) {
                    if (item.getAttribute("href") === name) {
                        var href = jobUrl + name + data.lastBuild.number + "/consoleFull";
                        $(item).next(".doony-callout").children("a").attr("href", href)
                    }
                })
            })
        };
    $("#matrix").length && setInterval(function() {
        var jobUrl = getJobUrl(window.location.pathname);
        $("#matrix .doony-downstream-link").length || ($("#matrix .model-link").wrap("<div class='doony-downstream-link'>"), $("#matrix .model-link").each(function(_, item) {
            var message = "View console output for the latest build";
            $(item).after(getCallout(message, null))
        }), $.getJSON(jobUrl + "api/json?tree=activeConfigurations[name]", function(data) {
            for (var i = 0; i < data.activeConfigurations.length; i++) {
                var config = data.activeConfigurations[i];
                updateConfiguration(jobUrl, config.name + "/")
            }
        }))
    }, 50);
    var replaceFloatyBall = function(selector, type) {
            $(selector).each(function() {
                var wrapper = document.createElement("div");
                wrapper.className = "doony-circle doony-circle-" + type, wrapper.style.display = "inline-block";
                var dimension;
                "48" === this.getAttribute("width") || "24" === this.getAttribute("width") ? (dimension = .5 * this.getAttribute("width") + 8, wrapper.style.marginRight = "15px", wrapper.style.verticalAlign = "middle") : this.classList.contains("icon32x32") ? (dimension = 24, wrapper.style.marginTop = "4px", wrapper.style.marginLeft = "4px") : dimension = this.getAttribute("width") || 12, $(wrapper).css("width", dimension), $(wrapper).css("height", dimension), $(this).after(wrapper).remove()
            })
        },
        replaceBouncingFloatyBall = function(selector, color) {
            $(selector).each(function() {
                if (!$(this).next(".doony-canvas").length) {
                    var canvas = document.createElement("canvas");
                    canvas.className = "doony-canvas";
                    var dimension;
                    "48" === this.getAttribute("width") || "24" === this.getAttribute("width") ? (dimension = .5 * this.getAttribute("width") + 8, canvas.style.marginRight = "15px", canvas.style.verticalAlign = "middle") : this.classList.contains("icon32x32") ? (dimension = 24, canvas.style.marginTop = "4px", canvas.style.marginLeft = "4px") : dimension = this.getAttribute("width") || 12, canvas.setAttribute("width", dimension), canvas.setAttribute("height", dimension);
                    var circle = new ProgressCircle({
                            canvas: canvas,
                            minRadius: 3 * dimension / 8 - 2,
                            arcWidth: dimension / 8 + 1
                        }),
                        x = 0;
                    circle.addEntry({
                        fillColor: color,
                        progressListener: function() {
                            return x >= 1 && (x = 0), x += .005
                        }
                    }), circle.start(24), $(this).after(canvas).css("display", "none")
                }
            })
        },
        green = "#4f9f4f";
    if (setInterval(function() {
            replaceBouncingFloatyBall("img[src*='red_anime.gif']", "#d9534f"), replaceBouncingFloatyBall("img[src*='blue_anime.gif']", green), replaceBouncingFloatyBall("img[src*='grey_anime.gif']", "#999"), replaceBouncingFloatyBall("img[src*='aborted_anime.gif']", "#999"), replaceBouncingFloatyBall("img[src*='yellow_anime.gif']", "#f0ad4e")
        }, 10), setInterval(function() {
            replaceFloatyBall("img[src*='/aborted.png']", "aborted"), replaceFloatyBall("img[src*='/blue.png']", "success"), replaceFloatyBall("img[src*='/red.png']", "failure"), replaceFloatyBall("img[src*='/yellow.png']", "warning"), replaceFloatyBall("img[src*='/grey.png']", "aborted"), replaceFloatyBall("img[src*='/nobuilt.png']", "notbuilt"), replaceFloatyBall("img[src*='/disabled.png']", "notbuilt")
        }, 10), isJobHomepage(window.location.pathname)) {
        var jobUrl = getJobUrl(window.location.pathname);
        $.getJSON(jobUrl + "api/json?tree=lastBuild[number]", function(data) {
            if ("lastBuild" in data && null !== data.lastBuild && "number" in data.lastBuild) {
                var message = "View console output for the latest build",
                    href = jobUrl + data.lastBuild.number + "/consoleFull",
                    h2 = $("h2:contains('Permalinks')");
                h2.after(getCallout(message, href))
            }
        })
    }
    if (isJobPage(window.location.pathname)) {
        var button = document.createElement("button");
        button.className = "btn btn-primary doony-build", button.innerHTML = "Build Now", $(button).click(function() {
            var jobUrl = getRootJobUrl(window.location.pathname);
            $.getJSON(jobUrl + "api/json?depth=1&tree=nextBuildNumber,lastBuild[building]", function(data) {
                $.post(jobUrl + "build", function() {
                    var message = "Build #" + data.nextBuildNumber + " created, you will be redirected when it is ready.";
                    "{}" !== JSON.stringify(data) && "lastBuild" in data && null !== data.lastBuild && data.lastBuild.building && (message += " <a href='#' id='doony-clear-build'>Cancel the current build</a>"), showButterBar(message, Alert.WARNING), redirectToNewJobConsole(getJobUrl(window.location.pathname), data.nextBuildNumber)
                }).fail(function(jqXHR) {
                    403 === jqXHR.status ? showButterBar("Cannot create build. Maybe you need to log in or have the 'build' permission.", Alert.ERROR) : showButterBar("An error occured. Please try again.", Alert.ERROR)
                })
            })
        }), $(document).on("click", "#doony-clear-build", function(e) {
            e.preventDefault();
            var jobUrl = getRootJobUrl(window.location.pathname);
            $.getJSON(jobUrl + "api/json?tree=lastBuild[number]", function(data) {
                $.post(jobUrl + data.lastBuild.number + "/stop")
            })
        });
        var title = $("#main-panel h1").first();
        title.children("div").length ? title.append(button) : (title.css("display", "inline-block"), title.after(button))
    }
    $("#l10n-footer").after("<span class='doony-theme'>Browsing Jenkins with the <a target='_blank' href='https://github.com/kevinburke/doony'>Doony theme</a></span>")
});
//# sourceMappingURL=doony.js.map