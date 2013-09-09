var expect = require("expect.js");
var mocha = require("mocha");
var http = require("http");
var fs = require("fs");
var createServer = require("./testHelpers/createServer");

describe("serveAsset paths", function () {
  it("allows the served path to be changed", function (done) {
    createServer.call(this, { servePath: "arsets" }, function () {
      var path = this.assetPath("blank.js");
      var url = this.host + path;

      expect(path).to.contain("/arsets/");

      http.get(url, function (res) {
        expect(res.statusCode).to.equal(200);
        done();
      });
    });
  });

  it("does not serve assets for URLs outside of serve path", function (done) {
    createServer.call(this, {}, function () {
      var path = this.assetPath("blank.js").replace("/assets", "");
      var url = this.host + path;

      http.get(url, function (res) {
        expect(res.statusCode).to.equal(404);
        done();
      });
    });
  });

  it("does not serve asset if fingerprint doesn't match", function (done) {
    createServer.call(this, {}, function () {
      var path = this.assetPath("blank.js").replace("af7c72e86aadcfde95bb29d286c27034", "436828974cd5282217fcbd406d41e9ca");
      var url = this.host + path;

      http.get(url, function (res) {
        expect(res.statusCode).to.equal(404);
        done();
      });
    });
  });

  it("does not serve asset if fingerprint isn't supplied", function (done) {
    createServer.call(this, {}, function () {
      var path = this.assetPath("blank.js").replace("-af7c72e86aadcfde95bb29d286c27034", "");
      var url = this.host + path;

      http.get(url, function (res) {
        expect(res.statusCode).to.equal(404);
        done();
      });
    });
  });
});