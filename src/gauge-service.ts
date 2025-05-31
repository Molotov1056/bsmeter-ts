import { Level, Segment } from './types';

export class GaugeService {
    private centerX: number = 200;
    private centerY: number = 200;
    private radius: number = 160;
    private min: number = 0;
    private max: number = 100;
    private startAngle: number = 180;
    private endAngle: number = 0;

    // Truthfulness levels - 5 categories with muted colors
    private levels: Level[] = [
        { min: 0, max: 20, text: "BULLSHIT", color: "#E53E3E" },        // Muted Red
        { min: 20, max: 40, text: "MOSTLY FALSE", color: "#FF8C00" },   // Muted Orange
        { min: 40, max: 60, text: "QUESTIONABLE", color: "#F6AD55" },   // Muted Yellow-Orange
        { min: 60, max: 80, text: "MOSTLY TRUE", color: "#68D391" },    // Muted Green
        { min: 80, max: 100, text: "FACTUAL", color: "#38A169" }        // Muted Dark Green
    ];
    
    // Segments for the gauge - 5 segments with muted colors
    private segments: Segment[] = [
        { start: 0, end: 20, color: "#E53E3E" },      // BULLSHIT - Muted Red
        { start: 20, end: 40, color: "#FF8C00" },     // MOSTLY FALSE - Muted Orange
        { start: 40, end: 60, color: "#F6AD55" },     // QUESTIONABLE - Muted Yellow-Orange
        { start: 60, end: 80, color: "#68D391" },     // MOSTLY TRUE - Muted Green
        { start: 80, end: 100, color: "#38A169" }     // FACTUAL - Muted Dark Green
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

    // Get label position for a segment
    public getSegmentLabelPosition(segment: Segment): { x: number; y: number; rotation: number } {
        const midValue = (segment.start + segment.end) / 2;
        const angle = this.valueToAngle(midValue);
        const angleRad = this.toRadians(angle);
        
        // Position label at 70% of radius for better readability
        const labelRadius = this.radius * 0.7;
        const x = this.centerX + labelRadius * Math.cos(angleRad);
        const y = this.centerY - labelRadius * Math.sin(angleRad);
        
        // Calculate rotation for text (make it readable)
        let rotation = angle - 90;
        if (rotation > 90) rotation -= 180;
        if (rotation < -90) rotation += 180;
        
        return { x, y, rotation };
    }

    // Get short label text for segments
    public getSegmentShortLabel(segment: Segment): string {
        const level = this.levels.find(l => l.min === segment.start);
        if (!level) return '';
        
        switch (level.text) {
            case 'BULLSHIT': return 'BS';
            case 'MOSTLY FALSE': return 'FALSE';
            case 'QUESTIONABLE': return '?';
            case 'MOSTLY TRUE': return 'TRUE';
            case 'FACTUAL': return 'FACT';
            default: return '';
        }
    }
}