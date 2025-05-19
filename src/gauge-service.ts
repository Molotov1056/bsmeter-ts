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
        { min: 0, max: 14.28, text: "COMPLETE BULLSHIT", color: "#FF0000" },
        { min: 14.28, max: 28.57, text: "VERY FALSE", color: "#FF3300" },
        { min: 28.57, max: 42.85, text: "MOSTLY FALSE", color: "#FF6600" },
        { min: 42.85, max: 57.14, text: "QUESTIONABLE", color: "#FF9900" },
        { min: 57.14, max: 71.42, text: "PARTIALLY TRUE", color: "#FFCC00" },
        { min: 71.42, max: 85.71, text: "MOSTLY TRUE", color: "#FFFF00" },
        { min: 85.71, max: 100, text: "FACTUAL", color: "#00FF00" },
        { min: 100, max: 101, text: "ABSOLUTE TRUTH", color: "#00FF00" }
    ];
    
    // Segments for the gauge - in order from left to right (bullshit to true)
    private segments: Segment[] = [
        { start: 0, end: 14.28, color: "#FF0000" },    // Red (leftmost - bullshit)
        { start: 14.28, end: 28.57, color: "#FF3300" }, // Red-Orange
        { start: 28.57, end: 42.85, color: "#FF6600" }, // Orange-Red
        { start: 42.85, end: 57.14, color: "#FF9900" }, // Orange
        { start: 57.14, end: 71.42, color: "#FFCC00" }, // Yellow-Orange
        { start: 71.42, end: 85.71, color: "#FFFF00" }, // Yellow
        { start: 85.71, end: 100, color: "#00FF00" }    // Green (rightmost - true)
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