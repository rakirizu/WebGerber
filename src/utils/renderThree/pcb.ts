import * as THREE from 'three'
import { LaminarStructure } from './config'
export interface PCBRender {
    Top: LayerStruct
    Btm: LayerStruct
    OutLine: THREE.Object3D
    Drill: THREE.Object3D
}
export interface LayerStruct {
    Copper: THREE.Object3D
    SolderMask: THREE.Object3D
    Silkscreen: THREE.Object3D
}

export const assemblyPCBToThreeJS = (
    scene: THREE.Scene,
    _pcb: PCBRender,
    thicknessConfig: LaminarStructure,
    oilColor: number = 0x225933
) => {
    const mainBoardThickness =
        thicknessConfig.Total -
        thicknessConfig.Copper * 2 -
        thicknessConfig.Silkscreen * 2 -
        thicknessConfig.SolderMask * 2 -
        thicknessConfig.Oil * 2
    console.log('mainBoardThickness', mainBoardThickness)

    _pcb.OutLine.scale.setZ(mainBoardThickness)

    _pcb.Top.Copper?.scale.setZ(thicknessConfig.Copper)
    _pcb.Btm.Copper?.scale.setZ(thicknessConfig.Copper)

    _pcb.Top.SolderMask?.scale.setZ(thicknessConfig.SolderMask)
    _pcb.Btm.SolderMask?.scale.setZ(thicknessConfig.SolderMask)

    _pcb.Top.Silkscreen?.scale.setZ(thicknessConfig.Silkscreen)
    _pcb.Btm.Silkscreen?.scale.setZ(thicknessConfig.Silkscreen)

    _pcb.Drill?.scale.setZ(thicknessConfig.Total - thicknessConfig.Silkscreen)

    const halfMainBoardThickness = mainBoardThickness / 2

    //绿油层
    const oilModel = _pcb.OutLine.clone()
    oilModel.scale.setZ(thicknessConfig.Oil)
    oilModel.position.setZ(halfMainBoardThickness + thicknessConfig.Oil / 2)
    //@ts-ignore
    oilModel.children[0].material = new THREE.MeshBasicMaterial({
        color: oilColor,
    })

    _pcb.Top.Copper.position.setZ(
        halfMainBoardThickness + thicknessConfig.Oil + thicknessConfig.Copper / 2
    )

    _pcb.Top.SolderMask.position.setZ(
        halfMainBoardThickness +
            thicknessConfig.Oil +
            thicknessConfig.Copper +
            thicknessConfig.SolderMask / 2
    )

    _pcb.Top.Silkscreen.position.setZ(
        halfMainBoardThickness +
            thicknessConfig.Copper +
            thicknessConfig.Oil +
            thicknessConfig.SolderMask +
            thicknessConfig.Silkscreen / 2
    )

    const oilBtmModel = _pcb.OutLine.clone()
    oilBtmModel.scale.setZ(thicknessConfig.Oil)
    oilBtmModel.position.setZ(-halfMainBoardThickness - thicknessConfig.Oil / 2)
    //@ts-ignore
    oilBtmModel.children[0].material = new THREE.MeshBasicMaterial({
        color: oilColor,
    })

    _pcb.Btm.Copper.position.setZ(
        -halfMainBoardThickness - thicknessConfig.Oil - thicknessConfig.Copper / 2
    )

    _pcb.Btm.SolderMask.position.setZ(
        -halfMainBoardThickness -
            thicknessConfig.Oil -
            thicknessConfig.Copper -
            thicknessConfig.SolderMask / 2
    )

    _pcb.Btm.Silkscreen.position.setZ(
        -halfMainBoardThickness -
            thicknessConfig.Copper -
            thicknessConfig.Oil -
            thicknessConfig.SolderMask -
            thicknessConfig.Silkscreen / 2
    )

    scene.add(_pcb.OutLine)

    scene.add(oilModel)
    scene.add(_pcb.Top.Copper)
    // scene.add(_pcb.Top.SolderPaste)
    scene.add(_pcb.Top.SolderMask)
    scene.add(_pcb.Top.Silkscreen)

    scene.add(oilBtmModel)
    scene.add(_pcb.Btm.Copper)
    scene.add(_pcb.Btm.SolderMask)
    scene.add(_pcb.Btm.Silkscreen)

    scene.add(_pcb.Drill)

    // scene.add(_pcb.Btm.Copper)
    scene.updateMatrix()
    scene.updateMatrixWorld()
}
