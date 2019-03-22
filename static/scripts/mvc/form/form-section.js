define("mvc/form/form-section",["exports","utils/utils","mvc/ui/ui-misc","mvc/ui/ui-portlet","mvc/form/form-repeat","mvc/form/form-input","mvc/form/form-parameters"],function(e,t,a,i,n,s,d){"use strict";function l(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(e,"__esModule",{value:!0});var p=l(t),o=(l(a),l(i)),r=l(n),c=l(s),u=l(d),h=Backbone.View.extend({initialize:function(e,t){this.app=e,this.inputs=t.inputs,this.parameters=new u.default,this.setElement($("<div/>")),this.render()},render:function(){var e=this;this.$el.empty(),_.each(this.inputs,function(t){e.add(t)})},add:function(e){var t=jQuery.extend({},e);switch(t.id=p.default.uid(),this.app.input_list[t.id]=t,t.type){case"conditional":this._addConditional(t);break;case"repeat":this._addRepeat(t);break;case"section":this._addSection(t);break;default:this._addRow(t)}},_addConditional:function(e){var t=this;e.test_param.id=e.id,e.test_param.textable=!1,this.app.model.get("sustain_conditionals")&&(e.test_param.disabled=!0);var a=this._addRow(e.test_param);if(a.model){for(var i in e.cases){var n=new h(this.app,{inputs:e.cases[i].inputs});this._append(n.$el.addClass("ui-form-section"),e.id+"-section-"+i)}a.model.set("onchange",function(a){var i=t.app.data.matchCase(e,a);for(var n in e.cases){var s=e.cases[n],d=t.$("#"+e.id+"-section-"+n),l=!1;for(var p in s.inputs)if(!s.inputs[p].hidden){l=!0;break}n==i&&l?d.fadeIn("fast"):d.hide()}t.app.trigger("change")}),a.trigger("change")}},_addRepeat:function(e){function t(t){var s=e.id+"-section-"+i++,d=new h(a.app,{inputs:t});n.add({id:s,$el:d.$el,ondel:function(){n.del(s),a.app.trigger("change")}})}for(var a=this,i=0,n=new r.default.View({title:e.title||"Repeat",min:e.min,max:e.max,onnew:function(){t(e.inputs),a.app.trigger("change")}}),s=_.size(e.cache),d=0;d<Math.max(Math.max(s,e.min||0),e.default||0);d++)t(d<s?e.cache[d]:e.inputs);this.app.model.get("sustain_repeats")&&n.hideOptions();var l=new c.default(this.app,{label:e.title||e.name,help:e.help,field:n});this._append(l.$el,e.id)},_addSection:function(e){var t=new o.default.View({title:e.title||e.name,cls:"ui-portlet-section",collapsible:!0,collapsible_button:!0,collapsed:!e.expanded});t.append(new h(this.app,{inputs:e.inputs}).$el),t.append($("<div/>").addClass("ui-form-info").html(e.help)),this.app.on("expand",function(e){t.$("#"+e).length>0&&t.expand()}),this._append(t.$el,e.id)},_addRow:function(e){var t=this,a=e.id;e.onchange=e.onchange||function(){t.app.trigger("change",a)};var i=this.parameters.create(e);this.app.field_list[a]=i;var n=new c.default(this.app,{name:e.name,label:e.hide_label?"":e.label||e.name,value:e.value,text_value:e.text_value,collapsible_value:e.collapsible_value,collapsible_preview:e.collapsible_preview,help:e.help,argument:e.argument,disabled:e.disabled,color:e.color,style:e.style,backdrop:e.backdrop,hidden:e.hidden,fixed:e.fixed,field:i});return this.app.element_list[a]=n,this._append(n.$el,e.id),i},_append:function(e,t){this.$el.append(e.addClass("section-row").attr("id",t))}});e.default={View:h}});
//# sourceMappingURL=../../../maps/mvc/form/form-section.js.map