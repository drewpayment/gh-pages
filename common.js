/* ========================================================================
 * FD:   FD
 * Child:       --
 * Version:     1.0
 * ======================================================================== 
 * Description:
 * all common methods are here [put in root]
 * ======================================================================== 
 * 12/01/2015: creation
 * 3/4/16   :   added comma, nocomma
 * 3/5/16   :   added tabindex
*/

/**
 * @page common Main Function
 * 
 * 
 * CommonJS page
 *
 * @body
 *
 * ## How to contribute to DocumentJS
 */
FD = (function ($, me) {
    'use strict';


    var PARENT = '[data-parent="true"]';
    
    /**
    * Callback prefix preset values.
    * 
    * @type {(string|Array.)}
    */
    var CALLBACKPREFIX = {
        NONE: 0,
        DEFAULT: 1,
        SUBPAGE: 2,
        PROJECTEDIT: 3,
        FILTEREDIT: 4
    };


    //  set callback by prefix
    function setCallBackByPrefix(prefix) {
        switch (prefix) {
            case CALLBACKPREFIX.DEFAULT:
                return 'PAGE.getAfterControlEvent';
                break;
            case CALLBACKPREFIX.SUBPAGE:
                return 'PAGE.SUBPAGE.getAfterControlEvent';
                break;
            case CALLBACKPREFIX.PROJECTEDIT:
                return 'PAGE.PROJECTITEMPLUGIN.getAfterControlEvent';
                break;
            case CALLBACKPREFIX.FILTEREDIT:
                return 'PAGE.PROJECTFILTERPLUGIN.getAfterControlEvent';
                break;
            default:
                return 'PAGE.getAfterControlEvent';
                break;
        }
    }










    /* ========================================================================
     *  init
     * ========================================================================
    */
    function init() {

        //  set the page dimensions [ get the top starting point ]
        setPageDimension();


        //  set side navigation
        me.SITE.setSideNavControl();


        //  set scroll container
        me.CONTROL.setScroll(null);


        //  set top popovers
        me.SITE.setTopPopovers();


        //  set top control element
        //me.SITE.setTopControlElement();       // this fires from container


        //  set top control container
        me.SITE.setTopControlContainer();


        //  set table horizontal scroll
        setTableHorizontalScroll();


        //  set site search control
        me.SITE.setSiteSearchControl();
        me.SITE.setSearchOnload();


        //  default site view [ comfort, cozy ...]
        me.SITE.setDefaultSiteView();


        //  set disable empty A tags
        me.setDisableEmptyATag();


        //  set close button
        me.setCloseButton();


        //  set site tool collapse
        me.setSiteToolCollapse();


        //  set top scroll
        me.setUIToTop();


        //  load top data
        me.SITE.getUserExplorerData();
    }








    /* ========================================================================
     *  private methods
     * ========================================================================
    */

    //  get unique id
    function getUID(prefix) {
        do prefix += ~~(Math.random() * 1000000)
        while (document.getElementById(prefix))
        return prefix
    }



    //  get element position
    function getPosition(element) {
        element = element || this.$element

        var el = element[0]
        var isBody = el.tagName == 'BODY'

        var elRect = el.getBoundingClientRect()

        if (elRect.width == null) {
            // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
            elRect = $.extend({}, elRect, { width: elRect.right - elRect.left, height: elRect.bottom - elRect.top })
        }
        var elOffset = isBody ? { top: 0, left: 0 } : element.offset()
        var scroll = { scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : element.scrollTop() }
        var windowscroll = { windowscroll: $(window).scrollLeft() }
        var outerDims = isBody ? { width: $(window).width(), height: $(window).height() } : null

        return $.extend({}, elRect, scroll, outerDims, elOffset, windowscroll)
    }



    //  get window height
    function getWindowHeight(adj) {
        var val = (adj === undefined) ? 0 : adj;
        return ($(window).height() + val);
    }



    //  get window width
    function getWindowWidth(adj) {
        var val = (adj === undefined) ? 0 : adj;
        return ($(window).width() + val);
    }



    //  set comma
    function setComma(value) {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }



    //  set control item options
    function setControlItemOptions(elem, options) {
        options.element = elem;

        //  set from useparent
        if (options.useparent) {
            var parent = elem.parents(PARENT);
            var parentID = parent.data("parentid");
            var callbackprefix = parent.data("callbackprefix");

            options.callback = setCallBackByPrefix(callbackprefix);
            options.parentid = parentID || -1;
        } else {
            var parentID = elem.data("parentid");
            var callbackprefix = elem.data("callbackprefix");

            options.callback = setCallBackByPrefix(callbackprefix);
            options.parentid = parentID || -1;
        }

        //  set data
        elem.data(options);
    }



    //  set hightlight on listgroup
    function setHighlightListGroup(container, dataID) {
        if (typeof container === 'string') container = $(container);
       
        container.children('a').each(function (i, x) {
            var e = $(this);
            var data = e.data();
            if (data !== 'undefined') {
                if (data.parentid !== 'undefined') {
                    if (data.parentid === dataID) e.addClass('active');
                }
            }
        });

    }



    //  set input focus
    function setInputFocus(e, select) {
        if (typeof e === 'string') e = $(e);
        var val = e.val();
        e.focus().val('').val(val);
        if (select) e.select();
    }



    //  set no comma
    function setNoComma(value) {
        var noComma = new RegExp(',', 'g');
        return value.replace(noComma, '');        
    }



    //  set page dimensions
    function setPageDimension() {
        var siteNavigation = $('[data-nav="topnav"]');
        var fixedPageControl = $('[data-page="fixedpage"]');
        var pageContent = $('[data-page="page"]');

        var navHeight = Math.abs(siteNavigation.height());
        var fixedHeight = Math.abs(fixedPageControl.height())
        var bodyTop = fixedHeight + navHeight;

        fixedPageControl.css({ top: navHeight });
        siteNavigation.css({ marginTop: 0 });
        pageContent.css({ marginTop: bodyTop - 1 });
    }



    //  set table horizontal scroll
    function setTableHorizontalScroll() {
        var ELEM = '[data-page="tableheader-body"]';        //  inner div
        var table = $(ELEM);

        function scrollTableHeaderBody() {
            table.css('margin-left', -$(window).scrollLeft());
        }

        $(document).off('scroll.tableheader');
        $(document).on('scroll.tableheader', scrollTableHeaderBody);
    }
















    /* ========================================================================
     *  public methods
     * ========================================================================
    */


    //  get function from string
    me.getFuctionFromString = function (root, string) {
        var scope = root;
        var scopeSplit = string.split('.');
        for (var i = 0; i < scopeSplit.length - 1; i++) {
            scope = scope[scopeSplit[i]];

            if (scope == undefined) return;
        }
        return scope[scopeSplit[scopeSplit.length - 1]];
    }



    //  get image URL
    me.getImageURL = function () {
        return "http://daniel-assets.innotecgroup.com/userimages/";
    }



    //  get position
    me.getPosition = function (elem) {
        return getPosition(elem);
    }



    //  get uniqueid
    me.getUID = function (prefix) {
        return getUID(prefix);
    }



    //  get viewport adjusted delta
    me.getViewportAdjustedDelta = function(pos, actualWidth, actualHeight){
        return getViewportAdjustedDelta(pos, actualWidth, actualHeight);
    }



    //  get window height
    me.getWindowHeight = function (adj) {
        return getWindowHeight(adj);
    }



    //  get window width
    me.getWindowWidth = function (adj) {
        return getWindowWidth(adj);
    }



    //////////////////////////////////////////


    //  set BR 2 LN
    me.setBR2LN = function (elem) {
        return elem.html().trim().replace(/<\s*\/?br>/ig, "\r\n");
    }



    //  set global callback
    me.setCallBackFromData= function (elem, data) {
        var props = elem.data();
        
        if (elem.data().callback === undefined) return;
        if (props.callback.length === 0 || props.callback === null) return;

        var func = me.getFuctionFromString(me, props.callback);

        if (typeof func === 'function') func(data);
    }



    //  set close button
    me.setCloseButton = function () {
        $(document).on({
            'click': function (e) {
                e.preventDefault();
                $(this).parents('[data-parent="true"]').hide();
            }
        }, '[data-btn="close"]');
    }



    //  set comma
    me.setComma = function (val) {
        return setComma(val);
    }



    //  set control item options
    me.setControlItemOptions = function (elem, options) {
        return setControlItemOptions(elem, options);
    }



    //  set date parse
    me.setDateParse = function (val) {
        return new Date(parseInt(val.substr(6)));
    }



    //  set disable empty A tags
    me.setDisableEmptyATag = function () {
        $(document).on({
            'click': function (e) {
                e.preventDefault();
            }
        }, '[href="#"]');
    }



    //  set highlight list group
    me.setHighlightListGroup = function (elem, id) {
        setHighlightListGroup(elem, id);
    }



    //  set htmldecode
    me.setHtmlDecode = function(val) {
        return $('<div/>').html(val).text();
    }



    //  set htmlencode
    me.setHtmlEncode = function (val) {
        return $('<div/>').text(val).html();
    }



    //  set input focus
    me.setInputFocus = function (elem, highLight) {
        setInputFocus(elem, highLight);
    }



    //  set is object
    me.setIsObject = function (elem) {
        if (elem === null) { return false; }
        return ((typeof elem === 'function') || (typeof elem === 'object'));
    }



    //  set LN 2 BR
    me.setLN2BR = function (val) {
        return val.replace(new RegExp('\r?\n', 'g'), '<br />');
    }



    //  set no comma
    me.setNoComma = function(val){
       return setNoComma(val);
    }
    


    //  set page dimensions
    me.setPageDimension = function () {
        setPageDimension();
    }



    //  set page top table scroll
    me.setPageTopTableScroll = function () {
        setPageTopTableScroll();
    }



    //  set popovers
    me.setPopovers = function () {
        $('[data-toggle="popover"]').webuiPopover();
    }



    //  set site tool collapse
    me.setSiteToolCollapse = function () {
        var ELEM = '[data-topcontrol="true"]';
        $('#SITE_HIDETOOLBAR').on('click', function () {
            var e = $(this);
            if (e.hasClass('active')) {
                e.removeClass('active');
                $(ELEM).removeClass('hidden');
                e.children('i').removeClass('fa-flip-vertical');
                me.SITE.setPageControlRowAfterResize();
            } else {
                e.addClass('active');
                $(ELEM).addClass('hidden');
                e.children('i').addClass('fa-flip-vertical');
            }
            me.setPageDimension();
        });
    }



    //  set scrolltop
    me.setScrollTop = function () {
        $('html, body').animate({ scrollTop: 0 }, 'fast');
    }



    //  set tabindex
    me.setTabIndex = function () {
        var list = $('[data-tab="true"]');
        if (list.length === 0) return;
        var tab = 1000;
        list.each(function (i) {            
            $(this).attr('tabindex', tab);
            tab++;
        })
    }



    //  set tooltip
    me.setTooltip = function () {
        //$('[data-tt="true"]').tooltipster({
        //    debug: false
        //});
    }



    //  set UItoTop
    me.setUIToTop = function () {
        $().UItoTop();
        //{ easingType: 'easeOutQuart' }
    }



    //  init
    me.init = function () {
        init();
    }



    /* ========================================================================
     *  override in doc ready
     * ========================================================================
    */
    me.setPageLabels = function () { }

    /* ========================================================================
     *  return
     * ========================================================================
    */
    return me;
}(jQuery, FD));

