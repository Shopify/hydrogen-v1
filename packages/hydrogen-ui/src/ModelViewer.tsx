import {useState, useEffect, useCallback} from 'react';
import {useLoadScript} from './load-script.js';
import type {Model3d} from './storefront-api-types.js';
import type {PartialDeep} from 'type-fest';
import type {ModelViewerElement} from '@google/model-viewer/lib/model-viewer.js';

type PropsWeControl = 'src';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': ModelViewerElement;
    }
  }
}

type ModelViewerProps = Omit<
  JSX.IntrinsicElements['model-viewer'],
  PropsWeControl
> & {
  /** An object with fields that correspond to the Storefront API's [Model3D object](https://shopify.dev/api/storefront/latest/objects/model3d). */
  data: PartialDeep<Model3d>;
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
};

/**
 * The `ModelViewer` component renders a 3D model (with the `model-viewer` custom element) for
 * the Storefront API's [Model3d object](https://shopify.dev/api/storefront/reference/products/model3d).
 *
 * The `model-viewer` custom element is lazily downloaded through a dynamically-injected `<script type="module">` tag when the `<ModelViewer />` component is rendered
 *
 * ModelViewer is using version `1.21.1` of the `@google/model-viewer` library.
 */
export function ModelViewer(props: ModelViewerProps) {
  const [modelViewer, setModelViewer] = useState<undefined | HTMLElement>(
    undefined
  );
  const callbackRef = useCallback((node: HTMLElement) => {
    setModelViewer(node);
  }, []);
  const {data, children, className, ...passthroughProps} = props;

  const modelViewerLoadedStatus = useLoadScript(
    'https://unpkg.com/@google/model-viewer@v1.12.1/dist/model-viewer.min.js',
    {
      module: true,
    }
  );

  useEffect(() => {
    if (!modelViewer) {
      return;
    }
    if (passthroughProps.onError)
      modelViewer.addEventListener('error', passthroughProps.onError);
    if (passthroughProps.onLoad)
      modelViewer.addEventListener('load', passthroughProps.onLoad);
    if (passthroughProps.onPreload)
      modelViewer.addEventListener('preload', passthroughProps.onPreload);
    if (passthroughProps.onModelVisibility)
      modelViewer.addEventListener(
        'model-visibility',
        passthroughProps.onModelVisibility
      );
    if (passthroughProps.onProgress)
      modelViewer.addEventListener('progress', passthroughProps.onProgress);
    if (passthroughProps.onArStatus)
      modelViewer.addEventListener('ar-status', passthroughProps.onArStatus);
    if (passthroughProps.onArTracking)
      modelViewer.addEventListener(
        'ar-tracking',
        passthroughProps.onArTracking
      );
    if (passthroughProps.onQuickLookButtonTapped)
      modelViewer.addEventListener(
        'quick-look-button-tapped',
        passthroughProps.onQuickLookButtonTapped
      );
    if (passthroughProps.onCameraChange)
      modelViewer.addEventListener(
        'camera-change',
        passthroughProps.onCameraChange
      );
    if (passthroughProps.onEnvironmentChange)
      modelViewer.addEventListener(
        'environment-change',
        passthroughProps.onEnvironmentChange
      );
    if (passthroughProps.onPlay)
      modelViewer.addEventListener('play', passthroughProps.onPlay);
    if (passthroughProps.onPause)
      modelViewer.addEventListener('ar-status', passthroughProps.onPause);
    if (passthroughProps.onSceneGraphReady)
      modelViewer.addEventListener(
        'scene-graph-ready',
        passthroughProps.onSceneGraphReady
      );

    return () => {
      if (modelViewer == null) {
        return;
      }
      if (passthroughProps.onError)
        modelViewer.removeEventListener('error', passthroughProps.onError);
      if (passthroughProps.onLoad)
        modelViewer.removeEventListener('load', passthroughProps.onLoad);
      if (passthroughProps.onPreload)
        modelViewer.removeEventListener('preload', passthroughProps.onPreload);
      if (passthroughProps.onModelVisibility)
        modelViewer.removeEventListener(
          'model-visibility',
          passthroughProps.onModelVisibility
        );
      if (passthroughProps.onProgress)
        modelViewer.removeEventListener(
          'progress',
          passthroughProps.onProgress
        );
      if (passthroughProps.onArStatus)
        modelViewer.removeEventListener(
          'ar-status',
          passthroughProps.onArStatus
        );
      if (passthroughProps.onArTracking)
        modelViewer.removeEventListener(
          'ar-tracking',
          passthroughProps.onArTracking
        );
      if (passthroughProps.onQuickLookButtonTapped)
        modelViewer.removeEventListener(
          'quick-look-button-tapped',
          passthroughProps.onQuickLookButtonTapped
        );
      if (passthroughProps.onCameraChange)
        modelViewer.removeEventListener(
          'camera-change',
          passthroughProps.onCameraChange
        );
      if (passthroughProps.onEnvironmentChange)
        modelViewer.removeEventListener(
          'environment-change',
          passthroughProps.onEnvironmentChange
        );
      if (passthroughProps.onPlay)
        modelViewer.removeEventListener('play', passthroughProps.onPlay);
      if (passthroughProps.onPause)
        modelViewer.removeEventListener('ar-status', passthroughProps.onPause);
      if (passthroughProps.onSceneGraphReady)
        modelViewer.removeEventListener(
          'scene-graph-ready',
          passthroughProps.onSceneGraphReady
        );
    };
  }, [
    modelViewer,
    passthroughProps.onArStatus,
    passthroughProps.onArTracking,
    passthroughProps.onCameraChange,
    passthroughProps.onEnvironmentChange,
    passthroughProps.onError,
    passthroughProps.onLoad,
    passthroughProps.onModelVisibility,
    passthroughProps.onPause,
    passthroughProps.onPlay,
    passthroughProps.onPreload,
    passthroughProps.onProgress,
    passthroughProps.onQuickLookButtonTapped,
    passthroughProps.onSceneGraphReady,
  ]);

  if (modelViewerLoadedStatus !== 'done') {
    // TODO: What do we want to display while the model-viewer library loads?
    return null;
  }

  if (!data.sources?.[0]?.url) {
    const sourcesUrlError = `<ModelViewer/> requires 'data.sources' prop to be an array, with an object that has a property 'url' on it. Rendering 'null'`;
    if (__HYDROGEN_DEV__) {
      throw new Error(sourcesUrlError);
    } else {
      console.error(sourcesUrlError);
      return null;
    }
  }

  if (!data.alt && __HYDROGEN_DEV__) {
    console.warn(
      `<ModelViewer/> requires the 'data.alt' prop for accessibility`
    );
  }

  return (
    <model-viewer
      // @ts-expect-error ref should exist
      ref={callbackRef}
      {...passthroughProps}
      className={className}
      id={passthroughProps.id ?? data.id ?? null}
      src={data.sources[0].url}
      alt={data.alt ?? null}
      camera-controls={passthroughProps.cameraControls ?? true}
      poster={(passthroughProps.poster || data.previewImage?.url) ?? null}
      autoplay={passthroughProps.autoplay ?? true}
      loading={passthroughProps.loading}
      reveal={passthroughProps.reveal}
      ar={passthroughProps.ar}
      ar-modes={passthroughProps.arModes}
      ar-scale={passthroughProps.arScale}
      // @ts-expect-error arPlacement should exist as a type, not sure why it doesn't. https://modelviewer.dev/docs/index.html#entrydocs-augmentedreality-attributes-arPlacement
      ar-placement={passthroughProps.arPlacement}
      ios-src={passthroughProps.iosSrc}
      touch-action={passthroughProps.touchAction}
      disable-zoom={passthroughProps.disableZoom}
      orbit-sensitivity={passthroughProps.orbitSensitivity}
      auto-rotate={passthroughProps.autoRotate}
      auto-rotate-delay={passthroughProps.autoRotateDelay}
      // @ts-expect-error rotationPerSecond should exist as a type, not sure why it doesn't. https://modelviewer.dev/docs/index.html#entrydocs-stagingandcameras-attributes-rotationPerSecond
      rotation-per-second={passthroughProps.rotationPerSecond}
      interaction-policy={passthroughProps.interactionPolicy}
      interaction-prompt={passthroughProps.interactionPrompt}
      interaction-prompt-style={passthroughProps.interactionPromptStyle}
      interaction-prompt-threshold={passthroughProps.interactionPromptThreshold}
      camera-orbit={passthroughProps.cameraOrbit}
      camera-target={passthroughProps.cameraTarget}
      field-of-view={passthroughProps.fieldOfView}
      max-camera-orbit={passthroughProps.maxCameraOrbit}
      min-camera-orbit={passthroughProps.minCameraOrbit}
      max-field-of-view={passthroughProps.maxFieldOfView}
      min-field-of-view={passthroughProps.minFieldOfView}
      bounds={passthroughProps.bounds}
      interpolation-decay={passthroughProps.interpolationDecay ?? 100}
      skybox-image={passthroughProps.skyboxImage}
      environment-image={passthroughProps.environmentImage}
      exposure={passthroughProps.exposure}
      shadow-intensity={passthroughProps.shadowIntensity ?? 0}
      shadow-softness={passthroughProps.shadowSoftness ?? 0}
      animation-name={passthroughProps.animationName}
      animation-crossfade-duration={passthroughProps.animationCrossfadeDuration}
      variant-name={passthroughProps.variantName}
      orientation={passthroughProps.orientation}
      scale={passthroughProps.scale}
    >
      {children}
    </model-viewer>
  );
}
