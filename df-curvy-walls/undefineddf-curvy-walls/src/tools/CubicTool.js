import { BezierTool, ToolMode } from './BezierTool.js';
import { PointArrayInputHandler, PointInputHandler, InitializerInputHandler, MagnetPointInputHandler } from "./ToolInputHandler.js";
const pointNearPoint = BezierTool.pointNearPoint;
class InitializerIH extends InitializerInputHandler {
	constructor(tool, success, fail) {
		super(tool.lineA, tool.lineB, success, fail);
		this.tool = tool;
	}
	move(origin, destination, event) {
		super.move(origin, destination, event);
		var dx = this.tool.lineB.x - this.tool.lineA.x;
		var dy = this.tool.lineB.y - this.tool.lineA.y;
		const length = Math.sqrt((dx * dx) + (dy * dy));
		dx /= length;
		dy /= length;
		const barLength = length * (2 / 3);
		this.tool.controlA.set(this.tool.lineA.x + (dy * barLength), this.tool.lineA.y + (-dx * barLength));
		this.tool.controlB.set(this.tool.lineB.x + (dy * barLength), this.tool.lineB.y + (-dx * barLength));
	}
}
export default class CubicTool extends BezierTool {
	constructor() {
		super(...arguments);
		this.lineA = new PIXI.Point();
		this.lineB = new PIXI.Point();
		this.controlA = new PIXI.Point();
		this.controlB = new PIXI.Point();
	}
	get handles() { return [this.lineA, this.controlA, this.controlB, this.lineB]; }
	get bounds() {
		const b = new PIXI.Bounds();
		b.addPoint(this.lineA);
		b.addPoint(this.lineB);
		b.addPoint(this.controlA);
		b.addPoint(this.controlB);
		return b;
	}
	get polygon() { return new PIXI.Polygon([this.lineA, this.lineB, this.controlA, this.controlB]); }
	initialPoints() { return [0, 0, 0, 0, 0, 0, 0, 0]; }
	drawHandles(context) {
		if (this.mode == ToolMode.NotPlaced)
			return;
		this.drawBoundingBox(context);
		context.beginFill(0xffaacc)
			.lineStyle(BezierTool.LINE_SIZE, 0xffaacc, 1, 0.5)
			.moveTo(this.lineA.x, this.lineA.y)
			.lineTo(this.controlA.x, this.controlA.y)
			.moveTo(this.lineB.x, this.lineB.y)
			.lineTo(this.controlB.x, this.controlB.y)
			.endFill();
		super.drawSegmentLabel(context);
		this.drawHandle(context, 0xff4444, this.lineA);
		this.drawHandle(context, 0xff4444, this.lineB);
		this.drawHandle(context, 0xaaff44, this.controlA);
		this.drawHandle(context, 0xaaff44, this.controlB);
	}
	checkPointForDrag(point) {
		if (this.mode == ToolMode.NotPlaced) {
			this.setMode(ToolMode.Placing);
			return new InitializerIH(this, () => this.setMode(ToolMode.Placed), () => this.setMode(ToolMode.NotPlaced));
		}
		if (pointNearPoint(point, this.lineA, BezierTool.HANDLE_RADIUS))
			return CubicTool.lockHandles
				? new MagnetPointInputHandler(this.lineA, this.controlA)
				: new PointInputHandler(this.lineA);
		else if (pointNearPoint(point, this.lineB, BezierTool.HANDLE_RADIUS))
			return CubicTool.lockHandles
				? new MagnetPointInputHandler(this.lineB, this.controlB)
				: new PointInputHandler(this.lineB);
		else if (pointNearPoint(point, this.controlA, BezierTool.HANDLE_RADIUS))
			return new PointInputHandler(this.controlA);
		else if (pointNearPoint(point, this.controlB, BezierTool.HANDLE_RADIUS))
			return new PointInputHandler(this.controlB);
		else if (this.polygon.contains(point.x, point.y))
			return new PointArrayInputHandler(point, this.handles);
		return null;
	}
	getTools() {
		return [
			{
				icon: 'fas fa-lock',
				name: 'cubiclock',
				title: 'df-curvy-walls.cubic_lock_handles',
				class: 'toggle' + (CubicTool.lockHandles ? ' active' : ''),
				style: 'display:none',
				onClick: (button) => {
					var enabled = button.hasClass('active');
					CubicTool.lockHandles = !enabled;
					if (enabled)
						button.removeClass('active');
					else
						button.addClass('active');
				}
			}
		];
	}
	showTools() {
		$(`button[data-tool="cubiclock"]`).show();
	}
	hideTools() {
		$(`button[data-tool="cubiclock"]`).hide();
	}
}
CubicTool.lockHandles = true;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2RmLWN1cnZ5LXdhbGxzL3NyYy90b29scy9DdWJpY1Rvb2wudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUN2RCxPQUFPLEVBQUUsc0JBQXNCLEVBQWdCLGlCQUFpQixFQUFFLHVCQUF1QixFQUFFLHVCQUF1QixFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFFbEosTUFBTSxjQUFjLEdBQUcsVUFBVSxDQUFDLGNBQWMsQ0FBQztBQUdqRCxNQUFNLGFBQWMsU0FBUSx1QkFBdUI7SUFFbEQsWUFBWSxJQUFlLEVBQUUsT0FBbUIsRUFBRSxJQUFnQjtRQUNqRSxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQTtRQUM1QyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUNsQixDQUFDO0lBQ0QsSUFBSSxDQUFDLE1BQWEsRUFBRSxXQUFrQixFQUFFLEtBQTRCO1FBQ25FLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLFdBQVcsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN2QyxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQy9DLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDL0MsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2hELEVBQUUsSUFBSSxNQUFNLENBQUM7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QUFFLFFBQVEsR0FBRyxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO2dCQUMxRCxLQUFLLEVBQUUsY0FBYztnQkFDckIsT0FBTyxFQUFFLENBQUMsTUFBaUMsRUFBRSxFQUFFO29CQUM5QyxJQUFJLE9BQU8sR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUN4QyxTQUFTLENBQUMsV0FBVyxHQUFHLENBQUMsT0FBTyxDQUFDO29CQUNqQyxJQUFJLE9BQU87d0JBQ1YsTUFBTSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQzs7d0JBRTdCLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQzVCLENBQUM7YUFDRDtTQUNELENBQUM7SUFDSCxDQUFDO0lBQ0QsU0FBUztRQUNSLENBQUMsQ0FBQywrQkFBK0IsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQzNDLENBQUM7SUFDRCxTQUFTO1FBQ1IsQ0FBQyxDQUFDLCtCQUErQixDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDM0MsQ0FBQzs7QUFoRk0scUJBQVcsR0FBRyxJQUFJLENBQUMiLCJmaWxlIjoidG9vbHMvQ3ViaWNUb29sLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQgeyBUb29sVUkgfSBmcm9tICcuLi9CZXppZXJUb29sQmFyLmpzJztcbmltcG9ydCB7IEJlemllclRvb2wsIFRvb2xNb2RlIH0gZnJvbSAnLi9CZXppZXJUb29sLmpzJztcbmltcG9ydCB7IFBvaW50QXJyYXlJbnB1dEhhbmRsZXIsIElucHV0SGFuZGxlciwgUG9pbnRJbnB1dEhhbmRsZXIsIEluaXRpYWxpemVySW5wdXRIYW5kbGVyLCBNYWduZXRQb2ludElucHV0SGFuZGxlciB9IGZyb20gXCIuL1Rvb2xJbnB1dEhhbmRsZXIuanNcIjtcblxuY29uc3QgcG9pbnROZWFyUG9pbnQgPSBCZXppZXJUb29sLnBvaW50TmVhclBvaW50O1xuZGVjbGFyZSB0eXBlIFBvaW50ID0gUElYSS5Qb2ludDtcblxuY2xhc3MgSW5pdGlhbGl6ZXJJSCBleHRlbmRzIEluaXRpYWxpemVySW5wdXRIYW5kbGVyIHtcblx0cHJpdmF0ZSB0b29sOiBDdWJpY1Rvb2w7XG5cdGNvbnN0cnVjdG9yKHRvb2w6IEN1YmljVG9vbCwgc3VjY2VzczogKCkgPT4gdm9pZCwgZmFpbDogKCkgPT4gdm9pZCkge1xuXHRcdHN1cGVyKHRvb2wubGluZUEsIHRvb2wubGluZUIsIHN1Y2Nlc3MsIGZhaWwpXG5cdFx0dGhpcy50b29sID0gdG9vbDtcblx0fVxuXHRtb3ZlKG9yaWdpbjogUG9pbnQsIGRlc3RpbmF0aW9uOiBQb2ludCwgZXZlbnQ6IFBJWEkuSW50ZXJhY3Rpb25FdmVudCk6IHZvaWQge1xuXHRcdHN1cGVyLm1vdmUob3JpZ2luLCBkZXN0aW5hdGlvbiwgZXZlbnQpO1xuXHRcdHZhciBkeCA9IHRoaXMudG9vbC5saW5lQi54IC0gdGhpcy50b29sLmxpbmVBLng7XG5cdFx0dmFyIGR5ID0gdGhpcy50b29sLmxpbmVCLnkgLSB0aGlzLnRvb2wubGluZUEueTtcblx0XHRjb25zdCBsZW5ndGggPSBNYXRoLnNxcnQoKGR4ICogZHgpICsgKGR5ICogZHkpKTtcblx0XHRkeCAvPSBsZW5ndGg7XG5cdFx0ZHkgLz0gbGVuZ3RoO1xuXHRcdGNvbnN0IGJhckxlbmd0aCA9IGxlbmd0aCAqICgyIC8gMyk7XG5cdFx0dGhpcy50b29sLmNvbnRyb2xBLnNldCh0aGlzLnRvb2wubGluZUEueCArIChkeSAqIGJhckxlbmd0aCksIHRoaXMudG9vbC5saW5lQS55ICsgKC1keCAqIGJhckxlbmd0aCkpO1xuXHRcdHRoaXMudG9vbC5jb250cm9sQi5zZXQodGhpcy50b29sLmxpbmVCLnggKyAoZHkgKiBiYXJMZW5ndGgpLCB0aGlzLnRvb2wubGluZUIueSArICgtZHggKiBiYXJMZW5ndGgpKTtcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDdWJpY1Rvb2wgZXh0ZW5kcyBCZXppZXJUb29sIHtcblx0c3RhdGljIGxvY2tIYW5kbGVzID0gdHJ1ZTtcblx0bGluZUEgPSBuZXcgUElYSS5Qb2ludCgpO1xuXHRsaW5lQiA9IG5ldyBQSVhJLlBvaW50KCk7XG5cdGNvbnRyb2xBID0gbmV3IFBJWEkuUG9pbnQoKTtcblx0Y29udHJvbEIgPSBuZXcgUElYSS5Qb2ludCgpO1xuXG5cdGdldCBoYW5kbGVzKCk6IFBvaW50W10geyByZXR1cm4gW3RoaXMubGluZUEsIHRoaXMuY29udHJvbEEsIHRoaXMuY29udHJvbEIsIHRoaXMubGluZUJdOyB9XG5cdGdldCBib3VuZHMoKTogUElYSS5Cb3VuZHMge1xuXHRcdGNvbnN0IGIgPSBuZXcgUElYSS5Cb3VuZHMoKTtcblx0XHRiLmFkZFBvaW50KHRoaXMubGluZUEpO1xuXHRcdGIuYWRkUG9pbnQodGhpcy5saW5lQik7XG5cdFx0Yi5hZGRQb2ludCh0aGlzLmNvbnRyb2xBKTtcblx0XHRiLmFkZFBvaW50KHRoaXMuY29udHJvbEIpO1xuXHRcdHJldHVybiBiO1xuXHR9XG5cdGdldCBwb2x5Z29uKCk6IFBJWEkuUG9seWdvbiB7IHJldHVybiBuZXcgUElYSS5Qb2x5Z29uKFt0aGlzLmxpbmVBLCB0aGlzLmxpbmVCLCB0aGlzLmNvbnRyb2xBLCB0aGlzLmNvbnRyb2xCXSk7IH1cblxuXHRpbml0aWFsUG9pbnRzKCk6IG51bWJlcltdIHsgcmV0dXJuIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwXTsgfVxuXHRkcmF3SGFuZGxlcyhjb250ZXh0OiBQSVhJLkdyYXBoaWNzKTogdm9pZCB7XG5cdFx0aWYgKHRoaXMubW9kZSA9PSBUb29sTW9kZS5Ob3RQbGFjZWQpIHJldHVybjtcblx0XHR0aGlzLmRyYXdCb3VuZGluZ0JveChjb250ZXh0KTtcblx0XHRjb250ZXh0LmJlZ2luRmlsbCgweGZmYWFjYylcblx0XHRcdC5saW5lU3R5bGUoQmV6aWVyVG9vbC5MSU5FX1NJWkUsIDB4ZmZhYWNjLCAxLCAwLjUpXG5cdFx0XHQubW92ZVRvKHRoaXMubGluZUEueCwgdGhpcy5saW5lQS55KVxuXHRcdFx0LmxpbmVUbyh0aGlzLmNvbnRyb2xBLngsIHRoaXMuY29udHJvbEEueSlcblx0XHRcdC5tb3ZlVG8odGhpcy5saW5lQi54LCB0aGlzLmxpbmVCLnkpXG5cdFx0XHQubGluZVRvKHRoaXMuY29udHJvbEIueCwgdGhpcy5jb250cm9sQi55KVxuXHRcdFx0LmVuZEZpbGwoKTtcblx0XHRzdXBlci5kcmF3U2VnbWVudExhYmVsKGNvbnRleHQpO1xuXHRcdHRoaXMuZHJhd0hhbmRsZShjb250ZXh0LCAweGZmNDQ0NCwgdGhpcy5saW5lQSk7XG5cdFx0dGhpcy5kcmF3SGFuZGxlKGNvbnRleHQsIDB4ZmY0NDQ0LCB0aGlzLmxpbmVCKTtcblx0XHR0aGlzLmRyYXdIYW5kbGUoY29udGV4dCwgMHhhYWZmNDQsIHRoaXMuY29udHJvbEEpO1xuXHRcdHRoaXMuZHJhd0hhbmRsZShjb250ZXh0LCAweGFhZmY0NCwgdGhpcy5jb250cm9sQik7XG5cdH1cblx0Y2hlY2tQb2ludEZvckRyYWcocG9pbnQ6IFBvaW50KTogSW5wdXRIYW5kbGVyIHwgbnVsbCB7XG5cdFx0aWYgKHRoaXMubW9kZSA9PSBUb29sTW9kZS5Ob3RQbGFjZWQpIHtcblx0XHRcdHRoaXMuc2V0TW9kZShUb29sTW9kZS5QbGFjaW5nKTtcblx0XHRcdHJldHVybiBuZXcgSW5pdGlhbGl6ZXJJSCh0aGlzLCAoKSA9PiB0aGlzLnNldE1vZGUoVG9vbE1vZGUuUGxhY2VkKSwgKCkgPT4gdGhpcy5zZXRNb2RlKFRvb2xNb2RlLk5vdFBsYWNlZCkpO1xuXHRcdH1cblx0XHRpZiAocG9pbnROZWFyUG9pbnQocG9pbnQsIHRoaXMubGluZUEsIEJlemllclRvb2wuSEFORExFX1JBRElVUykpXG5cdFx0XHRyZXR1cm4gQ3ViaWNUb29sLmxvY2tIYW5kbGVzXG5cdFx0XHRcdD8gbmV3IE1hZ25ldFBvaW50SW5wdXRIYW5kbGVyKHRoaXMubGluZUEsIHRoaXMuY29udHJvbEEpXG5cdFx0XHRcdDogbmV3IFBvaW50SW5wdXRIYW5kbGVyKHRoaXMubGluZUEpO1xuXHRcdGVsc2UgaWYgKHBvaW50TmVhclBvaW50KHBvaW50LCB0aGlzLmxpbmVCLCBCZXppZXJUb29sLkhBTkRMRV9SQURJVVMpKVxuXHRcdFx0cmV0dXJuIEN1YmljVG9vbC5sb2NrSGFuZGxlc1xuXHRcdFx0XHQ/IG5ldyBNYWduZXRQb2ludElucHV0SGFuZGxlcih0aGlzLmxpbmVCLCB0aGlzLmNvbnRyb2xCKVxuXHRcdFx0XHQ6IG5ldyBQb2ludElucHV0SGFuZGxlcih0aGlzLmxpbmVCKTtcblx0XHRlbHNlIGlmIChwb2ludE5lYXJQb2ludChwb2ludCwgdGhpcy5jb250cm9sQSwgQmV6aWVyVG9vbC5IQU5ETEVfUkFESVVTKSlcblx0XHRcdHJldHVybiBuZXcgUG9pbnRJbnB1dEhhbmRsZXIodGhpcy5jb250cm9sQSk7XG5cdFx0ZWxzZSBpZiAocG9pbnROZWFyUG9pbnQocG9pbnQsIHRoaXMuY29udHJvbEIsIEJlemllclRvb2wuSEFORExFX1JBRElVUykpXG5cdFx0XHRyZXR1cm4gbmV3IFBvaW50SW5wdXRIYW5kbGVyKHRoaXMuY29udHJvbEIpO1xuXHRcdGVsc2UgaWYgKHRoaXMucG9seWdvbi5jb250YWlucyhwb2ludC54LCBwb2ludC55KSlcblx0XHRcdHJldHVybiBuZXcgUG9pbnRBcnJheUlucHV0SGFuZGxlcihwb2ludCwgdGhpcy5oYW5kbGVzKTtcblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXG5cdGdldFRvb2xzKCk6IFRvb2xVSVtdIHtcblx0XHRyZXR1cm4gW1xuXHRcdFx0e1xuXHRcdFx0XHRpY29uOiAnZmFzIGZhLWxvY2snLFxuXHRcdFx0XHRuYW1lOiAnY3ViaWNsb2NrJyxcblx0XHRcdFx0dGl0bGU6ICdkZi1jdXJ2eS13YWxscy5jdWJpY19sb2NrX2hhbmRsZXMnLFxuXHRcdFx0XHRjbGFzczogJ3RvZ2dsZScgKyAoQ3ViaWNUb29sLmxvY2tIYW5kbGVzID8gJyBhY3RpdmUnIDogJycpLFxuXHRcdFx0XHRzdHlsZTogJ2Rpc3BsYXk6bm9uZScsXG5cdFx0XHRcdG9uQ2xpY2s6IChidXR0b246IEpRdWVyeTxIVE1MQnV0dG9uRWxlbWVudD4pID0+IHtcblx0XHRcdFx0XHR2YXIgZW5hYmxlZCA9IGJ1dHRvbi5oYXNDbGFzcygnYWN0aXZlJyk7XG5cdFx0XHRcdFx0Q3ViaWNUb29sLmxvY2tIYW5kbGVzID0gIWVuYWJsZWQ7XG5cdFx0XHRcdFx0aWYgKGVuYWJsZWQpXG5cdFx0XHRcdFx0XHRidXR0b24ucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdGJ1dHRvbi5hZGRDbGFzcygnYWN0aXZlJyk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRdO1xuXHR9XG5cdHNob3dUb29scygpIHtcblx0XHQkKGBidXR0b25bZGF0YS10b29sPVwiY3ViaWNsb2NrXCJdYCkuc2hvdygpO1xuXHR9XG5cdGhpZGVUb29scygpIHtcblx0XHQkKGBidXR0b25bZGF0YS10b29sPVwiY3ViaWNsb2NrXCJdYCkuaGlkZSgpO1xuXHR9XG59Il19
