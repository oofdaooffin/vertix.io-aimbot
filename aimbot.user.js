// Must need tampermonkey or greasymonkey so you can add this script

// ==UserScript==
// @name         SLITHERE.COM Vertix.io Aimbot with C KEY
// @description  Auto Aim To Enemies With Pressing C Key
// @updateURL    https://greasyfork.org/scripts/30109-slithere-com-vertix-io-aimbot-with-c-key/code/SLITHERECOM%20Vertixio%20Aimbot%20with%20C%20KEY.user.js
// @downloadURL  https://greasyfork.org/scripts/30109-slithere-com-vertix-io-aimbot-with-c-key/code/SLITHERECOM%20Vertixio%20Aimbot%20with%20C%20KEY.user.js
// @match        http://vertix.io
// @match        http://www.vertix.io
// @version      1.1
// @namespace    SLITHERE.COM
// @author       SLITHERE.COM
// ==/UserScript==

var aktif = false;
var interval = void 0;


function getMyPlayer(gameObjects) {
  return gameObjects.filter(function (o) {
    return o.name === player.name;
  })[0];
}

function distance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function getClosestPlayer(gameObjects) {
  var myTeam = getMyPlayer(gameObjects).team;
  var otherPlayers = getOtherPlayers(gameObjects, myTeam);
  var closestDistance = Infinity;
  var closestPlayer = void 0;
  otherPlayers.forEach(function (p) {
    var d = distance(player.x, player.y, p.x, p.y);
    if (d < closestDistance) {
      closestPlayer = p;
      closestDistance = d;
    }
  });
  return closestPlayer;
}

function getAngle(x1, y1, x2, y2) {
  return Math.atan2(y1 - y2, x1 - x2);
}

function setTarget(angle, distance) {
  target.f = angle;
  target.d = distance;
}

function aimClosestPlayer() {
  var closestPlayer = getClosestPlayer(gameObjects);
  if (!closestPlayer) {
    return;
  }
  var angle = getAngle(player.x, player.y, closestPlayer.x, closestPlayer.y);
  var distance = 100;
  setTarget(angle, distance);
  targetChanged = true;
}

function activate(event) {
  event.preventDefault();
  if (event.keyCode === 67 && !aktif) {
    c.removeEventListener("mousemove", gameInput, false);
    aktif = true;
    interval = setInterval(aimClosestPlayer, 10);
  }
}

function deactivate(event) {
  event.preventDefault();
  if (event.keyCode === 67) {
    aktif = false;
    clearInterval(interval);
    c.addEventListener("mousemove", gameInput, false);
  }
}

c.addEventListener("keydown", activate, false);
c.addEventListener("keyup", deactivate, false);

function getOtherPlayers(gameObjects, myTeam) {
  return gameObjects.filter(function (o) {
    return o.type === 'player' && o.dead === false && o.name !== player.name && o.team !== myTeam;
  });
}
