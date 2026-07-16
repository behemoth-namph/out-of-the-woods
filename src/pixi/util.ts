import type { Container } from "pixi.js";
import gsap from "gsap";

/**
 * Kill every GSAP tween targeting a display object and its whole subtree,
 * including the `.scale` / `.position` Points that GSAP may animate directly.
 * MUST be called before destroying/removing an animated object, otherwise a
 * looping/delayed tween keeps ticking and reads `.y` off a nulled transform
 * ("Cannot read properties of null (reading 'y')").
 */
export function killTweensDeep(node: Container | null | undefined) {
  if (!node) return;
  gsap.killTweensOf(node);
  if (node.scale) gsap.killTweensOf(node.scale);
  if (node.position) gsap.killTweensOf(node.position);
  const kids = node.children ? [...node.children] : [];
  for (const k of kids) killTweensDeep(k as Container);
}

/** Kill tweens on the subtree, then remove & destroy all children of `node`. */
export function clearChildren(node: Container) {
  for (const k of [...node.children]) killTweensDeep(k as Container);
  const removed = node.removeChildren();
  for (const c of removed) c.destroy({ children: true });
}
