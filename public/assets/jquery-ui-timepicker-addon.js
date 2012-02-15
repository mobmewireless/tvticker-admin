/*
* jQuery timepicker addon
* By: Trent Richardson [http://trentrichardson.com]
* Version 0.9.8
* Last Modified: 12/03/2011
* 
* Copyright 2011 Trent Richardson
* Dual licensed under the MIT and GPL licenses.
* http://trentrichardson.com/Impromptu/GPL-LICENSE.txt
* http://trentrichardson.com/Impromptu/MIT-LICENSE.txt
* 
* HERES THE CSS:
* .ui-timepicker-div .ui-widget-header { margin-bottom: 8px; }
* .ui-timepicker-div dl { text-align: left; }
* .ui-timepicker-div dl dt { height: 25px; margin-bottom: -25px; }
* .ui-timepicker-div dl dd { margin: 0 10px 10px 65px; }
* .ui-timepicker-div td { font-size: 90%; }
* .ui-tpicker-grid-label { background: none; border: none; margin: 0; padding: 0; }
*/
(function($){function Timepicker(){this.regional=[],this.regional[""]={currentText:"Now",closeText:"Done",ampm:!1,amNames:["AM","A"],pmNames:["PM","P"],timeFormat:"hh:mm tt",timeSuffix:"",timeOnlyTitle:"Choose Time",timeText:"Time",hourText:"Hour",minuteText:"Minute",secondText:"Second",millisecText:"Millisecond",timezoneText:"Time Zone"},this._defaults={showButtonPanel:!0,timeOnly:!1,showHour:!0,showMinute:!0,showSecond:!1,showMillisec:!1,showTimezone:!1,showTime:!0,stepHour:1,stepMinute:1,stepSecond:1,stepMillisec:1,hour:0,minute:0,second:0,millisec:0,timezone:"+0000",hourMin:0,minuteMin:0,secondMin:0,millisecMin:0,hourMax:23,minuteMax:59,secondMax:59,millisecMax:999,minDateTime:null,maxDateTime:null,onSelect:null,hourGrid:0,minuteGrid:0,secondGrid:0,millisecGrid:0,alwaysSetTime:!0,separator:" ",altFieldTimeOnly:!0,showTimepicker:!0,timezoneIso8609:!1,timezoneList:null,addSliderAccess:!1,sliderAccessArgs:null},$.extend(this._defaults,this.regional[""])}function extendRemove(a,b){$.extend(a,b);for(var c in b)if(b[c]===null||b[c]===undefined)a[c]=b[c];return a}$.extend($.ui,{timepicker:{version:"0.9.8"}}),$.extend(Timepicker.prototype,{$input:null,$altInput:null,$timeObj:null,inst:null,hour_slider:null,minute_slider:null,second_slider:null,millisec_slider:null,timezone_select:null,hour:0,minute:0,second:0,millisec:0,timezone:"+0000",hourMinOriginal:null,minuteMinOriginal:null,secondMinOriginal:null,millisecMinOriginal:null,hourMaxOriginal:null,minuteMaxOriginal:null,secondMaxOriginal:null,millisecMaxOriginal:null,ampm:"",formattedDate:"",formattedTime:"",formattedDateTime:"",timezoneList:null,setDefaults:function(a){return extendRemove(this._defaults,a||{}),this},_newInst:function($input,o){var tp_inst=new Timepicker,inlineSettings={};for(var attrName in this._defaults){var attrValue=$input.attr("time:"+attrName);if(attrValue)try{inlineSettings[attrName]=eval(attrValue)}catch(err){inlineSettings[attrName]=attrValue}}tp_inst._defaults=$.extend({},this._defaults,inlineSettings,o,{beforeShow:function(a,b){$.isFunction(o.beforeShow)&&o.beforeShow(a,b,tp_inst)},onChangeMonthYear:function(a,b,c){tp_inst._updateDateTime(c),$.isFunction(o.onChangeMonthYear)&&o.onChangeMonthYear.call($input[0],a,b,c,tp_inst)},onClose:function(a,b){tp_inst.timeDefined===!0&&$input.val()!=""&&tp_inst._updateDateTime(b),$.isFunction(o.onClose)&&o.onClose.call($input[0],a,b,tp_inst)},timepicker:tp_inst}),tp_inst.amNames=$.map(tp_inst._defaults.amNames,function(a){return a.toUpperCase()}),tp_inst.pmNames=$.map(tp_inst._defaults.pmNames,function(a){return a.toUpperCase()});if(tp_inst._defaults.timezoneList===null){var timezoneList=[];for(var i=-11;i<=12;i++)timezoneList.push((i>=0?"+":"-")+("0"+Math.abs(i).toString()).slice(-2)+"00");tp_inst._defaults.timezoneIso8609&&(timezoneList=$.map(timezoneList,function(a){return a=="+0000"?"Z":a.substring(0,3)+":"+a.substring(3)})),tp_inst._defaults.timezoneList=timezoneList}tp_inst.hour=tp_inst._defaults.hour,tp_inst.minute=tp_inst._defaults.minute,tp_inst.second=tp_inst._defaults.second,tp_inst.millisec=tp_inst._defaults.millisec,tp_inst.ampm="",tp_inst.$input=$input,o.altField&&(tp_inst.$altInput=$(o.altField).css({cursor:"pointer"}).focus(function(){$input.trigger("focus")}));if(tp_inst._defaults.minDate==0||tp_inst._defaults.minDateTime==0)tp_inst._defaults.minDate=new Date;if(tp_inst._defaults.maxDate==0||tp_inst._defaults.maxDateTime==0)tp_inst._defaults.maxDate=new Date;return tp_inst._defaults.minDate!==undefined&&tp_inst._defaults.minDate instanceof Date&&(tp_inst._defaults.minDateTime=new Date(tp_inst._defaults.minDate.getTime())),tp_inst._defaults.minDateTime!==undefined&&tp_inst._defaults.minDateTime instanceof Date&&(tp_inst._defaults.minDate=new Date(tp_inst._defaults.minDateTime.getTime())),tp_inst._defaults.maxDate!==undefined&&tp_inst._defaults.maxDate instanceof Date&&(tp_inst._defaults.maxDateTime=new Date(tp_inst._defaults.maxDate.getTime())),tp_inst._defaults.maxDateTime!==undefined&&tp_inst._defaults.maxDateTime instanceof Date&&(tp_inst._defaults.maxDate=new Date(tp_inst._defaults.maxDateTime.getTime())),tp_inst},_addTimePicker:function(a){var b=this.$altInput&&this._defaults.altFieldTimeOnly?this.$input.val()+" "+this.$altInput.val():this.$input.val();this.timeDefined=this._parseTime(b),this._limitMinMaxDateTime(a,!1),this._injectTimePicker()},_parseTime:function(a,b){var c=this._defaults.timeFormat.toString().replace(/h{1,2}/ig,"(\\d?\\d)").replace(/m{1,2}/ig,"(\\d?\\d)").replace(/s{1,2}/ig,"(\\d?\\d)").replace(/l{1}/ig,"(\\d?\\d?\\d)").replace(/t{1,2}/ig,this._getPatternAmpm()).replace(/z{1}/ig,"(z|[-+]\\d\\d:?\\d\\d)?").replace(/\s/g,"\\s?")+this._defaults.timeSuffix+"$",d=this._getFormatPositions(),e="",f;this.inst||(this.inst=$.datepicker._getInst(this.$input[0]));if(b||!this._defaults.timeOnly){var g=$.datepicker._get(this.inst,"dateFormat"),h=new RegExp("[.*+?|()\\[\\]{}\\\\]","g");c=".{"+g.length+",}"+this._defaults.separator.replace(h,"\\$&")+c}f=a.match(new RegExp(c,"i"));if(f){d.t!==-1&&(f[d.t]===undefined||f[d.t].length===0?(e="",this.ampm=""):(e=$.inArray(f[d.t].toUpperCase(),this.amNames)!==-1?"AM":"PM",this.ampm=this._defaults[e=="AM"?"amNames":"pmNames"][0])),d.h!==-1&&(e=="AM"&&f[d.h]=="12"?this.hour=0:e=="PM"&&f[d.h]!="12"?this.hour=(parseFloat(f[d.h])+12).toFixed(0):this.hour=Number(f[d.h])),d.m!==-1&&(this.minute=Number(f[d.m])),d.s!==-1&&(this.second=Number(f[d.s])),d.l!==-1&&(this.millisec=Number(f[d.l]));if(d.z!==-1&&f[d.z]!==undefined){var i=f[d.z].toUpperCase();switch(i.length){case 1:i=this._defaults.timezoneIso8609?"Z":"+0000";break;case 5:this._defaults.timezoneIso8609&&(i=i.substring(1)=="0000"?"Z":i.substring(0,3)+":"+i.substring(3));break;case 6:this._defaults.timezoneIso8609?i.substring(1)=="00:00"&&(i="Z"):i=i=="Z"||i.substring(1)=="00:00"?"+0000":i.replace(/:/,"")}this.timezone=i}return!0}return!1},_getPatternAmpm:function(){var a=[];return o=this._defaults,o.amNames&&$.merge(a,o.amNames),o.pmNames&&$.merge(a,o.pmNames),a=$.map(a,function(a){return a.replace(/[.*+?|()\[\]{}\\]/g,"\\$&")}),"("+a.join("|")+")?"},_getFormatPositions:function(){var a=this._defaults.timeFormat.toLowerCase().match(/(h{1,2}|m{1,2}|s{1,2}|l{1}|t{1,2}|z)/g),b={h:-1,m:-1,s:-1,l:-1,t:-1,z:-1};if(a)for(var c=0;c<a.length;c++)b[a[c].toString().charAt(0)]==-1&&(b[a[c].toString().charAt(0)]=c+1);return b},_injectTimePicker:function(){var a=this.inst.dpDiv,b=this._defaults,c=this,d=parseInt(b.hourMax-(b.hourMax-b.hourMin)%b.stepHour,10),e=parseInt(b.minuteMax-(b.minuteMax-b.minuteMin)%b.stepMinute,10),f=parseInt(b.secondMax-(b.secondMax-b.secondMin)%b.stepSecond,10),g=parseInt(b.millisecMax-(b.millisecMax-b.millisecMin)%b.stepMillisec,10),h=this.inst.id.toString().replace(/([^A-Za-z0-9_])/g,"");if(a.find("div#ui-timepicker-div-"+h).length===0&&b.showTimepicker){var i=' style="display:none;"',j='<div class="ui-timepicker-div" id="ui-timepicker-div-'+h+'"><dl>'+'<dt class="ui_tpicker_time_label" id="ui_tpicker_time_label_'+h+'"'+(b.showTime?"":i)+">"+b.timeText+"</dt>"+'<dd class="ui_tpicker_time" id="ui_tpicker_time_'+h+'"'+(b.showTime?"":i)+"></dd>"+'<dt class="ui_tpicker_hour_label" id="ui_tpicker_hour_label_'+h+'"'+(b.showHour?"":i)+">"+b.hourText+"</dt>",k=0,l=0,m=0,n=0,o;j+='<dd class="ui_tpicker_hour"><div id="ui_tpicker_hour_'+h+'"'+(b.showHour?"":i)+"></div>";if(b.showHour&&b.hourGrid>0){j+='<div style="padding-left: 1px"><table class="ui-tpicker-grid-label"><tr>';for(var p=b.hourMin;p<=d;p+=parseInt(b.hourGrid,10)){k++;var q=b.ampm&&p>12?p-12:p;q<10&&(q="0"+q),b.ampm&&(p==0?q="12a":p<12?q+="a":q+="p"),j+="<td>"+q+"</td>"}j+="</tr></table></div>"}j+="</dd>",j+='<dt class="ui_tpicker_minute_label" id="ui_tpicker_minute_label_'+h+'"'+(b.showMinute?"":i)+">"+b.minuteText+"</dt>"+'<dd class="ui_tpicker_minute"><div id="ui_tpicker_minute_'+h+'"'+(b.showMinute?"":i)+"></div>";if(b.showMinute&&b.minuteGrid>0){j+='<div style="padding-left: 1px"><table class="ui-tpicker-grid-label"><tr>';for(var r=b.minuteMin;r<=e;r+=parseInt(b.minuteGrid,10))l++,j+="<td>"+(r<10?"0":"")+r+"</td>";j+="</tr></table></div>"}j+="</dd>",j+='<dt class="ui_tpicker_second_label" id="ui_tpicker_second_label_'+h+'"'+(b.showSecond?"":i)+">"+b.secondText+"</dt>"+'<dd class="ui_tpicker_second"><div id="ui_tpicker_second_'+h+'"'+(b.showSecond?"":i)+"></div>";if(b.showSecond&&b.secondGrid>0){j+='<div style="padding-left: 1px"><table><tr>';for(var s=b.secondMin;s<=f;s+=parseInt(b.secondGrid,10))m++,j+="<td>"+(s<10?"0":"")+s+"</td>";j+="</tr></table></div>"}j+="</dd>",j+='<dt class="ui_tpicker_millisec_label" id="ui_tpicker_millisec_label_'+h+'"'+(b.showMillisec?"":i)+">"+b.millisecText+"</dt>"+'<dd class="ui_tpicker_millisec"><div id="ui_tpicker_millisec_'+h+'"'+(b.showMillisec?"":i)+"></div>";if(b.showMillisec&&b.millisecGrid>0){j+='<div style="padding-left: 1px"><table><tr>';for(var t=b.millisecMin;t<=g;t+=parseInt(b.millisecGrid,10))n++,j+="<td>"+(t<10?"0":"")+t+"</td>";j+="</tr></table></div>"}j+="</dd>",j+='<dt class="ui_tpicker_timezone_label" id="ui_tpicker_timezone_label_'+h+'"'+(b.showTimezone?"":i)+">"+b.timezoneText+"</dt>",j+='<dd class="ui_tpicker_timezone" id="ui_tpicker_timezone_'+h+'"'+(b.showTimezone?"":i)+"></dd>",j+="</dl></div>",$tp=$(j),b.timeOnly===!0&&($tp.prepend('<div class="ui-widget-header ui-helper-clearfix ui-corner-all"><div class="ui-datepicker-title">'+b.timeOnlyTitle+"</div>"+"</div>"),a.find(".ui-datepicker-header, .ui-datepicker-calendar").hide()),this.hour_slider=$tp.find("#ui_tpicker_hour_"+h).slider({orientation:"horizontal",value:this.hour,min:b.hourMin,max:d,step:b.stepHour,slide:function(a,b){c.hour_slider.slider("option","value",b.value),c._onTimeChange()}}),this.minute_slider=$tp.find("#ui_tpicker_minute_"+h).slider({orientation:"horizontal",value:this.minute,min:b.minuteMin,max:e,step:b.stepMinute,slide:function(a,b){c.minute_slider.slider("option","value",b.value),c._onTimeChange()}}),this.second_slider=$tp.find("#ui_tpicker_second_"+h).slider({orientation:"horizontal",value:this.second,min:b.secondMin,max:f,step:b.stepSecond,slide:function(a,b){c.second_slider.slider("option","value",b.value),c._onTimeChange()}}),this.millisec_slider=$tp.find("#ui_tpicker_millisec_"+h).slider({orientation:"horizontal",value:this.millisec,min:b.millisecMin,max:g,step:b.stepMillisec,slide:function(a,b){c.millisec_slider.slider("option","value",b.value),c._onTimeChange()}}),this.timezone_select=$tp.find("#ui_tpicker_timezone_"+h).append("<select></select>").find("select"),$.fn.append.apply(this.timezone_select,$.map(b.timezoneList,function(a,b){return $("<option />").val(typeof a=="object"?a.value:a).text(typeof a=="object"?a.label:a)})),this.timezone_select.val(typeof this.timezone!="undefined"&&this.timezone!=null&&this.timezone!=""?this.timezone:b.timezone),this.timezone_select.change(function(){c._onTimeChange()}),b.showHour&&b.hourGrid>0&&(o=100*k*b.hourGrid/(d-b.hourMin),$tp.find(".ui_tpicker_hour table").css({width:o+"%",marginLeft:o/(-2*k)+"%",borderCollapse:"collapse"}).find("td").each(function(a){$(this).click(function(){var a=$(this).html();if(b.ampm){var d=a.substring(2).toLowerCase(),e=parseInt(a.substring(0,2),10);d=="a"?e==12?a=0:a=e:e==12?a=12:a=e+12}c.hour_slider.slider("option","value",a),c._onTimeChange(),c._onSelectHandler()}).css({cursor:"pointer",width:100/k+"%",textAlign:"center",overflow:"hidden"})})),b.showMinute&&b.minuteGrid>0&&(o=100*l*b.minuteGrid/(e-b.minuteMin),$tp.find(".ui_tpicker_minute table").css({width:o+"%",marginLeft:o/(-2*l)+"%",borderCollapse:"collapse"}).find("td").each(function(a){$(this).click(function(){c.minute_slider.slider("option","value",$(this).html()),c._onTimeChange(),c._onSelectHandler()}).css({cursor:"pointer",width:100/l+"%",textAlign:"center",overflow:"hidden"})})),b.showSecond&&b.secondGrid>0&&$tp.find(".ui_tpicker_second table").css({width:o+"%",marginLeft:o/(-2*m)+"%",borderCollapse:"collapse"}).find("td").each(function(a){$(this).click(function(){c.second_slider.slider("option","value",$(this).html()),c._onTimeChange(),c._onSelectHandler()}).css({cursor:"pointer",width:100/m+"%",textAlign:"center",overflow:"hidden"})}),b.showMillisec&&b.millisecGrid>0&&$tp.find(".ui_tpicker_millisec table").css({width:o+"%",marginLeft:o/(-2*n)+"%",borderCollapse:"collapse"}).find("td").each(function(a){$(this).click(function(){c.millisec_slider.slider("option","value",$(this).html()),c._onTimeChange(),c._onSelectHandler()}).css({cursor:"pointer",width:100/n+"%",textAlign:"center",overflow:"hidden"})});var u=a.find(".ui-datepicker-buttonpane");u.length?u.before($tp):a.append($tp),this.$timeObj=$tp.find("#ui_tpicker_time_"+h);if(this.inst!==null){var v=this.timeDefined;this._onTimeChange(),this.timeDefined=v}var w=function(){c._onSelectHandler()};this.hour_slider.bind("slidestop",w),this.minute_slider.bind("slidestop",w),this.second_slider.bind("slidestop",w),this.millisec_slider.bind("slidestop",w);if(this._defaults.addSliderAccess){var x=this._defaults.sliderAccessArgs;setTimeout(function(){if($tp.find(".ui-slider-access").length==0){$tp.find(".ui-slider:visible").sliderAccess(x);var a=$tp.find(".ui-slider-access:eq(0)").outerWidth(!0);a&&$tp.find("table:visible").each(function(){var b=$(this),c=b.outerWidth(),d=b.css("marginLeft").toString().replace("%",""),e=c-a,f=d*e/c+"%";b.css({width:e,marginLeft:f})})}},0)}}},_limitMinMaxDateTime:function(a,b){var c=this._defaults,d=new Date(a.selectedYear,a.selectedMonth,a.selectedDay);if(!this._defaults.showTimepicker)return;if($.datepicker._get(a,"minDateTime")!==null&&$.datepicker._get(a,"minDateTime")!==undefined&&d){var e=$.datepicker._get(a,"minDateTime"),f=new Date(e.getFullYear(),e.getMonth(),e.getDate(),0,0,0,0);if(this.hourMinOriginal===null||this.minuteMinOriginal===null||this.secondMinOriginal===null||this.millisecMinOriginal===null)this.hourMinOriginal=c.hourMin,this.minuteMinOriginal=c.minuteMin,this.secondMinOriginal=c.secondMin,this.millisecMinOriginal=c.millisecMin;a.settings.timeOnly||f.getTime()==d.getTime()?(this._defaults.hourMin=e.getHours(),this.hour<=this._defaults.hourMin?(this.hour=this._defaults.hourMin,this._defaults.minuteMin=e.getMinutes(),this.minute<=this._defaults.minuteMin?(this.minute=this._defaults.minuteMin,this._defaults.secondMin=e.getSeconds()):this.second<=this._defaults.secondMin?(this.second=this._defaults.secondMin,this._defaults.millisecMin=e.getMilliseconds()):(this.millisec<this._defaults.millisecMin&&(this.millisec=this._defaults.millisecMin),this._defaults.millisecMin=this.millisecMinOriginal)):(this._defaults.minuteMin=this.minuteMinOriginal,this._defaults.secondMin=this.secondMinOriginal,this._defaults.millisecMin=this.millisecMinOriginal)):(this._defaults.hourMin=this.hourMinOriginal,this._defaults.minuteMin=this.minuteMinOriginal,this._defaults.secondMin=this.secondMinOriginal,this._defaults.millisecMin=this.millisecMinOriginal)}if($.datepicker._get(a,"maxDateTime")!==null&&$.datepicker._get(a,"maxDateTime")!==undefined&&d){var g=$.datepicker._get(a,"maxDateTime"),h=new Date(g.getFullYear(),g.getMonth(),g.getDate(),0,0,0,0);if(this.hourMaxOriginal===null||this.minuteMaxOriginal===null||this.secondMaxOriginal===null)this.hourMaxOriginal=c.hourMax,this.minuteMaxOriginal=c.minuteMax,this.secondMaxOriginal=c.secondMax,this.millisecMaxOriginal=c.millisecMax;a.settings.timeOnly||h.getTime()==d.getTime()?(this._defaults.hourMax=g.getHours(),this.hour>=this._defaults.hourMax?(this.hour=this._defaults.hourMax,this._defaults.minuteMax=g.getMinutes(),this.minute>=this._defaults.minuteMax?(this.minute=this._defaults.minuteMax,this._defaults.secondMax=g.getSeconds()):this.second>=this._defaults.secondMax?(this.second=this._defaults.secondMax,this._defaults.millisecMax=g.getMilliseconds()):(this.millisec>this._defaults.millisecMax&&(this.millisec=this._defaults.millisecMax),this._defaults.millisecMax=this.millisecMaxOriginal)):(this._defaults.minuteMax=this.minuteMaxOriginal,this._defaults.secondMax=this.secondMaxOriginal,this._defaults.millisecMax=this.millisecMaxOriginal)):(this._defaults.hourMax=this.hourMaxOriginal,this._defaults.minuteMax=this.minuteMaxOriginal,this._defaults.secondMax=this.secondMaxOriginal,this._defaults.millisecMax=this.millisecMaxOriginal)}if(b!==undefined&&b===!0){var i=parseInt(this._defaults.hourMax-(this._defaults.hourMax-this._defaults.hourMin)%this._defaults.stepHour,10),j=parseInt(this._defaults.minuteMax-(this._defaults.minuteMax-this._defaults.minuteMin)%this._defaults.stepMinute,10),k=parseInt(this._defaults.secondMax-(this._defaults.secondMax-this._defaults.secondMin)%this._defaults.stepSecond,10),l=parseInt(this._defaults.millisecMax-(this._defaults.millisecMax-this._defaults.millisecMin)%this._defaults.stepMillisec,10);this.hour_slider&&this.hour_slider.slider("option",{min:this._defaults.hourMin,max:i}).slider("value",this.hour),this.minute_slider&&this.minute_slider.slider("option",{min:this._defaults.minuteMin,max:j}).slider("value",this.minute),this.second_slider&&this.second_slider.slider("option",{min:this._defaults.secondMin,max:k}).slider("value",this.second),this.millisec_slider&&this.millisec_slider.slider("option",{min:this._defaults.millisecMin,max:l}).slider("value",this.millisec)}},_onTimeChange:function(){var a=this.hour_slider?this.hour_slider.slider("value"):!1,b=this.minute_slider?this.minute_slider.slider("value"):!1,c=this.second_slider?this.second_slider.slider("value"):!1,d=this.millisec_slider?this.millisec_slider.slider("value"):!1,e=this.timezone_select?this.timezone_select.val():!1,f=this._defaults;typeof a=="object"&&(a=!1),typeof b=="object"&&(b=!1),typeof c=="object"&&(c=!1),typeof d=="object"&&(d=!1),typeof e=="object"&&(e=!1),a!==!1&&(a=parseInt(a,10)),b!==!1&&(b=parseInt(b,10)),c!==!1&&(c=parseInt(c,10)),d!==!1&&(d=parseInt(d,10));var g=f[a<12?"amNames":"pmNames"][0],h=a!=this.hour||b!=this.minute||c!=this.second||d!=this.millisec||this.ampm.length>0&&a<12!=($.inArray(this.ampm.toUpperCase(),this.amNames)!==-1)||e!=this.timezone;h&&(a!==!1&&(this.hour=a),b!==!1&&(this.minute=b),c!==!1&&(this.second=c),d!==!1&&(this.millisec=d),e!==!1&&(this.timezone=e),this.inst||(this.inst=$.datepicker._getInst(this.$input[0])),this._limitMinMaxDateTime(this.inst,!0)),f.ampm&&(this.ampm=g),this._formatTime(),this.$timeObj&&this.$timeObj.text(this.formattedTime+f.timeSuffix),this.timeDefined=!0,h&&this._updateDateTime()},_onSelectHandler:function(){var a=this._defaults.onSelect,b=this.$input?this.$input[0]:null;a&&b&&a.apply(b,[this.formattedDateTime,this])},_formatTime:function(a,b,c){c==undefined&&(c=this._defaults.ampm),a=a||{hour:this.hour,minute:this.minute,second:this.second,millisec:this.millisec,ampm:this.ampm,timezone:this.timezone};var d=(b||this._defaults.timeFormat).toString(),e=parseInt(a.hour,10);c&&(!$.inArray(a.ampm.toUpperCase(),this.amNames)!==-1&&(e%=12),e===0&&(e=12)),d=d.replace(/(?:hh?|mm?|ss?|[tT]{1,2}|[lz])/g,function(b){switch(b.toLowerCase()){case"hh":return("0"+e).slice(-2);case"h":return e;case"mm":return("0"+a.minute).slice(-2);case"m":return a.minute;case"ss":return("0"+a.second).slice(-2);case"s":return a.second;case"l":return("00"+a.millisec).slice(-3);case"z":return a.timezone;case"t":case"tt":if(c){var d=a.ampm;return b.length==1&&(d=d.charAt(0)),b.charAt(0)=="T"?d.toUpperCase():d.toLowerCase()}return""}});if(arguments.length)return d;this.formattedTime=d},_updateDateTime:function(a){a=this.inst||a;var b=$.datepicker._daylightSavingAdjust(new Date(a.selectedYear,a.selectedMonth,a.selectedDay)),c=$.datepicker._get(a,"dateFormat"),d=$.datepicker._getFormatConfig(a),e=b!==null&&this.timeDefined;this.formattedDate=$.datepicker.formatDate(c,b===null?new Date:b,d);var f=this.formattedDate;if(a.lastVal!==undefined&&a.lastVal.length>0&&this.$input.val().length===0)return;this._defaults.timeOnly===!0?f=this.formattedTime:this._defaults.timeOnly!==!0&&(this._defaults.alwaysSetTime||e)&&(f+=this._defaults.separator+this.formattedTime+this._defaults.timeSuffix),this.formattedDateTime=f,this._defaults.showTimepicker?this.$altInput&&this._defaults.altFieldTimeOnly===!0?(this.$altInput.val(this.formattedTime),this.$input.val(this.formattedDate)):this.$altInput?(this.$altInput.val(f),this.$input.val(f)):this.$input.val(f):this.$input.val(this.formattedDate),this.$input.trigger("change")}}),$.fn.extend({timepicker:function(a){a=a||{};var b=arguments;return typeof a=="object"&&(b[0]=$.extend(a,{timeOnly:!0})),$(this).each(function(){$.fn.datetimepicker.apply($(this),b)})},datetimepicker:function(a){a=a||{};var b=this,c=arguments;return typeof a=="string"?a=="getDate"?$.fn.datepicker.apply($(this[0]),c):this.each(function(){var a=$(this);a.datepicker.apply(a,c)}):this.each(function(){var b=$(this);b.datepicker($.timepicker._newInst(b,a)._defaults)})}}),$.datepicker._base_selectDate=$.datepicker._selectDate,$.datepicker._selectDate=function(a,b){var c=this._getInst($(a)[0]),d=this._get(c,"timepicker");d?(d._limitMinMaxDateTime(c,!0),c.inline=c.stay_open=!0,this._base_selectDate(a,b),c.inline=c.stay_open=!1,this._notifyChange(c),this._updateDatepicker(c)):this._base_selectDate(a,b)},$.datepicker._base_updateDatepicker=$.datepicker._updateDatepicker,$.datepicker._updateDatepicker=function(a){var b=a.input[0];if($.datepicker._curInst&&$.datepicker._curInst!=a&&$.datepicker._datepickerShowing&&$.datepicker._lastInput!=b)return;if(typeof a.stay_open!="boolean"||a.stay_open===!1){this._base_updateDatepicker(a);var c=this._get(a,"timepicker");c&&c._addTimePicker(a)}},$.datepicker._base_doKeyPress=$.datepicker._doKeyPress,$.datepicker._doKeyPress=function(a){var b=$.datepicker._getInst(a.target),c=$.datepicker._get(b,"timepicker");if(c&&$.datepicker._get(b,"constrainInput")){var d=c._defaults.ampm,e=$.datepicker._possibleChars($.datepicker._get(b,"dateFormat")),f=c._defaults.timeFormat.toString().replace(/[hms]/g,"").replace(/TT/g,d?"APM":"").replace(/Tt/g,d?"AaPpMm":"").replace(/tT/g,d?"AaPpMm":"").replace(/T/g,d?"AP":"").replace(/tt/g,d?"apm":"").replace(/t/g,d?"ap":"")+" "+c._defaults.separator+c._defaults.timeSuffix+(c._defaults.showTimezone?c._defaults.timezoneList.join(""):"")+c._defaults.amNames.join("")+c._defaults.pmNames.join("")+e,g=String.fromCharCode(a.charCode===undefined?a.keyCode:a.charCode);return a.ctrlKey||g<" "||!e||f.indexOf(g)>-1}return $.datepicker._base_doKeyPress(a)},$.datepicker._base_doKeyUp=$.datepicker._doKeyUp,$.datepicker._doKeyUp=function(a){var b=$.datepicker._getInst(a.target),c=$.datepicker._get(b,"timepicker");if(c&&c._defaults.timeOnly&&b.input.val()!=b.lastVal)try{$.datepicker._updateDatepicker(b)}catch(d){$.datepicker.log(d)}return $.datepicker._base_doKeyUp(a)},$.datepicker._base_gotoToday=$.datepicker._gotoToday,$.datepicker._gotoToday=function(a){var b=this._getInst($(a)[0]),c=b.dpDiv;this._base_gotoToday(a);var d=new Date,e=this._get(b,"timepicker");if(e._defaults.showTimezone&&e.timezone_select){var f=d.getTimezoneOffset(),g=f>0?"-":"+";f=Math.abs(f);var h=f%60;f=g+("0"+(f-h)/60).slice(-2)+("0"+h).slice(-2),e._defaults.timezoneIso8609&&(f=f.substring(0,3)+":"+f.substring(3)),e.timezone_select.val(f)}this._setTime(b,d),$(".ui-datepicker-today",c).click()},$.datepicker._disableTimepickerDatepicker=function(a,b,c){var d=this._getInst(a),e=this._get(d,"timepicker");$(a).datepicker("getDate"),e&&(e._defaults.showTimepicker=!1,e._updateDateTime(d))},$.datepicker._enableTimepickerDatepicker=function(a,b,c){var d=this._getInst(a),e=this._get(d,"timepicker");$(a).datepicker("getDate"),e&&(e._defaults.showTimepicker=!0,e._addTimePicker(d),e._updateDateTime(d))},$.datepicker._setTime=function(a,b){var c=this._get(a,"timepicker");if(c){var d=c._defaults,e=b?b.getHours():d.hour,f=b?b.getMinutes():d.minute,g=b?b.getSeconds():d.second,h=b?b.getMilliseconds():d.millisec;if(e<d.hourMin||e>d.hourMax||f<d.minuteMin||f>d.minuteMax||g<d.secondMin||g>d.secondMax||h<d.millisecMin||h>d.millisecMax)e=d.hourMin,f=d.minuteMin,g=d.secondMin,h=d.millisecMin;c.hour=e,c.minute=f,c.second=g,c.millisec=h,c.hour_slider&&c.hour_slider.slider("value",e),c.minute_slider&&c.minute_slider.slider("value",f),c.second_slider&&c.second_slider.slider("value",g),c.millisec_slider&&c.millisec_slider.slider("value",h),c._onTimeChange(),c._updateDateTime(a)}},$.datepicker._setTimeDatepicker=function(a,b,c){var d=this._getInst(a),e=this._get(d,"timepicker");if(e){this._setDateFromField(d);var f;b&&(typeof b=="string"?(e._parseTime(b,c),f=new Date,f.setHours(e.hour,e.minute,e.second,e.millisec)):f=new Date(b.getTime()),f.toString()=="Invalid Date"&&(f=undefined),this._setTime(d,f))}},$.datepicker._base_setDateDatepicker=$.datepicker._setDateDatepicker,$.datepicker._setDateDatepicker=function(a,b){var c=this._getInst(a),d=b instanceof Date?new Date(b.getTime()):b;this._updateDatepicker(c),this._base_setDateDatepicker.apply(this,arguments),this._setTimeDatepicker(a,d,!0)},$.datepicker._base_getDateDatepicker=$.datepicker._getDateDatepicker,$.datepicker._getDateDatepicker=function(a,b){var c=this._getInst(a),d=this._get(c,"timepicker");if(d){this._setDateFromField(c,b);var e=this._getDate(c);return e&&d._parseTime($(a).val(),d.timeOnly)&&e.setHours(d.hour,d.minute,d.second,d.millisec),e}return this._base_getDateDatepicker(a,b)},$.datepicker._base_parseDate=$.datepicker.parseDate,$.datepicker.parseDate=function(a,b,c){var d;try{d=this._base_parseDate(a,b,c)}catch(e){d=this._base_parseDate(a,b.substring(0,b.length-(e.length-e.indexOf(":")-2)),c)}return d},$.datepicker._base_formatDate=$.datepicker._formatDate,$.datepicker._formatDate=function(a,b,c,d){var e=this._get(a,"timepicker");if(e){if(b)var f=this._base_formatDate(a,b,c,d);return e._updateDateTime(a),e.$input.val()}return this._base_formatDate(a)},$.datepicker._base_optionDatepicker=$.datepicker._optionDatepicker,$.datepicker._optionDatepicker=function(a,b,c){var d=this._getInst(a),e=this._get(d,"timepicker");if(e){var f,g,h;typeof b=="string"?b==="minDate"||b==="minDateTime"?f=c:b==="maxDate"||b==="maxDateTime"?g=c:b==="onSelect"&&(h=c):typeof b=="object"&&(b.minDate?f=b.minDate:b.minDateTime?f=b.minDateTime:b.maxDate?g=b.maxDate:b.maxDateTime&&(g=b.maxDateTime)),f?(f==0?f=new Date:f=new Date(f),e._defaults.minDate=f,e._defaults.minDateTime=f):g?(g==0?g=new Date:g=new Date(g),e._defaults.maxDate=g,e._defaults.maxDateTime=g):h&&(e._defaults.onSelect=h)}return c===undefined?this._base_optionDatepicker(a,b):this._base_optionDatepicker(a,b,c)},$.timepicker=new Timepicker,$.timepicker.version="0.9.8"})(jQuery)