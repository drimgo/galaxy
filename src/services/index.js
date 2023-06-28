const users = require('./users/users.service.js');
const roomCategories = require('./room-categories/room-categories.service.js');
const rooms = require('./rooms/rooms.service.js');
const roomMsg = require('./room-msg/room-msg.service.js');
const roomActs = require('./room-acts/room-acts.service.js');
const mannequinData = require('./mannequin-data/mannequin-data.service.js');
const uploads = require('./uploads/uploads.service.js');
const mannequin = require('./mannequin/mannequin.service.js');
const planet = require('./planet/planet.service.js');
const planetData = require('./planet-data/planet-data.service.js');
const online = require('./online/online.service.js');
const planetXy = require('./planet-xy/planet-xy.service.js');
const roomKicked = require('./room-kicked/room-kicked.service.js');
const kicked = require('./kicked/kicked.service.js');
const photos = require('./photos/photos.service.js');
const changePassword = require('./change-password/service.js')
const restorePassword = require('./restore-password/restore-password.service.js');
const recoveryCodes = require('./recovery-codes/recovery-codes.service.js');
const smileys = require('./smileys/smileys.service.js');
const notifications = require('./notifications/notifications.service.js');
const roomActions = require('./room-actions/room-actions.service.js');
const pushsub = require('./pushsub/pushsub.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users);
  app.configure(roomCategories);
  app.configure(rooms);
  app.configure(roomMsg);
  app.configure(roomActs);
  app.configure(mannequinData);
  app.configure(uploads);
  app.configure(mannequin);
  app.configure(planet);
  app.configure(planetData);
  app.configure(online);
  app.configure(planetXy);
  app.configure(roomKicked);
  app.configure(kicked);
  app.configure(photos);
  app.configure(changePassword)
  app.configure(restorePassword);
  app.configure(recoveryCodes);
  app.configure(smileys);
  app.configure(notifications);
  app.configure(roomActions);
  app.configure(pushsub);
};
