define("mvc/workflow/workflow-terminals",["exports","libs/toastr"],function(t,e){"use strict";function n(t){this.collectionType=t,this.isCollection=!0,this.rank=t.split(":").length}Object.defineProperty(t,"__esModule",{value:!0});var i=function(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e.default=t,e}(e);window.workflow_globals=window.workflow_globals||{};var o={isCollection:!1,canMatch:function(){return!1},canMapOver:function(){return!1},toString:function(){return"NullCollectionType[]"},append:function(t){return t},equal:function(t){return t===this}},c={isCollection:!0,canMatch:function(t){return o!==t},canMapOver:function(){return!1},toString:function(){return"AnyCollectionType[]"},append:function(){return c},equal:function(t){return t===this}};$.extend(n.prototype,{append:function(t){return t===o?this:t===c?t:new n(this.collectionType+":"+t.collectionType)},canMatch:function(t){return t!==o&&(t===c||t.collectionType==this.collectionType)},canMapOver:function(t){if(t===o)return!1;if(t===c)return!1;if(this.rank<=t.rank)return!1;var e=t.collectionType;return this._endsWith(this.collectionType,e)},effectiveMapOver:function(t){var e=t.collectionType;return new n(this.collectionType.substring(0,this.collectionType.length-e.length-1))},equal:function(t){return t.collectionType==this.collectionType},toString:function(){return"CollectionType["+this.collectionType+"]"},_endsWith:function(t,e){return-1!==t.indexOf(e,t.length-e.length)}});var a=Backbone.Model.extend({initialize:function(t){this.mapOver=t.mapOver||o,this.terminal=t.terminal,this.terminal.terminalMapping=this},disableMapOver:function(){this.setMapOver(o)},setMapOver:function(t){this.mapOver=t,this.trigger("change")}}),r=Backbone.Model.extend({initialize:function(t){this.element=t.element,this.connectors=[]},connect:function(t){this.connectors.push(t),this.node&&this.node.markChanged()},disconnect:function(t){this.connectors.splice($.inArray(t,this.connectors),1),this.node&&(this.node.markChanged(),this.resetMappingIfNeeded())},redraw:function(){$.each(this.connectors,function(t,e){e.redraw()})},destroy:function(){$.each(this.connectors.slice(),function(t,e){e.destroy()})},destroyInvalidConnections:function(){_.each(this.connectors,function(t){t&&t.destroyIfInvalid()})},setMapOver:function(t){this.multiple||this.mapOver().equal(t)||(this.terminalMapping.setMapOver(t),_.each(this.node.output_terminals,function(e){e.setMapOver(t)}))},mapOver:function(){return this.terminalMapping?this.terminalMapping.mapOver:o},isMappedOver:function(){return this.terminalMapping&&this.terminalMapping.mapOver.isCollection},resetMapping:function(){this.terminalMapping.disableMapOver()},resetMappingIfNeeded:function(){}}),s=r.extend({initialize:function(t){r.prototype.initialize.call(this,t),this.datatypes=t.datatypes},resetMappingIfNeeded:function(){this.node.hasConnectedOutputTerminals()||this.node.hasConnectedMappedInputTerminals()||_.each(this.node.mappedInputTerminals(),function(t){t.resetMappingIfNeeded()}),!this.node.hasMappedOverInputTerminals()&&this.resetMapping()},resetMapping:function(){this.terminalMapping.disableMapOver(),_.each(this.connectors,function(t){var e=t.handle2;e&&(e.resetMappingIfNeeded(),t.destroyIfInvalid())})}}),l=r.extend({initialize:function(t){r.prototype.initialize.call(this,t),this.update(t.input)},canAccept:function(t){return!this._inputFilled()&&this.attachable(t)},resetMappingIfNeeded:function(){this.mapOver().isCollection&&(this.node.hasConnectedMappedInputTerminals()||!this.node.hasConnectedOutputTerminals())&&this.resetMapping()},resetMapping:function(){this.terminalMapping.disableMapOver(),this.node.hasMappedOverInputTerminals()||_.each(this.node.output_terminals,function(t){t.resetMapping()})},connected:function(){return 0!==this.connectors.length},_inputFilled:function(){return!!this.connected()&&(!this.multiple||!!this._collectionAttached())},_collectionAttached:function(){if(this.connected()){var t=this.connectors[0].handle1;return!!t&&!!(t.isCollection||t.isMappedOver()||t.datatypes.indexOf("input_collection")>0)}return!1},_mappingConstraints:function(){if(!this.node)return[];var t=this.mapOver();if(t.isCollection)return[t];var e=[];return this.node.hasConnectedOutputTerminals()?e.push(_.first(_.values(this.node.output_terminals)).mapOver()):_.each(this.node.connectedMappedInputTerminals(),function(t){e.push(t.mapOver())}),e},_producesAcceptableDatatype:function(t){for(var e in this.datatypes){var n=this.datatypes[e];if("input"==n)return!0;var i=[];if(i=i.concat(t.datatypes),t.node.post_job_actions)for(var o in t.node.post_job_actions){var c=t.node.post_job_actions[o];"ChangeDatatypeAction"!=c.action_type||""!==c.output_name&&c.output_name!=t.name||!c.action_arguments||i.push(c.action_arguments.newtype)}for(var a in i){var r=i[a];if("input"==r||"_sniff_"==r||"input_collection"==r||window.workflow_globals.app.isSubType(i[a],n))return!0}}return!1},_otherCollectionType:function(t){var e=o;t.isCollection&&(e=t.collectionType);var n=t.mapOver();return n.isCollection&&(e=n.append(e)),e}}),p=l.extend({update:function(t){this.datatypes=t.extensions,this.multiple=t.multiple,this.collection=!1},connect:function(t){l.prototype.connect.call(this,t);var e=t.handle1;if(e){var n=this._otherCollectionType(e);n.isCollection&&this.setMapOver(n)}},attachable:function(t){var e=this._otherCollectionType(t),n=this.mapOver();return e.isCollection?this.multiple?!(this.connected()&&!this._collectionAttached())&&(1==e.rank&&this._producesAcceptableDatatype(t)):n.isCollection&&n.canMatch(e)?this._producesAcceptableDatatype(t):!!this._mappingConstraints().every(_.bind(e.canMatch,e))&&this._producesAcceptableDatatype(t):!n.isCollection&&this._producesAcceptableDatatype(t)}}),u=l.extend({update:function(t){this.multiple=!1,this.collection=!0,this.datatypes=t.extensions;var e=[];t.collection_types?_.each(t.collection_types,function(t){e.push(new n(t))}):e.push(c),this.collectionTypes=e},connect:function(t){l.prototype.connect.call(this,t);var e=t.handle1;if(e){var n=this._effectiveMapOver(e);this.setMapOver(n)}},_effectiveMapOver:function(t){var e=this.collectionTypes,n=this._otherCollectionType(t);if(!_.some(e,function(t){return t.canMatch(n)}))for(var i in e){var c=e[i];if(n.canMapOver(c)){var a=n.effectiveMapOver(c);if(a!=o)return a}}return o},_effectiveCollectionTypes:function(){var t=this.mapOver();return _.map(this.collectionTypes,function(e){return t.append(e)})},attachable:function(t){var e=this._otherCollectionType(t);if(e.isCollection){var n=this._effectiveCollectionTypes(),i=this.mapOver();if(_.some(n,function(t){return t.canMatch(e)}))return this._producesAcceptableDatatype(t);if(i.isCollection)return!1;if(_.some(this.collectionTypes,function(t){return e.canMapOver(t)})){var o=this._effectiveMapOver(t);if(!o.isCollection)return!1;if(this._mappingConstraints().every(o.canMatch))return this._producesAcceptableDatatype(t)}}return!1}}),h=r.extend({initialize:function(t){r.prototype.initialize.call(this,t),this.datatypes=t.datatypes,t.collection_type?this.collectionType=new n(t.collection_type):(t.collection_type_source||console.log("Warning: No collection type or collection type source defined."),this.collectionType=c),this.isCollection=!0},update:function(t){var e;t.collection_type?e=new n(t.collection_type):(t.collection_type_source||console.log("Warning: No collection type or collection type source defined."),e=c),e.collectionType!=this.collectionType.collectionType&&_.each(this.connectors,function(t){i.warning("Destroying a connection because collection type has changed."),t.destroy()}),this.collectionType=e}});t.default={InputTerminal:p,OutputTerminal:s,InputCollectionTerminal:u,OutputCollectionTerminal:h,TerminalMapping:a,CollectionTypeDescription:n,NULL_COLLECTION_TYPE_DESCRIPTION:o,ANY_COLLECTION_TYPE_DESCRIPTION:c}});
//# sourceMappingURL=../../../maps/mvc/workflow/workflow-terminals.js.map