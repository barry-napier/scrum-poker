'use strict';

angular.module('scrumPoker').service(

  'gameService',
  
  [
    '$scope',
    '$location',
    '$routeParams',

    function($scope, $location, $routeParams) {

      var game = {};
      game.users = [];
      game.voteRevealed = false;
      game.subjectIsSet = false;
      game.voteCount = null;
      game.roomName = null;

      var onVote = function(message) {

        game.addUpdateUser({
          name: message.name,
          socketId: message.socketId,
          vote: message.vote
        });

        game.calcVoteCount();
      };

      var onUserJoin = function(message) {

        game.addUpdateUser({
          name: message.name,
          socketId: message.socketId,
          vote: message.vote
        });

      };

      var onUpdatedVisibility = function(message) {

        game.voteRevealed = message.reveal;

      };

      var onVoteReset = function(message) {

        game.resetVotes();

      };

      var onRoomStatus = function(message) {

        angular.forEach(message.room.users, function(p) {

          game.addUpdateUser({
            name: p.name,
            vote: p.vote,
            socketId: p.socketId
          });
        });

        game.voteRevealed = message.room.displayVotes;

      };

      var onKick = function(user) {

        var location = 0;

        angular.forEach(game.users, function(u) {

          if (u.name === user.name) {
            game.users.splice(location, 1);
            return;
          }

          location++;

        });
      };

      var onKicked = function() {

        location.href = '/end';

      };

      var onMessaged = function(message) {

        if (message.payload !== null) {

          $.growl.notice({ title: (message.type === 'private' ? "Private " : "Room ") + "Message", message: message.from + ": " + message.payload });

        }

      };

      var onNudged = function() {

        $("body").effect("shake");

      };

      var onSubject = function(message) {

        if (message.payload !== null) {

          game.subjectIsSet = true;

          if (message.payload.indexOf("http") === 0) {

            var width = 800;
            var height = 600;
            var w_offset = 40;
            var h_offset = 60;

            $("#dialog").html($("<iframe width='" + (width - w_offset) + "' height='" + (height - h_offset) + "' />").attr("src", message.payload)).dialog({ width: width, height: height, modal: true });

          } else {

            $("#dialog").html(message.payload).dialog({ width: 300, height: 140, modal: true });

          }

        }

      };

      var onRemind = function() {

        $("#dialog").dialog();

      };

      //we either update or add a new user.
      game.addUpdateUser = function(user) {

        var exists = false;

        angular.forEach(game.users, function(u) {

          if (u.name === user.name) {

            u.vote = user.vote;
            u.socketId = user.socketId;
            exists = true;

          }
        });

        if (!exists) {

          game.users.push(user);

        }

      };

      game.join = function(roomName, path, user) {

        game.roomName = roomName;

        game.addUpdateUser(user);
        socket.publish({ eventType: events.USER_JOIN, name: user.name });

      };

      game.vote = function(card, user) {

        user.vote = card;
        socket.publish({ eventType: events.VOTE, vote: card, name: user.name, socketId: user.socketId });

      };

      game.updateVoteVisibility = function(voteVisible, sendNotification) {

        game.voteRevealed = voteVisible;


        if (!sendNotification) {

          return;

        }

        socket.publish({
          eventType: events.VOTE_VISIBILITY_TOGGLE,
          reveal: voteVisible
        });
      };

      game.resetVotes = function(sendNotification) {

        angular.forEach(game.users, function(p) {
          p.vote = null;
        });

        game.voteCount = null;
        game.subjectIsSet = null;
        game.updateVoteVisibility(false, false);

        if (sendNotification) {
          socket.publish({
            eventType: events.VOTE_RESET
          });
        }

      };

      game.kick = function(user) {
        socket.publish({
          eventType: events.USER_KICK,
          name: user.name,
          socketId: user.socketId
        });
      };

      game.message = function(user, from, payload) {
        socket.publish({
          eventType: events.USER_MESSAGE,
          from: from,
          payload: payload,
          socketId: user.socketId
        });
      };

      game.nudge = function(user) {
        socket.publish({
          eventType: events.USER_NUDGE,
          socketId: user.socketId
        });
      };

      game.subject = function(payload) {
        socket.publish({
          eventType: events.SUBJECT,
          payload: payload
        });
      };

      game.messageall = function(from, payload) {
        socket.publish({
          eventType: events.MESSAGEALL,
          from: from,
          payload: payload
        });
      };

      game.remind = function() {
        onRemind();
      };

      game.setupRoom = function(roomName) {

        game.roomName = roomName;
        game.users = [];
        game.voteRevealed = false;
        game.subjectIsSet = false;
        game.voteCount = null;

        //sets up the socket subscription.
        var options = {

          roomName: game.roomName,

          message: function(message) {

            switch (message.eventType) {

              case events.VOTE:
                onVote(message);
                break;

              case events.USER_JOIN:
                onUserJoin(message);
                break;

              case events.VOTE_VISIBILITY_TOGGLE:
                onUpdatedVisibility(message);
                break;

              case events.VOTE_RESET:
                onVoteReset(message);
                break;

              case events.ROOM_STATUS:
                onRoomStatus(message);
                break;

              case events.USER_KICK:
                onKick(message);
                break;

              case events.USER_KICKED:
                onKicked();
                break;

              case events.USER_MESSAGED:
                onMessaged(message);
                break;

              case events.USER_NUDGED:
                onNudged();
                break;

              case events.SUBJECT:
                onSubject(message);
                break;

            }

          }

        };

        socket.subscribe(options);

      };

      //calculate vote counts.
      game.calcVoteCount = function() {

        var vc = [];

        angular.forEach(game.users, function(u) {

          var vote = null;

          angular.forEach(vc, function(v) {

            if (v.vote === u.vote) {

              vote = v;

            }

          });

          if (vote !== null) {

            vote.count += 1;

          } else {

            vc.push({
              vote: u.vote,
              count: 1
            });

          }

        });

        game.voteCount = vc;

      };

      return game;

    }
  ]
);


