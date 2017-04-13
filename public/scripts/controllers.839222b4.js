!function(){"use strict";var a=["$scope","$rootScope","$compile",function(a,b,c){}];a.$inject=["$scope","$rootScope","$compile"],angular.module("monitoringDashboardApp").controller("MainCtrl",a)}(),function(){"use strict";var a=["$scope","$rootScope","$compile","$state","$stateParams",function(a,b,c,d,e){function f(a){d.go(a)}function g(){parseInt($(window).width())>752?h.collapsemenu=!h.collapsemenu:h.openmenu=!h.openmenu}var h=this;h.collapsemenu=!1,h.openmenu=!1,h.state=d,h.switchmenu=g,h.go=f,h.menulist=[{label:"Monitor",state:"Monitor",icon:"fa fa-television"},{label:"Control",state:"Control",icon:"fa-dot-circle-o"},{label:"Lamps Settings",state:"Lamps Settings",icon:"fa fa-gears"}];var i=$(window).height(),j=parseInt($("#header").css("height"));h.minheight=i-j}];a.$inject=["$scope","$rootScope","$compile","$state","$stateParams"],angular.module("monitoringDashboardApp").controller("NavbarCtrl",a)}(),function(){"use strict";var a=["$scope","$rootScope","$compile","NgMap","socket","dataFactory",function(a,b,c,d,e,f){function g(){j.update=!j.update,j.update&&setTimeout(i,j.updateInterval)}function h(){for(j.data.length>0&&(j.data=j.data.slice(1));j.data.length<j.totalPoints;){var a=j.data.length>0?j.data[j.data.length-1]:50,b=a+10*Math.random()-5;0>b?b=0:b>100&&(b=100),j.data.push(b)}for(var c=[],d=0;d<j.data.length;++d)c.push([d,j.data[d]]);return c}function i(){j.dataset[0].data=h(),a.$apply(),j.update&&setTimeout(i,j.updateInterval)}var j=this;e.forward("rank",a),j.rankData=f.getRankData(),j.possible="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",j.dates=["25-12-2017","25-12-2016","25-12-2015","25-12-2014"],j.streets=["Via dei Fori Imperiali","Via di San Giovanni in Laterano"],j.shift=0,j["switch"]=g,j.update=!0,a.$on("socket:rank",function(a,b){console.log(b.message),f.setRankData(JSON.parse(b.message)),j.rankData=f.getRankData(),console.log(j.rankData)}),a.$on("socket:error",function(a,b){console.log("ev","data")}),d.getMap().then(function(a){console.log("map",a),j.map=a}),j.clicked=function(){alert("Clicked a link inside infoWindow")},j.shops=[{id:"1",name:"Via dei Fori Imperiali",position:[41.8933281,12.4848003]},{id:"2",name:"Via di San Giovanni in Laterano",position:[41.8889431,12.4959199]}],j.shop=j.shops[0],j.showDetail=function(a,b){j.shop=b,j.map.showInfoWindow("foo-iw",b.id)},j.hideDetail=function(){j.map.hideInfoWindow("foo-iw")},j.dataset=[{data:[],yaxis:1}],j.totalPoints=100,j.updateInterval=500,j.currentPage=1,j.data=[],j.options={grid:{borderColor:"#f3f3f3",tickColor:"#f3f3f3",borderWidth:1},series:{shadowSize:0,color:"#eecc1b"},lines:{fill:!0,color:"#eecc1b"},yaxis:{min:0,max:100,show:!0},xaxis:{show:!0}},j.dataset[0].data=h(),j.update&&setTimeout(i,j.updateInterval)}];a.$inject=["$scope","$rootScope","$compile","NgMap","socket","dataFactory"],angular.module("monitoringDashboardApp").controller("MonitorCtrl",a)}(),function(){"use strict";var a=["$scope","$rootScope","$compile","socket",function(a,b,c,d){function e(a,b){f.shift=Math.floor(b*(a-1)),f.dataset=JSON.parse(JSON.stringify(f.data)),f.dataset=f.dataset.splice(f.shift,b),f.currentPage=a}var f=this;f.entries=[10,50,100,200],f.searchText="",f.clicked=!1,f.show=10,f.data=[],f.possible="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",f.dates=["25-12-2017","25-12-2016","25-12-2015","25-12-2014"],f.streets=["Via dei Fori Imperiali","Via di San Giovanni in Laterano"],f.pagingAction=e,f.shift=0,f.dataset=[],a.$watch(function(){return f.show},function(a){f.pagingAction(1,a)});for(var g=0;100>g;g++){var h={location:{gps_coordinate:{}}};h.id=g+1,h.model="",h.model+=f.possible.charAt(Math.floor(Math.random()*f.possible.length)),h.model+=f.possible.charAt(Math.floor(Math.random()*f.possible.length)),h.location.address=f.streets[g%2],h.location.gps_coordinate.latitude="10",h.location.gps_coordinate.longitude="10",h.power_consumption=(100*Math.random()).toFixed(2),h.light_intensity=(100*Math.random()).toFixed(2),h.state_on=0!==g&&50!==g&&100!==g,h.substitution_date=f.dates[g%4],f.data.push(h)}f.dataset=f.data.slice(0)}];a.$inject=["$scope","$rootScope","$compile","socketFactory"],angular.module("monitoringDashboardApp").controller("ControlCtrl",a)}(),function(){"use strict";var a=["$scope","$rootScope","$compile",function(a,b,c){function d(){return i.newLamp.id&&i.newLamp.model&&i.newLamp.location.gps_coordinate.latitude&&i.newLamp.location.gps_coordinate.longitude?!0:!1}function e(a){i.mode=a,a||(i.selected=null,i.newLamp={location:{gps_coordinate:{}}})}function f(a){i.clicked=!0,i.selected===a?i.selected=null:null===i.selected?i.selected=a:i.selected=a}function g(a,b){i.shift=Math.floor(b*(a-1)),i.dataset=JSON.parse(JSON.stringify(i.data)),i.dataset=i.dataset.splice(i.shift,b),i.currentPage=a}function h(a){return i.searchText&&""!==!i.searchText?-1!==a.id.toString().toLowerCase().indexOf(i.searchText.toLowerCase())?!0:-1!==a.location.address.toLowerCase().indexOf(i.searchText.toLowerCase())?!0:-1!==a.model.toLowerCase().indexOf(i.searchText.toLowerCase())?!0:!1:!0}var i=this;i.entries=[10,50,100,200],i.searchText="",i.clicked=!1,i.show=10,i.data=[],i.possible="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",i.dates=["25-12-2017","25-12-2016","25-12-2015","25-12-2014"],i.streets=["Via dei Fori Imperiali","Via di San Giovanni in Laterano"],i.pagingAction=g,i.searchFilter=h,i.selected=null,i.select=f,i.shift=0,i.switchMode=e,i.validateForm=d,i.newLamp={location:{gps_coordinate:{}}},a.$watch(function(){return i.show},function(a){i.pagingAction(1,a)});for(var j=0;100>j;j++){var k={location:{gps_coordinate:{}}};k.id=j+1,k.model="",k.model+=i.possible.charAt(Math.floor(Math.random()*i.possible.length)),k.model+=i.possible.charAt(Math.floor(Math.random()*i.possible.length)),k.location.address=i.streets[j%2],k.location.gps_coordinate.latitude="10",k.location.gps_coordinate.longitude="10",k.power_consumption=(100*Math.random()).toFixed(2),k.light_intensity=(100*Math.random()).toFixed(2),k.state_on=0!==j&&50!==j&&100!==j,k.substitution_date=i.dates[j%4],i.data.push(k)}i.dataset=i.data.slice(0)}];a.$inject=["$scope","$rootScope","$compile"],angular.module("monitoringDashboardApp").controller("LampSettingsCtrl",a)}();