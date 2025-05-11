import { Level, Segment } from './types';

export class GaugeService {
    private centerX: number = 150;
    private centerY: number = 150;
    private radius: number = 120;
    private min: number = 0;
    private max: number = 100;
    private startAngle: number = 180;
    private endAngle: number = 0;

    // Truthfulness levels
    private levels: Level[] = [
        { min: 0, max: 20, text: "COMPLETE BULLSHIT", color: "#FF0000" },
        { min: 20, max: 40, text: "MOSTLY FALSE", color: "#FF4500" },
        { min: 40, max: 60, text: "QUESTIONABLE", color: "#FFA500" },
        { min: 60, max: 80, text: "MOSTLY TRUE", color: "#FFFF00" },
        { min: 80, max: 100, text: "FACTUAL", color: "#00FF00" },
        { min: 100, max: 101, text: "ABSOLUTE TRUTH", color: "#00FF00" }
    ];
    
    // Segments for the gauge
    private segments: Segment[] = [
        { start: 0, end: 20, color: "#FF0000" },   // Red
        { start: 20, end: 40, color: "#FF4500" },  // Orange-Red
        { start: 40, end: 60, color: "#FFA500" },  // Orange
        { start: 60, end: 80, color: "#FFFF00" },  // Yellow
        { start: 80, end: 100, color: "#00FF00" }  // Green
    ];

    // Convert value to angle
    public valueToAngle(value: number): number {
        return this.startAngle - ((value - this.min) / (this.max - this.min)) * (this.startAngle - this.endAngle);
    }
    
    // Convert angle to radians
    public toRadians(angle: number): number {
        return angle * Math.PI / 180;
    }

    // Find level for a given value
    public getLevelForValue(value: number): Level | undefined {
        return this.levels.find(level => value >= level.min && value < level.max);
    }

    // Get all gauge segments
    public getSegments(): Segment[] {
        return this.segments;
    }

    // Get all information needed to draw a segment
    public getSegmentPathData(segment: Segment): {
        startX: number;
        startY: number;
        endX: number;
        endY: number;
        largeArcFlag: number;
    } {
        const startAngleRad = this.toRadians(this.valueToAngle(segment.start));
        const endAngleRad = this.toRadians(this.valueToAngle(segment.end));
        
        const startX = this.centerX + this.radius * Math.cos(startAngleRad);
        const startY = this.centerY - this.radius * Math.sin(startAngleRad);
        const endX = this.centerX + this.radius * Math.cos(endAngleRad);
        const endY = this.centerY - this.radius * Math.sin(endAngleRad);
        
        // Determine if the arc is large (>180 degrees)
        const largeArcFlag = Math.abs(segment.end - segment.start) > 50 ? 1 : 0;

        return {
            startX,
            startY,
            endX,
            endY,
            largeArcFlag
        };
    }

    // Get rotation angle for the needle
    public getNeedleRotation(value: number): number {
        const angle = this.valueToAngle(value);
        return angle - 90;
    }

    // Generate a random score
    public generateRandomScore(): number {
        return Math.floor(Math.random() * 101);
    }
}