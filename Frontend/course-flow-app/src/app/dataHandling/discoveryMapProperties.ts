import { ILabelProperties, IMapProperties, IWindowSizePropertiesSizes, IWindowSizeProperties, IDiscoveryColorData } from "../interfaces/discoveryInterfaces"

const startWindowSizeBasedProperties : IWindowSizeProperties = {
    canvasWidth: 400,
    canvasHeight:  400,
    nodeDistance: 60,
    clusterForce: -50,
    fieldNodeRadius: 6,
    specializationNodeRadius: 2,
    unitNodeRadius: 1,
    unitLabelProperties: {
        x: 15,
        y: 0,
        fontSize: "3pt"
    },
    specializationLabelProperties: {
        x: 30,
        y: 0,
        fontSize: "6pt"
    },
    fieldLabelProperties: {
        x: 60,
        y: 0,
        fontSize: "10pt"
    }
}

const smallWindowSizeBasedProperties : IWindowSizeProperties = {
    canvasWidth: 400,
    canvasHeight:  400,
    nodeDistance: 60,
    clusterForce: -50,
    fieldNodeRadius: 15,
    specializationNodeRadius: 12,
    unitNodeRadius: 6,
    unitLabelProperties: {
        x: 8,
        y: 2,
        fontSize: "3pt"
    },
    specializationLabelProperties: {
        x: 15,
        y: 2,
        fontSize: "5pt"
    },
    fieldLabelProperties: {
        x: 25,
        y: 2,
        fontSize: "10pt"
    }
}

const mediumWindowSizeBasedProperties : IWindowSizeProperties = {
    canvasWidth: 800,
    canvasHeight:  800,
    nodeDistance: 90,
    clusterForce: -80,
    fieldNodeRadius: 30,
    specializationNodeRadius: 15,
    unitNodeRadius: 7.5,
    unitLabelProperties: {
        x: 9,
        y: 0,
        fontSize: "4pt"
    },
    specializationLabelProperties: {
        x: 20,
        y: 2,
        fontSize: "10pt"
    },
    fieldLabelProperties: {
        x: 40,
        y: 2,
        fontSize: "15pt"
    }
}

const largeWindowSizeBasedProperties : IWindowSizeProperties = {
    canvasWidth: 1200,
    canvasHeight:  1200,
    nodeDistance: 140,
    clusterForce: -250,
    fieldNodeRadius: 50,
    specializationNodeRadius: 25,
    unitNodeRadius: 3,
    unitLabelProperties: {
        x: 15,
        y: 0,
        fontSize: "3pt"
    },
    specializationLabelProperties: {
        x: 30,
        y: 0,
        fontSize: "6pt"
    },
    fieldLabelProperties: {
        x: 60,
        y: 0,
        fontSize: "15pt"
    }
}

const windowSizePropertiesSizes: IWindowSizePropertiesSizes = {
    
    "start": startWindowSizeBasedProperties,
    "small": smallWindowSizeBasedProperties,
    "medium": mediumWindowSizeBasedProperties,
    "large": largeWindowSizeBasedProperties
}

export const discoveryMapProperties: IMapProperties = {
    
    windowSizePropertiesSizes: windowSizePropertiesSizes,
    maxZoomOutAmount: 0,
    maxZoomInAmount: 10,
    canvasColor: "#232224",
    canvasBorderRadius: "20px",
    lineOpacity: 0.2

}

export const discoveryForceDirectedColorMapping : IDiscoveryColorData = {
    0: "#1d192b",
    1: "#484458",
    2: "#e8def8",
}
