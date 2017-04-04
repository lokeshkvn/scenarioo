var CURRENT_FEATURE = "currentFeature";

localStorage.setItem(CURRENT_FEATURE, undefined);


angular.module('scenarioo').service('FeatureService',
    function FeatureService () {
    var service = this;


        var date = new Date();
        var date2 = new Date().setFullYear(date.getFullYear(), date.getMonth()+3, date.getDay());


        var features22 = [
            {
                name: 'Maintain product Catalogue',
                storyOrderNumber: 1,
                releaseDate: date,
                status: 'failed',
                features: [
                    {
                        name: 'CRUD of Products',
                        storyOrderNumber: 1,
                        releaseDate: date,
                        status: 'failed'
                    },
                    {
                        name: 'Maintain Tag Hierarchy',
                        storyOrderNumber: 2,
                        releaseDate: date,
                        status: 'passed'
                    },
                ]
            },{
                name: 'Browse Products',
                storyOrderNumber: 2,
                releaseDate: date,
                status: 'failed',
                features: [
                    {
                        name: 'View Product Detail',
                        storyOrderNumber: 1,
                        releaseDate: date,
                        status: 'failed'
                    },
                    {
                        name: 'Navigate by Tags',
                        storyOrderNumber: 2,
                        releaseDate: date,
                        status: 'failed'
                    },
                    {
                        name: 'Feature Product',
                        storyOrderNumber: 3,
                        releaseDate: date,
                        status: 'passed'
                    },
                    {
                        name: 'Advertise Specials',
                        storyOrderNumber: 4,
                        releaseDate: date,
                        status: 'passed'
                    },
                    {
                        name: 'Search Sauce',
                        storyOrderNumber: 5,
                        releaseDate: date2,
                        status: 'failed'
                    },
                ]
            },{
                name: 'Shopping Card',
                storyOrderNumber: 3,
                releaseDate: date2,
                status: 'passed',
                features: [
                    {
                        name: 'Maintain Cart',
                        storyOrderNumber: 1,
                        releaseDate: date,
                        status: 'passed'
                    },
                    {
                        name: 'Store Cart',
                        storyOrderNumber: 2,
                        releaseDate: date2,
                        status: 'passed'
                    },
                ]
            },{
                name: 'Checkout & Pay',
                storyOrderNumber: 4,
                releaseDate: date,
                status: 'failed',
                features: [
                    {
                        name: 'Complete Order',
                        storyOrderNumber: 1,
                        releaseDate: date,
                        status: 'failed',
                        features: [
                            {
                                name: 'Register Customer',
                                storyOrderNumber: 1,
                                releaseDate: date,
                                status: 'passed'
                            },{
                                name: 'Recover PW',
                                storyOrderNumber: 2,
                                releaseDate: date,
                                status: 'failed'
                            },{
                                name: 'Delete Customer',
                                storyOrderNumber: 3,
                                releaseDate: date,
                                status: 'passed'
                            },
                            {
                                name: 'Blacklist Customer',
                                storyOrderNumber: 4,
                                releaseDate: date2,
                                status: 'failed',
                                features: [
                                    {
                                        name: 'Register Customer',
                                        storyOrderNumber: 1,
                                        releaseDate: date,
                                        status: 'passed'
                                    },{
                                        name: 'Recover PW',
                                        storyOrderNumber: 2,
                                        releaseDate: date,
                                        status: 'failed'
                                    },{
                                        name: 'Delete Customer',
                                        storyOrderNumber: 3,
                                        releaseDate: date,
                                        status: 'passed'
                                    },
                                    {
                                        name: 'Blacklist Customer',
                                        storyOrderNumber: 4,
                                        releaseDate: date2,
                                        status: 'failed'
                                    },
                                ]
                            },
                        ]
                    },{
                        name: 'Confirm by Email',
                        storyOrderNumber: 2,
                        releaseDate: date,
                        status: 'passed'
                    },{
                        name: 'Order by Email',
                        storyOrderNumber: 3,
                        releaseDate: date,
                        status: 'failed'
                    },
                    {
                        name: 'Validate with Credit Card',
                        storyOrderNumber: 4,
                        releaseDate: date2,
                        status: 'passed'
                    },
                ]
            },{
                name: 'Process Order',
                storyOrderNumber: 5,
                releaseDate: date2,
                status: 'passed'
            },{
                name: 'Stock and Delivery',
                storyOrderNumber: 6,
                releaseDate: date,
                status: 'failed'
            },{
                name: 'Register Customer',
                storyOrderNumber: 7,
                releaseDate: date2,
                status: 'failed',
                features: [
                    {
                        name: 'Register Customer',
                        storyOrderNumber: 1,
                        releaseDate: date,
                        status: 'passed'
                    },{
                        name: 'Recover PW',
                        storyOrderNumber: 2,
                        releaseDate: date,
                        status: 'failed'
                    },{
                        name: 'Delete Customer',
                        storyOrderNumber: 3,
                        releaseDate: date,
                        status: 'passed'
                    },
                    {
                        name: 'Blacklist Customer',
                        storyOrderNumber: 4,
                        releaseDate: date2,
                        status: 'failed'
                    },
                ]
            },{
                name: 'Gift Cards',
                storyOrderNumber: 8,
                releaseDate: date,
                status: 'passed'
            },
        ];



        var stdfeature = {
            name: 'Sauce Shop',
            storyOrderNumber: 1,
            releaseDate: date,
            status: 'failed',
            features: features22,
            markdown: [
                {
                    name: 'Documentation Sauce Shop',
                    file: 'https://raw.githubusercontent.com/scenarioo/scenarioo/develop/README.md'
                },
                {
                    name: 'Some Test',
                    file: 'https://raw.githubusercontent.com/showdownjs/showdown/master/README.md'
                }
            ]
        };

    service.getFeature = function getFeature(){
        var feature = localStorage.getItem(CURRENT_FEATURE);
        if (feature == 'undefined'){
            feature = stdfeature;
            service.setFeature(feature);
        } else {
            feature = JSON.parse(feature);
        }
        console.log(feature);
        return feature;
    };

    service.setFeature = function setFeature(feature) {
        localStorage.setItem(CURRENT_FEATURE, JSON.stringify(feature));
    };

    service.getRootFeature = function getRootFeature() {
      return stdfeature;
    };

    var currentFeature = localStorage.getItem(CURRENT_FEATURE);


});
