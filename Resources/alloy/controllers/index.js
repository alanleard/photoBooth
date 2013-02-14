function Controller() {
    function photoSuccess(event) {
        function signWrite() {
            function signErase() {
                paintView.clear();
                photoView.remove(paintView);
                paintView = null;
                sign.removeEventListener("click", signErase);
                sign.title = "Sign";
                sign.addEventListener("click", signWrite);
            }
            sign.removeEventListener("click", signWrite);
            sign.title = "Clear";
            sign.addEventListener("click", signErase);
            var Paint = require("ti.paint"), paintView = Paint.createPaintView({
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                strokeColor: "#ff9933",
                strokeAlpha: 255,
                strokeWidth: 6,
                eraseMode: !1
            });
            photoView.add(paintView);
        }
        $.loadingView.show();
        win.open();
        var overlayImage = Titanium.UI.createImageView({
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            touchEnabled: !1
        });
        Ti.Platform.displayCaps.platformWidth > Ti.Platform.displayCaps.platformHeight ? overlayImage.image = "backgroundLand.png" : overlayImage.image = "backgroundPort.png";
        Ti.Gesture.addEventListener("orientationchange", function(e) {
            if (e.orientation == Titanium.UI.LANDSCAPE_RIGHT || e.orientation == Titanium.UI.LANDSCAPE_LEFT) overlayImage.image = "backgroundLand.png"; else if (e.orientation == Titanium.UI.PORTRAIT || e.orientation == Ti.UI.UPSIDE_PORTRAIT) overlayImage.image = "backgroundPort.png";
        });
        var imageView = Ti.UI.createImageView({
            image: event.media
        }), zoomView = Ti.UI.createScrollView({
            contentHeight: "auto",
            contentWidth: "auto",
            top: 50,
            left: 50,
            right: 40,
            bottom: 35,
            zoomScale: 0.5,
            minZoomScale: 0.1,
            maxZoomScale: 5,
            backgroundColor: "#5f3a18"
        }), photoView = Ti.UI.createImageView();
        zoomView.add(imageView);
        photoView.add(zoomView);
        photoView.add(overlayImage);
        win.add(photoView);
        var save = Ti.UI.createButton({
            title: "Save",
            bottom: 3,
            right: 5,
            width: 100,
            height: 30,
            backgroundImage: "button.png",
            color: "#ffffff"
        });
        win.add(save);
        var sign = Ti.UI.createButton({
            title: "Sign",
            bottom: 3,
            width: 100,
            height: 30,
            backgroundImage: "button.png",
            color: "#ffffff"
        });
        win.add(sign);
        var cancel = Ti.UI.createButton({
            title: "Cancel",
            bottom: 3,
            left: 5,
            width: 100,
            height: 30,
            zIndex: 1000,
            backgroundImage: "button.png",
            color: "#ffffff"
        });
        win.add(cancel);
        cancel.addEventListener("click", function() {
            $.loadingView.hide();
            win.close();
        });
        save.addEventListener("click", function() {
            Titanium.Media.saveToPhotoGallery(photoView.toImage());
            alert("Image saved to Gallery");
            $.loadingView.hide();
            var image = photoView.toImage(), filename = (new Date).getTime() + "-ea.jpg", dir = Ti.Filesystem.getapplicationDataDirectory(), new_dir = Titanium.Filesystem.getFile(dir, "images");
            new_dir.exists() || new_dir.createDirectory();
            var bgImage = Titanium.Filesystem.getFile(dir + "/images", filename);
            bgImage.write(image);
            var postImage = Ti.UI.createImageView({
                image: bgImage.nativePath,
                width: 300,
                height: 300
            }), thumbFilename = (new Date).getTime() + "-ea-thumb.jpg", thumbImage = Titanium.Filesystem.getFile(dir + "/images", thumbFilename);
            thumbImage.write(postImage.toImage());
            bgImage.deleteFile();
            images.unshift(thumbImage.nativePath);
            images.length > 10 && images.pop();
            $.imageScroll.setImages(images);
            win.close();
        });
        sign.addEventListener("click", signWrite);
    }
    function camera() {
        Titanium.Media.showCamera({
            success: function(e) {
                Titanium.Media.saveToPhotoGallery(e.media);
                photoSuccess(e);
            },
            cancel: selectImage,
            error: function(error) {
                var a = Titanium.UI.createAlertDialog({
                    title: "Camera"
                });
                error.code == Titanium.Media.NO_CAMERA ? a.setMessage("Sorry, you need a camera.") : a.setMessage("Unexpected error: " + error.code);
                a.show();
            },
            mediaTypes: Ti.Media.MEDIA_TYPE_PHOTO,
            autohide: !0
        });
    }
    function gallery() {
        Titanium.Media.openPhotoGallery({
            success: photoSuccess,
            cancel: function() {},
            error: function(error) {
                var a = Titanium.UI.createAlertDialog({
                    title: "Camera"
                });
                a.setMessage("Unexpected error: " + error.code);
                a.show();
            },
            mediaTypes: Ti.Media.MEDIA_TYPE_PHOTO,
            autohide: !0
        });
    }
    function selectImage() {
        if (win.children) for (var i = 0, l = win.children.length; l > i; l--) win.remove(win.children[l - 1]);
        if (Ti.Media.isCameraSupported) {
            var dialog = Ti.UI.createOptionDialog({
                title: "Let's get a photo!",
                options: [ "Snap a Photo!", "Image Gallery", "Cancel" ],
                buttonNames: [ "Snap a Photo!", "Image Gallery" ],
                cancel: 2
            });
            dialog.show();
            dialog.addEventListener("click", function(e) {
                switch (e.index) {
                  case 0:
                    camera();
                    break;
                  case 1:
                    gallery();
                    break;
                  case 2:
                }
            });
        } else gallery();
    }
    function deleteImages(args) {
        if (args.x < 50 && args.y < 50) {
            var resourcesDir = Titanium.Filesystem.applicationDataDirectory, dir = Titanium.Filesystem.getFile(resourcesDir + "/images");
            if (dir.exists()) {
                var alertDialog = Ti.UI.createAlertDialog({
                    title: "Reset image directory?",
                    buttonNames: [ "No", "Yes" ],
                    cancel: 0
                });
                alertDialog.show();
                alertDialog.addEventListener("click", function(e) {
                    if (e.index == 1) {
                        dir.deleteDirectory(!0);
                        images = [];
                        images.push("avan.png");
                        $.imageScroll.setImages(images);
                    }
                });
            }
        }
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    $model = arguments[0] ? arguments[0].$model : null;
    var $ = this, exports = {}, __defers = {};
    $.__views.index = A$(Ti.UI.createWindow({
        backgroundColor: "white",
        id: "index"
    }), "Window", null);
    $.addTopLevelView($.__views.index);
    selectImage ? $.__views.index.on("touchend", selectImage) : __defers["$.__views.index!touchend!selectImage"] = !0;
    deleteImages ? $.__views.index.on("longpress", deleteImages) : __defers["$.__views.index!longpress!deleteImages"] = !0;
    $.__views.imageScroll = A$(Ti.UI.iOS.createCoverFlowView({
        right: 60,
        bottom: 50,
        left: 70,
        height: 400,
        contentHeight: "auto",
        contentWidth: "auto",
        id: "imageScroll"
    }), "CoverFlowView", $.__views.index);
    $.__views.index.add($.__views.imageScroll);
    $.__views.loadingView = A$(Ti.UI.createView({
        id: "loadingView",
        backgroundColor: "#5f3a18",
        visible: "false",
        opacity: "0.9"
    }), "View", $.__views.index);
    $.__views.index.add($.__views.loadingView);
    $.__views.loadingLabel = A$(Ti.UI.createActivityIndicator({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        message: "Loading Photo...",
        color: "#ffffff",
        font: {
            fontSize: 30
        },
        style: Ti.UI.iPhone.ActivityIndicatorStyle.BIG,
        id: "loadingLabel"
    }), "ActivityIndicator", $.__views.loadingView);
    $.__views.loadingView.add($.__views.loadingLabel);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.index.open();
    $.loadingLabel.show();
    Ti.Platform.displayCaps.platformWidth > Ti.Platform.displayCaps.platformHeight ? $.index.backgroundImage = "main.png" : $.index.backgroundImage = "mainPort.png";
    Ti.Gesture.addEventListener("orientationchange", function(e) {
        if (e.orientation == Titanium.UI.LANDSCAPE_RIGHT || e.orientation == Titanium.UI.LANDSCAPE_LEFT) $.index.backgroundImage = "main.png"; else if (e.orientation == Titanium.UI.PORTRAIT || e.orientation == Ti.UI.UPSIDE_PORTRAIT) $.index.backgroundImage = "mainPort.png";
    });
    var images = [], win = Ti.UI.createWindow({}), resourcesDir = Titanium.Filesystem.applicationDataDirectory, dir = Titanium.Filesystem.getFile(resourcesDir + "/images");
    if (dir.exists()) {
        var dir_files = dir.getDirectoryListing();
        if (dir_files.length > 1) {
            for (var i = 1, l = dir_files.length; i < l; i++) {
                dir_files[i].isHidden || images.unshift(resourcesDir + "/images" + "/" + dir_files[i]);
                i > 10 && images.pop();
            }
            images.push("avan.png");
            $.imageScroll.setImages(images);
        } else if (images.length < 1) {
            images.push("avan.png");
            $.imageScroll.setImages(images);
        }
    } else {
        images.push("avan.png");
        $.imageScroll.setImages(images);
    }
    __defers["$.__views.index!touchend!selectImage"] && $.__views.index.on("touchend", selectImage);
    __defers["$.__views.index!longpress!deleteImages"] && $.__views.index.on("longpress", deleteImages);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._, A$ = Alloy.A, $model;

module.exports = Controller;