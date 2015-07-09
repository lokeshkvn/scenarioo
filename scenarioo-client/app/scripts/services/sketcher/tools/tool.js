/*scenarioo-client
 Copyright (C) 2015, scenarioo.org Development Team

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
/* eslint no-console:0 */


angular.module('scenarioo.controllers').factory('Tool', function ($rootScope) {

    var tool = {};

    tool.name = 'Tool Name';
    tool.icon = null;
    tool.tooltip = '';
    tool.cursor = 'default';
    tool.buttonDisabled = false;
    tool.DRAWING_ENDED_EVENT = 'drawingEnded';
    tool.SHAPE_SELECTED_EVENT = 'shapeSelected';


    tool.activate = function (newTool) {
        console.log('Activated tool: ' + newTool.name);
        newTool.buttonDisabled = true;

        var dp = tool.getDrawingPad();
        if(dp){
            dp.on('mousedown.drawingpad', newTool.onmousedown);
            dp.on('mouseup.drawingpad', newTool.onmouseup);
            dp.on('mousemove.drawingpad', newTool.onmousedrag);
        }
    };

    tool.deactivate = function (currentTool) {
        console.log('Deactivated tool: ' + currentTool.name);
        currentTool.buttonDisabled = false;

        var dp = tool.getDrawingPad();
        if(dp) {
            dp.off('mousedown.drawingpad', currentTool.onmousedown);
            dp.off('mouseup.drawingpad', currentTool.onmouseup);
            dp.off('mousemove.drawingpad', currentTool.onmousedrag);
        }
    };

    tool.isButtonDisabled = function (someTool) {
        return someTool.buttonDisabled;
    };


    tool.onmousedown = function () {
        console.log('onmousedown: not implemented in generic tool');
    };
    tool.onmouseup = function () {
        console.log('onmouseup: not implemented in generic tool');
    };
    tool.onmousedrag = function () {
        console.log('onmousedrag: not implemented in generic tool');
    };

    tool.getDrawingPad = function() {
        return $rootScope.drawingPad.viewPortGroup;
    };


    return {
        DRAWING_ENDED_EVENT: tool.DRAWING_ENDED_EVENT,
        SHAPE_SELECTED_EVENT: tool.SHAPE_SELECTED_EVENT,

        get: tool,
        name: tool.name,
        icon: tool.icon,
        tooltip: tool.tooltip,
        cursor: tool.cursor,
        buttonDisabled: tool.buttonDisabled,
        isButtonDisabled: tool.isButtonDisabled,

        activate: tool.activate,
        deactivate: tool.deactivate,

        onmouseup: tool.onmouseup,
        onmousedown: tool.onmousedown,
        onmousedrag: tool.onmousedrag
    };

});
