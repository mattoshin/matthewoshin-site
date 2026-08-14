"use client";

/**
 * SceneErrorBoundary - the last line of defense for the WebGL background.
 *
 * Some WebGL failures don't announce themselves through `webglcontextlost` or a
 * null getContext - they THROW while three/R3F is initializing the renderer or
 * compiling a shader (this is disproportionately an Edge/ANGLE-on-Windows story,
 * where the D3D backend rejects something the desktop-GL path accepts). Without a
 * boundary, that throw tears down the whole background subtree and can leave a
 * dark/blank layer behind the page - which is exactly the "unprofessional" broken
 * hero we're guarding against.
 *
 * This boundary catches any error from the canvas subtree and renders the static
 * ocean instead, so a broken live scene degrades to the gorgeous gradient rather
 * than a void. It also notifies the parent (via `onError`) so the wrapper can mark
 * the scene ready / webgl unavailable and let the loader fade.
 */

import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  /** Rendered in place of the canvas subtree once an error has been caught. */
  fallback: ReactNode;
  /** Fired once when an error is first caught, so the parent can sync state. */
  onError?: (error: Error) => void;
}

interface State {
  hasError: boolean;
}

export default class SceneErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    // Surface once for the parent; swallow otherwise so a broken background never
    // bubbles into the app. Guard the callback so a throw here can't re-trigger.
    try {
      this.props.onError?.(error);
    } catch {
      /* ignore */
    }
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}
