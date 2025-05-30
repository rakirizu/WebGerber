// @tracespace/plotter
// build abstract board images from @tracespace/parser ASTs
import type { GerberTree } from '../parser'

import { fromGraphics as sizeFromGraphics } from './bounding-box'
import { createGraphicPlotter, GraphicPlotter } from './graphic-plotter'
import { createLocationStore, Location, LocationStore } from './location-store'
import { getPlotOptions, PlotOptions } from './options'
import { createToolStore, Tool, ToolStore } from './tool-store'
import type { ImageTree } from './tree'
import { IMAGE, ImageGraphic } from './tree'

export * as BoundingBox from './bounding-box'
export { positionsEqual, TWO_PI } from './coordinate-math'
export * from './tree'

export function plot(tree: GerberTree, isOutline: boolean): ImageTree {
    const plotOptions: PlotOptions = getPlotOptions(tree)
    const toolStore: ToolStore = createToolStore()
    const locationStore: LocationStore = createLocationStore()
    const graphicPlotter: GraphicPlotter = createGraphicPlotter(tree.filetype, isOutline)
    const children: ImageGraphic[] = []

    for (const node of tree.children) {
        const tool: Tool | undefined = toolStore.use(node)
        const location: Location = locationStore.use(node, plotOptions)
        const graphics: ImageGraphic[] = graphicPlotter.plot(node, tool, location)

        children.push(...graphics)
    }

    return {
        type: IMAGE,
        units: plotOptions.units,
        tools: toolStore._toolsByCode,
        size: sizeFromGraphics(children),
        children,
    }
}
