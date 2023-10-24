<script>
import { useSlots, onBeforeMount, onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick, defineAsyncComponent, useCssModule, inject, getCurrentInstance } from 'vue'
import $ from 'jquery'

import { Map, View, Feature } from 'ol'
import Select from 'ol/interaction/Select';
import { ScaleLine } from 'ol/control.js';

import { ImageArcGISRest, OSM } from 'ol/source.js'
import TileWMS from 'ol/source/TileWMS'
import { IGC, WFS, } from 'ol/format'
import * as ol from 'ol';
import { TileArcGISRest } from 'ol/source.js'

import XYZ from 'ol/source/XYZ'
import VectorSource from 'ol/source/Vector.js'
import { Icon, Fill, Stroke, Style } from 'ol/style.js'
import { Tile, Tile as TileLayer, Image as ImageLayer, Vector, Vector as VectorLayer } from 'ol/layer.js'
import ImageWMS from 'ol/source/ImageWMS.js';
import TileGrid from 'ol/layer/Tile.js';

import PerspectiveMap from "ol-ext/map/PerspectiveMap"

import EsriJSON from 'ol/format/EsriJSON.js'
import { createXYZ } from 'ol/tilegrid.js'
import { bbox, tile as tileStrategy } from 'ol/loadingstrategy.js'
import { Circle, Polygon, Point } from 'ol/geom.js'
import Projection from 'ol/proj/Projection.js'
import GeoJSON from 'ol/format/GeoJSON.js'

import OLCesium from 'olcs/OLCesium.js';
import VectorImageLayer from 'ol/layer/VectorImage.js';
import TileState from 'ol/TileState.js';

import 'ol/ol.css'

import mapLayerList from '@/config/mapLayerList'
import baseMapList, { getBaseMapAll } from '@/config/baseMapList'

import 'ol-ext/dist/ol-ext.css'
import * as olTilecoord from 'ol/tilecoord'
import { get as getProjection } from 'ol/proj'
import WMSGetFeatureInfo from 'ol/format/WMSGetFeatureInfo.js'
import Overlay from 'ol/Overlay.js'
import currentPositionImg from '@/assets/img/icon/currentPosition.svg';

import { altKeyOnly, click, pointerMove } from 'ol/events/condition.js';
// proj4.defs(
//     'Indiana-East',
//     'PROJCS["IN83-EF",GEOGCS["LL83",DATUM["NAD83",' +
//     'SPHEROID["GRS1980",6378137.000,298.25722210]],PRIMEM["Greenwich",0],' +
//     'UNIT["Degree",0.017453292519943295]],PROJECTION["Transverse_Mercator"],' +
//     'PARAMETER["false_easting",328083.333],' +
//     'PARAMETER["false_northing",820208.333],' +
//     'PARAMETER["scale_factor",0.999966666667],' +
//     'PARAMETER["central_meridian",-85.66666666666670],' +
//     'PARAMETER["latitude_of_origin",37.50000000000000],' +
//     'UNIT["Foot_US",0.30480060960122]]'
// );
// register(proj4);

export default {
    props: {
    },
    setup(props, { emit }) {
        let map
        onMounted(async () => {

            const bgColors = [
                '#261F03',
                '#F49AAF',
                '#A9C4F6',
                '#A5A751',
                '#9C7B37',
                '#ABD172',
                '#6FB7B7',
                '#117800'
            ]
            const vector = new VectorLayer({
                source: new VectorSource({
                    url: 'https://gis.edtest.site/ogc/temp?VERSION=1.3.0&SERVICE=WFS&REQUEST=GetFeature&OUTPUTFORMAT=application/json&TYPENAME=新竹縣原住民部落範圍&STYLE=default',
                    format: new GeoJSON(),
                    strategy: bbox
                }),
                style: function (feature) {
                    var parts = feature.id_.split('.'); // 使用点号进行分割
                    var lastPart = parts[parts.length - 1]; // 获取最后一个部分
                    const style = new Style({
                        fill: new Fill({
                            color: bgColors[lastPart] !== undefined ? bgColors[lastPart] : '#FF0000',
                        }),
                    })
                    return style;
                },
            });
            const osm = new TileLayer({
                source: new OSM(),
            });

            map = new Map({
                layers: [
                    osm,
                    vector
                ],
                target: 'map',
                view: new View({
                    projection: 'EPSG:4326',
                    center: [121.326776, 24.655499],
                    zoom: 12,
                }),
            });

            let select = null; // ref to currently selected interaction

            const selected = new Style({
                fill: new Fill({
                    color: '#eeeeee',
                }),
                stroke: new Stroke({
                    color: 'rgba(255, 255, 255, 0.7)',
                    width: 2,
                }),
            });

            function selectStyle(feature) {
                const color = feature.get('COLOR') || '#eeeeee';
                selected.getFill().setColor(color);
                return selected;
            }

            // select interaction working on "singleclick"
            const selectSingleClick = new Select({ style: selectStyle });

            // select interaction working on "click"
            const selectClick = new Select({
                condition: click,
                style: selectStyle,
            });

            // select interaction working on "pointermove"
            const selectPointerMove = new Select({
                condition: pointerMove,
                style: selectStyle,
            });

            const selectAltClick = new Select({
                style: selectStyle,
                condition: function (mapBrowserEvent) {
                    return click(mapBrowserEvent) && altKeyOnly(mapBrowserEvent);
                },
            });

            const selectElement = document.getElementById('type');

            const changeInteraction = function () {
                if (select !== null) {
                    map.removeInteraction(select);
                }
                const value = selectElement.value;
                if (value == 'singleclick') {
                    select = selectSingleClick;
                } else if (value == 'click') {
                    select = selectClick;
                } else if (value == 'pointermove') {
                    select = selectPointerMove;
                } else if (value == 'altclick') {
                    select = selectAltClick;
                } else {
                    select = null;
                }
                if (select !== null) {
                    map.addInteraction(select);
                    select.on('select', function (e) {
                        document.getElementById('status').innerHTML =
                            '&nbsp;' +
                            e.target.getFeatures().getLength() +
                            ' selected features (last operation selected ' +
                            e.selected.length +
                            ' and deselected ' +
                            e.deselected.length +
                            ' features)';
                    });
                }
            };

            selectElement.onchange = changeInteraction;
            changeInteraction();
        })

        return {
            map,
        }
    }
}
</script>

<template>
    <div>
        <div id="map" class="map"></div>
        <form>
            <label for="type">Action type &nbsp;</label>
            <select id="type">
                <option value="click" selected>Click</option>
                <option value="singleclick">Single-click</option>
                <option value="pointermove">Hover</option>
                <option value="altclick">Alt+Click</option>
                <option value="none">None</option>
            </select>
            <span id="status">&nbsp;0 selected features</span>
        </form>
    </div>
</template>

<style lang="sass" scoped>
#map
    width: 100%
    height: 1000px
</style>

