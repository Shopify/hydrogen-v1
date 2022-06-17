import { ReactNode, ElementType } from 'react';
import { Props } from '../types';
import type { Model3d } from '../../storefront-api-types';
import type { PartialDeep } from 'type-fest';
interface ModelViewerProps {
    /** Any ReactNode elements. */
    children?: ReactNode;
    /** An object with fields that correspond to the Storefront API's [Model3D object](https://shopify.dev/api/storefront/latest/objects/model3d). */
    data: PartialDeep<Model3d>;
    /** A string of either `auto`, `lazy`, or `eager` to indicate the conditions for preloading. Refer to [loading in the <model-viewer> documentation](https://modelviewer.dev/docs/index.html#entrydocs-loading-attributes-loading). */
    loading?: 'auto' | 'lazy' | 'eager';
    /** A URL to display an image instead of the model. This is useful for showing the user something before a model is loaded and ready to render. If no URL is provided, then [Model3d.previewImage](https://shopify.dev/api/storefront/latest/objects/model3d) is used. Refer to [poster in the <model-viewer> documentation](https://modelviewer.dev/docs/index.html#entrydocs-loading-attributes-poster). */
    poster?: string;
    /** A string of either `auto`, `interaction`, or `manual` to indicate when the model should be revealed. Refer to [reveal in the <model-viewer> documentation](https://modelviewer.dev/docs/index.html#entrydocs-loading-attributes-reveal). */
    reveal?: 'auto' | 'interaction' | 'manual';
    /** A boolean to enable an AR experience. Refer to [ar in the <model-viewer> documentation](https://modelviewer.dev/docs/index.html#entrydocs-augmentedreality-attributes-ar). */
    ar?: boolean;
    /** A prioritized list of `webxr`, `scene-viewer`, and/or `quick-look` to indicate the types of AR experiences to enable. Refer to [ar-modes in the <model-viewer> documentation](https://modelviewer.dev/docs/index.html#entrydocs-augmentedreality-attributes-arModes). */
    arModes?: 'webxr' | 'scene-viewer' | 'quick-look';
    /** A string of `auto` or `fixed` to control the scaling behaviour. Refer to [ar-scale in the <model-viewer> documentation](https://modelviewer.dev/docs/index.html#entrydocs-augmentedreality-attributes-arScale). */
    arScale?: 'auto' | 'fixed';
    /** A styring of either `floor` or `wall` to indicate where to place the object in AR. Refer to [ar-placement in the <model-viewer> documentation](https://modelviewer.dev/docs/index.html#entrydocs-augmentedreality-attributes-arPlacement). */
    arPlacement?: 'floor' | 'wall';
    /** The url to a USDZ model which will be used on supported iOS 12+ devices via AR Quick Look on Safari. Refer to [ios-source in the <model-viewer> documentation](https://modelviewer.dev/docs/index.html#entrydocs-augmentedreality-attributes-iosSrc). */
    iosSrc?: string;
    /** A boolean to enable camera controls. Refer to [attributes in the <model-viewer> documentation](https://modelviewer.dev/docs/index.html#stagingandcameras-attributes). */
    cameraControls?: boolean;
    /** A string of `pan-x`, `pan-y`, or `none`. Refer to [touch-action in the <model-viewer> documentation](https://modelviewer.dev/docs/index.html#entrydocs-stagingandcameras-attributes-touch-action). */
    touchAction?: 'pan-x' | 'pan-y' | 'none';
    /** A boolean to disable zoom. Refer to [disable-zoom in the <model-viewer> documentation](https://modelviewer.dev/docs/index.html#entrydocs-stagingandcameras-attributes-disable-zoom). */
    disableZoom?: boolean;
    /** A number to adjust the speed of theta and phi orbit interactions. Refer to [orbit-sensitivity in the <model-viewer> documentation](https://modelviewer.dev/docs/index.html#entrydocs-stagingandcameras-attributes-orbitSensitivity). */
    orbitSensitivity?: number;
    /** A boolean to enable auto rotate. Refer to [auto-rotate in the <model-viewer> documentation](https://modelviewer.dev/docs/index.html#entrydocs-stagingandcameras-attributes-autoRotate). */
    autoRotate?: boolean;
    /** A number in milliseconds to specify the delay before auto rotation begins. Refer to [auto-rotate-delay in the <model-viewer> documentation](https://modelviewer.dev/docs/index.html#entrydocs-stagingandcameras-attributes-autoRotateDelay). */
    autoRotateDelay?: number;
    /**  The speed of auto rotation. Refer to [rotation-per-second in the <model-viewer> documentation](https://modelviewer.dev/docs/index.html#entrydocs-stagingandcameras-attributes-rotationPerSecond). */
    rotationPerSecond?: string;
    /** A string of either `allow-when-focused` or `always-allow` to indicate whether the viewer requires focus before interacting with it. Refer to [interaction-policy in the <model-viewer> documentation](https://modelviewer.dev/docs/index.html#entrydocs-stagingandcameras-attributes-interactionPolicy). */
    interactionPolicy?: 'allow-when-focused' | 'always-allow';
    /** A string of either 'auto', 'when-focused', or 'none' indicating the conditions under which the visual and audible interaction prompt will display. Refer to [interaction-prompts in the <model-viewer> documentation](https://modelviewer.dev/docs/index.html#entrydocs-stagingandcameras-attributes-interactionPrompt). */
    interactionPrompt?: 'auto' | 'when-focused' | 'none';
    /** A string of either `wiggle` or `basic` indicating the presentation style of the interaction-prompt when it is raised. Refer to [interaction-prompt-style in the <model-viewer> documentation](https://modelviewer.dev/docs/index.html#entrydocs-stagingandcameras-attributes-interactionPromptStyle). */
    interactionPromptStyle?: 'wiggle' | 'basic';
    /** A number to indicate how long the model viewer should wait before prompting the user visually for interaction. Refer to [interaction-prompt-threshold in the <model-viewer> documentation](https://modelviewer.dev/docs/index.html#entrydocs-stagingandcameras-attributes-interactionPromptThreshold). */
    interactionPromptThreshold?: number;
    /** A string of the starting orbital position of the camera. Refer to [camera-orbit in the <model-viewer> documentation](https://modelviewer.dev/docs/index.html#entrydocs-stagingandcameras-attributes-cameraOrbit). */
    cameraOrbit?: string;
    /** A string of the point the camera orbits around. Refer to [camera-target in the <model-viewer> documentation](https://modelviewer.dev/docs/index.html#entrydocs-stagingandcameras-attributes-cameraTarget). */
    cameraTarget?: string;
    /** A string of the vertical field of view of the camera. Refer to [field-of-view in the <model-viewer> documentation](https://modelviewer.dev/docs/index.html#entrydocs-stagingandcameras-attributes-fieldOfView). */
    fieldOfView?: string;
    /** A string of the maxiumum orbital values of the camera. Refer to [max-camera-orbit in the <model-viewer> documentation](https://modelviewer.dev/docs/index.html#entrydocs-stagingandcameras-attributes-maxCameraOrbit). */
    maxCameraOrbit?: string;
    /** A string of the minimum orbital values of the camera. Refer to [min-camera-orbit in the <model-viewer> documentation](https://modelviewer.dev/docs/index.html#entrydocs-stagingandcameras-attributes-minCameraOrbit). */
    minCameraOrbit?: string;
    /** A number indicating the max field of view of the camera. Refer to [max-field-of-view in the <model-viewer> documentation](https://modelviewer.dev/docs/index.html#entrydocs-stagingandcameras-attributes-maxFieldOfView). */
    maxFieldOfView?: number;
    /** A number indicating the min field of view of the camera. Refer to [min-field-of-view in the <model-viewer> documentation](https://modelviewer.dev/docs/index.html#entrydocs-stagingandcameras-attributes-minFieldOfView). */
    minFieldOfView?: number;
    /** A string of `tight` or `legacy` for calculating the model's bounding box. Refer to [bounds in the <model-viewer> documentation](https://modelviewer.dev/docs/index.html#entrydocs-stagingandcameras-attributes-bounds). */
    bounds?: 'tight' | 'legacy';
    /** A number indicating the rate of interpolation when the camera or model moves. Refer to [interpolation-decay in the <model-viewer> documentation](https://modelviewer.dev/docs/index.html#entrydocs-stagingandcameras-attributes-interpolationDecay). */
    interpolationDecay?: number;
    /** A string for the background image of the scene. Refer to [skybox-image in the <model-viewer> documentation](https://modelviewer.dev/docs/index.html#entrydocs-lightingandenv-attributes-skyboxImage). */
    skyboxImage?: string;
    /** A string to control the environmental reflection of the model. Refer to [environment-image in the <model-viewer> documentation](https://modelviewer.dev/docs/index.html#entrydocs-lightingandenv-attributes-environmentImage). */
    environmentImage?: string;
    /** A number indicating the exposure of the model and the skybox. Refer to [exposure in the <model-viewer> documentation](https://modelviewer.dev/docs/index.html#entrydocs-lightingandenv-attributes-exposure). */
    exposure?: number;
    /** A number for the opacity of the shadow. Refer to [shadow-intensity in the <model-viewer> documentation](https://modelviewer.dev/docs/index.html#entrydocs-lightingandenv-attributes-shadowIntensity). */
    shadowIntensity?: number;
    /** A number for the bluriness of the shadow. Refer to [shadow-softness in the <model-viewer> documentation](https://modelviewer.dev/docs/index.html#entrydocs-lightingandenv-attributes-shadowSoftness). */
    shadowSoftness?: number;
    /** A string of the animation to play by name. Refer to [animation-name in the <model-viewer> documentation](https://modelviewer.dev/docs/index.html#entrydocs-animation-attributes-animationName). */
    animationName?: string;
    /** A string of the animation crossfade duration between the previous and next animations. Refer to [animation-cross-fade-duration in the <model-viewer> documentation](https://modelviewer.dev/docs/index.html#entrydocs-animation-attributes-animationCrossfadeDuration). */
    animationCrossfadeDuration?: string;
    /** A boolean to enable the model animations. Refer to [autoplay in the <model-viewer> documentation](https://modelviewer.dev/docs/index.html#entrydocs-animation-attributes-autoplay). */
    autoplay?: boolean;
    /** A string to select a model variant by name. Refer to [variant-name in the <model-viewer> documentation](https://modelviewer.dev/docs/index.html#entrydocs-scenegraph-attributes-variantName). */
    variantName?: string;
    /** A string to rotate the model. Refer to [orientation in the <model-viewer> documentation](https://modelviewer.dev/docs/index.html#entrydocs-scenegraph-attributes-orientation). */
    orientation?: string;
    /** A string to scale the model. Refer to [scale in the <model-viewer> documentation](https://modelviewer.dev/docs/index.html#entrydocs-scenegraph-attributes-scale). */
    scale?: string;
    /** The callback to invoke when the 'error' event is triggered. Refer to [error in the <model-viewer> documentation](https://modelviewer.dev/docs/index.html#entrydocs-loading-events-error). */
    onError?: (event: Event) => void;
    /** The callback to invoke when the `load` event is triggered. Refer to [load in the <model-viewer> documentation](https://modelviewer.dev/docs/index.html#entrydocs-loading-events-load). */
    onLoad?: (event: Event) => void;
    /** The callback to invoke when the 'preload' event is triggered. Refer to [preload in the <model-viewer> documentation](https://modelviewer.dev/docs/index.html#entrydocs-loading-events-preload). */
    onPreload?: (event: Event) => void;
    /** The callback to invoke when the 'model-visibility' event is triggered. Refer to [model-visibility in the <model-viewer> documentation](https://modelviewer.dev/docs/index.html#entrydocs-loading-events-modelVisibility). */
    onModelVisibility?: (event: Event) => void;
    /** The callback to invoke when the 'progress' event is triggered. Refer to [progress in the <model-viewer> documentation](https://modelviewer.dev/docs/index.html#entrydocs-loading-events-progress). */
    onProgress?: (event: Event) => void;
    /** The callback to invoke when the 'ar-status' event is triggered. Refer to [ar-status in the <model-viewer> documentation](https://modelviewer.dev/docs/index.html#entrydocs-augmentedreality-events-arStatus). */
    onArStatus?: (event: Event) => void;
    /** The callback to invoke when the 'ar-tracking' event is triggered. Refer to [ar-tracking in the <model-viewer> documentation](https://modelviewer.dev/docs/index.html#entrydocs-augmentedreality-events-arTracking). */
    onArTracking?: (event: Event) => void;
    /** The callback to invoke when the 'quick-look-button-tapped' event is triggered. Refer to [quick-look-button-tapped in the <model-viewer> documentation](https://modelviewer.dev/docs/index.html#entrydocs-augmentedreality-events-quickLookButtonTapped). */
    onQuickLookButtonTapped?: (event: Event) => void;
    /** The callback to invoke when the 'camera-change' event is triggered. Refer to [camera-change in the <model-viewer> documentation](https://modelviewer.dev/docs/index.html#entrydocs-stagingandcameras-events-cameraChange). */
    onCameraChange?: (event: Event) => void;
    /** The callback to invoke when the 'environment-change' event is triggered. Refer to [environment-change in the <model-viewer> documentation](https://modelviewer.dev/docs/index.html#entrydocs-lightingandenv-events-environmentChange).  */
    onEnvironmentChange?: (event: Event) => void;
    /**  The callback to invoke when the 'play' event is triggered. Refer to [play in the <model-viewer> documentation](https://modelviewer.dev/docs/index.html#entrydocs-animation-events-play). */
    onPlay?: (event: Event) => void;
    /**  The callback to invoke when the 'pause' event is triggered. Refer to [pause in the <model-viewer> documentation](https://modelviewer.dev/docs/index.html#entrydocs-animation-events-pause). */
    onPause?: (event: Event) => void;
    /** The callback to invoke when the 'scene-graph-ready' event is triggered. Refer to [scene-graph-ready in the <model-viewer> documentation](https://modelviewer.dev/docs/index.html#entrydocs-scenegraph-events-sceneGraphReady). */
    onSceneGraphReady?: (event: Event) => void;
}
declare type PropsWeControl = 'src' | 'poster';
declare global {
    namespace JSX {
        interface IntrinsicElements {
            'model-viewer': any;
        }
    }
}
/**
 * The `ModelViewer` component renders a 3D model (with the `model-viewer` tag) for
 * the Storefront API's [Model3d object](https://shopify.dev/api/storefront/reference/products/model3d).
 */
export declare function ModelViewer<TTag extends ElementType>(props: Props<TTag, PropsWeControl> & ModelViewerProps): JSX.Element | null;
export {};
