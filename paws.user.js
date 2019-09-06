// ==UserScript==
// @name         Paws
// @namespace    http://tombenner.co/
// @version      0.0.1
// @description  Keyboard shortcuts for the AWS Console
// @author       Tom Benner
// @match        https://*.console.aws.amazon.com/*
// @grant        none
// @require https://code.jquery.com/jquery-1.11.3.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/mousetrap/1.4.6/mousetrap.js
// @require https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore.js
// ==/UserScript==

$.noConflict();

var Paws = {};

Paws.App = (function () {
    var self = this;

    self.commandsCallbacks = {
        //Home
        'home': {href: '/console'},
        // Services
        'clt': {href: '/cloudtrail/home#/events'},
        'ec2': {href: '/ec2/v2/home#Instances:sort=desc:launchTime'},
        'ela': {href: '/elasticache/home#cache-clusters:'},
        'iam': {href: '/iam/home#home'},
        'r53': {href: '/route53/home#hosted-zones:'},
        'rds': {href: '/rds/home#dbinstances:'},
        'red': {href: '/redshift/home#cluster-list:'},
        'ss3': {href: '/s3/home'},
        'help': {href: '/support'},
        'vpc': {href: '/vpc/home'},
        'cop': {href: '/codesuite/codepipeline/home'},
        'cfn': {href: '/cloudformation/home'},
        'api': {href: '/apigateway/home'},
        'clw': {href: '/cloudwatch/home'},
        'lam': {href: '/lambda/home'},
        'iot': {href: '/iot/home'},
        'kin': {href: '/kinesis/home'},
        'ior': {href: '/iot/home#/rulehub'},
        'ggc': {href: '/iot/home#/greengrass/grouphub'},

        // Pages
        'img': {href: '/ec2/v2/home#Images:sort=name'},
        'vol': {href: '/ec2/v2/home#Volumes:sort=desc:createTime'},
        'elb': {href: '/ec2/v2/home#LoadBalancers:'},
        'scg': {href: '/ec2/v2/home#SecurityGroups:sort=groupId'},
        'return': {func: ['navbar', 'select']}, // This doesn't work on some services
        // Miscellaneous
        '/': {focus: '.awsui-input:first'},
        ';': {click: '.awsc-switched-role-username-wrapper'},
    };

    self.init = function () {
        self.initCommands();
        self.log('Initialized');
    };

    self.initCommands = function () {
        _.each(self.commandsCallbacks, function (value, key) {
            var command = key;
            command = command.split('').join(' ');
            var callback;
            if (value['href']) {
                callback = function () {
                    self.log('Redirecting to ' + value['href']);
                    window.location.href = value['href'];
                };
            } else if (value['open']) {
                callback = function () {
                    self.log('Opening ' + value['open']);
                    window.open(value['open']);
                };
            } else if (value['focus']) {
                callback = function () {
                    self.log('Selecting ' + value['focus']);
                    jQuery(value['focus']).focus();
                };
             } else if (value['click']) {
                callback = function () {
                    self.log('Selecting ' + value['click']);
                    jQuery(value['click']).click();
                };
            } else if (value['func']) {
                callback = function () {
                    self.log('Calling func');
                    var func = value['func'];
                    self[func[0]][func[1]]();
                };
            } else {
                self.log('Invalid callback');
            }
            Mousetrap.bind(command, function () {
                callback();
                return false;
            });
        });
    };

    self.log = function (message) {
        console.log('Paws: ' + message);
    };

    self.init();

    return self;
});

new Paws.App();
