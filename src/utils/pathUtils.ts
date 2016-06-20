import Point = Phaser.Point;
export function linearPath(from:Point, to:Point, amount:number = 20):Point[]{
    let pathPoints = {x: [from.x, to.x], y: [from.y, to.y]};
    let path:Point[] = [];

    let w = 1 / amount;
    for (let i = 0; i <= 1; i += w) {
        let px = Phaser.Math.linearInterpolation(pathPoints.x, i);
        let py = Phaser.Math.linearInterpolation(pathPoints.y, i);

        path.push(new Point(px, py));
    }

    return path;
}