declare class TemplateLayerOverride extends TemplateLayer {
	hover: typeof TemplateLayer.prototype._hover;
	direction: number;
}

declare class MeasuredTemplateOverride extends MeasuredTemplate {
	hover: typeof MeasuredTemplate.prototype._hover;
	highlightId: string;
	document: (typeof MeasureTemplate)["document"] & { user: { id: string } };
}

declare namespace PIXI {
	declare class RectangleOverride extends PIXI.Rectangle {
		normalize(): PIXI.Rectangle;
	}
}
