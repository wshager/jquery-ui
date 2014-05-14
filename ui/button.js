/*!
 * jQuery UI Button @VERSION
 * http://jqueryui.com
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/button/
 */
(function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define([
			"jquery",
			"./core",
			"./widget"
		], factory );
	} else {

		// Browser globals
		factory( jQuery );
	}
}(function( $ ) {

var baseClasses = "ui-button ui-widget ui-corner-all",
	typeClasses = "ui-button-icons-only ui-button-icon-only ui-button-text-icons" +
		" ui-button-text-only ui-icon-beginning ui-icon-end ui-icon-top ui-icon-bottom",
	formResetHandler = function() {
		var form = $( this );
		setTimeout(function() {
			form.find( ".ui-button" ).filter( ":ui-button" ).button( "refresh" );
		});
	};

$.widget( "ui.button", {
	version: "@VERSION",
	defaultElement: "<button>",
	options: {
		disabled: null,
		showLabel: true,
		label: null,
		icon: null,
		iconPosition: "beginning"
	},

	_getCreateOptions: function() {
		var options = {};

		this.isInput = this.element.is( "input" );
		this.originalLabel = this.isInput ? this.element.val() : this.element.html();

		this._isDisabled( options );

		if ( this.originalLabel ) {
			options.label = this.originalLabel;
		}

		return options;
	},

	_isDisabled: function( options ) {
		var isDisabled = this.element.prop( "disabled" );

		if ( isDisabled !== undefined ) {
			options.disabled = isDisabled;
		} else {
			options.disabled = false;
		}
	},

	_create: function() {
		var formElement = this.element.closest( "form" )
		this._off( formElement,  "reset" );
		this._on( formElement, {
			"reset": formResetHandler
		});

		// If the option is a boolean its been set by either user or by
		// _getCreateOptions so we need to make sure the prop matches
		// If it is not a boolean the user set it explicitly to null so we need to check the dom
		if ( typeof this.options.disabled === "boolean" ) {
			this.element.prop( "disabled", this.options.disabled );
		} else {
			this._isDisabled( this.options );
		}

		// If the option is true we call set options to add the disabled
		// classes and ensure the element is not focused
		if ( this.options.disabled === true ){
			this._setOption( "disabled", true );
		}

		this.element.addClass( baseClasses ).attr( "role", "button" );

		// Check to see if the label needs to be set or if its already correct
		if ( this.options.label && this.options.label !== this.originalLabel ) {
			if ( this.isInput ) {
				this.element.val( this.options.label );
			} else {
				this.element.html( this.options.label );
			}
		}

		if ( this.options.icon ) {
			this._updateIcon( this.options.icon );
		}

		if ( this.element.is( "a" ) ) {
			this._on({
				"keyup": function( event ) {
					if ( event.keyCode === $.ui.keyCode.SPACE ) {
						this.element[0].click();
					}
				}
			});
		}
	},

	_updateTooltip: function() {
		this.title = this.element.attr( "title" );
		this.hasTitle = !!this.title;

		if ( !this.options.showLabel && !this.hasTitle ){
			this.element.attr( "title", this.options.label );
		}
	},

	_updateIcon: function( icon ) {
		if ( this.icon === undefined ) {
			this.icon = $( "<span>" ).addClass( "ui-icon" );
			this.element.addClass(  "ui-icon-" + this.options.iconPosition );

			if ( !this.options.showLabel ){
				this.element.addClass( "ui-button-icon-only" );
			}
		} else {
			this.icon.removeClass( this.options.icon );
		}

		this.icon.addClass( icon );

		if ( this.icon !== undefined ) {
			this.element.append( this.icon );
			this._updateTooltip();
		}
	},

	_destroy: function() {
		this.element
			.removeClass( baseClasses +
				" ui-state-active " + typeClasses )
			.removeAttr( "role" );

		if ( !this.hasTitle ) {
			this.element.removeAttr( "title" );
		}
	},

	_setOption: function( key, value ) {
		if ( key === "icon" ) {
			if ( value !== null ) {
				this._updateIcon( value );
			} else {
				this.icon.remove();
				this.element.removeClass( "ui-icon-" + this.options.iconPosition );
			}
		}

		// Make sure we cant end up with a button that has no text or icon
		if ( key === "showLabel" && ( ( value !== false && !this.options.icon ) || value ) ) {
			this.element.toggleClass( "ui-button-icon-only", !value )
				.toggleClass( this.options.iconPosition, !!value );
			this._updateTooltip();
		} else if( key === "showLabel" ) {
			value = true;
		}
		if ( key === "iconPosition" && this.options.icon ) {
			this.element.addClass( value )
				.removeClass( this.options.iconPosition );
		}
		if ( key === "label" ) {
			if ( this.isInput ) {
				this.element.val( value );
			} else {
				this.element.html( ( ( !!this.icon ) ? "" : this.icon ) + value );
			}
		}
		this._super( key, value );
		if ( key === "disabled" ) {
			this.element.toggleClass( "ui-state-disabled", value );
			this.element.prop( "disabled", value ).blur();
		}
	},

	refresh: function() {
		//See #8237 & #8828
		var isDisabled = this.element.is( "input, button" ) ?
			this.element.is( ":disabled" ) : this.element.hasClass( "ui-button-disabled" );

		if ( isDisabled !== this.options.disabled ) {
			this._setOptions( { "disabled": isDisabled } );
		}

		this._updateTooltip();
	}

});

return $.ui.button;

}));
