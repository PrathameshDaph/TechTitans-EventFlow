import React, { useState } from 'react';
import { useTwin } from '../../context/TwinContext';
import { ENTITY_GRAPH_NODES, ENTITY_GRAPH_LINKS } from '../../data/demoData';
import { EntityGraphNode, EntityGraphLink } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import {
  Network,
  CloudRain,
  Users,
  Car,
  SquareParking,
  DoorClosed,
  ShieldAlert,
  Train,
  Building,
  Utensils,
  UserCheck,
  Sparkles,
  ArrowRight,
  GitCommit,
} from 'lucide-react';

export const EntityGraph: React.FC = () => {
  const { playOperationalChime, simParams, simCascade } = useTwin();
  const [selectedNodeId, setSelectedNodeId] = useState<string>('weather');

  const selectedNode = ENTITY_GRAPH_NODES.find((n) => n.id === selectedNodeId) || ENTITY_GRAPH_NODES[0];

  // Downstream ripple connections from selected node
  const downstreamLinks = ENTITY_GRAPH_LINKS.filter((l) => l.source === selectedNodeId);
  const downstreamNodeIds = new Set(downstreamLinks.map((l) => l.target));

  // Upstream feeder connections into selected node
  const upstreamLinks = ENTITY_GRAPH_LINKS.filter((l) => l.target === selectedNodeId);
  const upstreamNodeIds = new Set(upstreamLinks.map((l) => l.source));

  const getNodeIcon = (iconName: string) => {
    switch (iconName) {
      case 'CloudRain':
        return CloudRain;
      case 'Users':
        return Users;
      case 'Car':
        return Car;
      case 'SquareParking':
        return SquareParking;
      case 'DoorClosed':
        return DoorClosed;
      case 'ShieldAlert':
        return ShieldAlert;
      case 'Train':
        return Train;
      case 'Building':
        return Building;
      case 'Utensils':
        return Utensils;
      case 'UserCheck':
        return UserCheck;
      default:
        return GitCommit;
    }
  };

  // Node position map for nice radial/graph layout
  const nodeLayoutPositions: Record<string, { x: number; y: number }> = {
    weather: { x: 100, y: 220 },
    travelers: { x: 260, y: 150 },
    traffic: { x: 420, y: 110 },
    parking: { x: 580, y: 90 },
    transport: { x: 380, y: 260 },
    gates: { x: 560, y: 230 },
    venue: { x: 720, y: 220 },
    staff: { x: 520, y: 380 },
    hotels: { x: 280, y: 370 },
    restaurants: { x: 740, y: 360 },
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-3 border-b border-[#E4DED3]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-[#2B1710] font-display">
              DIGITAL TWIN ENTITY RELATIONSHIP GRAPH
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#2B1710] text-[#FFFEFB] font-bold">
              TOPOLOGICAL COUPLING
            </span>
          </div>
          <p className="text-xs text-[#756D66] font-mono">
            Interactive directional dependency topology. Click any node to trace upstream triggers and downstream cascades.
          </p>
        </div>

        <div className="text-xs font-mono text-[#756D66] bg-[#FFFEFB] px-3.5 py-1.5 rounded-lg border border-[#E4DED3]">
          Selected Node: <strong className="text-[#2B1710]">{selectedNode.label}</strong>
        </div>
      </div>

      {/* Main Graph Grid (7 cols SVG Graph + 5 cols Inspector) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Topological SVG Graph (8 cols) */}
        <div className="lg:col-span-8 glass-card rounded-2xl p-4 border border-[#E4DED3] flex flex-col items-center justify-center min-h-[540px] relative overflow-hidden">
          <div className="absolute top-4 left-4 z-10 text-[11px] font-mono bg-[#FFFEFB]/90 px-3 py-1.5 rounded-lg border border-[#E4DED3]">
            <span className="text-[#756D66]">ACTIVE FOCUS:</span>{' '}
            <strong className="text-[#2B1710] uppercase">{selectedNode.label}</strong>
          </div>

          <svg viewBox="0 0 860 480" className="w-full max-w-[840px] h-auto select-none">
            <defs>
              <marker
                id="arrowhead"
                markerWidth="8"
                markerHeight="6"
                refX="7"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#756D66" />
              </marker>
              <marker
                id="arrowhead-active"
                markerWidth="8"
                markerHeight="6"
                refX="7"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#D9822B" />
              </marker>
            </defs>

            {/* Links / Edges between Nodes */}
            <g id="graph-links">
              {ENTITY_GRAPH_LINKS.map((link, idx) => {
                const sourcePos = nodeLayoutPositions[link.source];
                const targetPos = nodeLayoutPositions[link.target];
                if (!sourcePos || !targetPos) return null;

                const isDownstreamFromSelected = link.source === selectedNodeId;
                const isUpstreamToSelected = link.target === selectedNodeId;
                const isHighlighted = isDownstreamFromSelected || isUpstreamToSelected;

                return (
                  <g key={`${link.source}-${link.target}-${idx}`}>
                    <line
                      x1={sourcePos.x}
                      y1={sourcePos.y}
                      x2={targetPos.x}
                      y2={targetPos.y}
                      stroke={
                        isDownstreamFromSelected
                          ? '#D9822B'
                          : isUpstreamToSelected
                          ? '#2B6CB0'
                          : '#E4DED3'
                      }
                      strokeWidth={isHighlighted ? 3 : 1.5}
                      strokeDasharray={isHighlighted ? '6 4' : undefined}
                      className={isHighlighted ? 'flow-anim' : ''}
                      markerEnd={isHighlighted ? 'url(#arrowhead-active)' : 'url(#arrowhead)'}
                    />
                  </g>
                );
              })}
            </g>

            {/* Nodes */}
            <g id="graph-nodes">
              {ENTITY_GRAPH_NODES.map((node) => {
                const pos = nodeLayoutPositions[node.id];
                if (!pos) return null;

                const isSelected = selectedNodeId === node.id;
                const isDownstream = downstreamNodeIds.has(node.id);
                const isUpstream = upstreamNodeIds.has(node.id);

                let ringColor = 'border-[#E4DED3]';
                let fillColor = '#FFFEFB';
                let textColor = '#2A211D';

                if (isSelected) {
                  fillColor = '#2B1710';
                  textColor = '#FFFEFB';
                } else if (isDownstream) {
                  fillColor = '#D9822B';
                  textColor = '#FFFEFB';
                } else if (isUpstream) {
                  fillColor = '#2B6CB0';
                  textColor = '#FFFEFB';
                }

                return (
                  <g
                    key={node.id}
                    className="cursor-pointer group"
                    onClick={() => {
                      playOperationalChime('click');
                      setSelectedNodeId(node.id);
                    }}
                  >
                    {/* Pulsing ring around active node */}
                    {isSelected && (
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r="32"
                        fill="none"
                        stroke="#2B1710"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                        className="animate-spin"
                        style={{ transformOrigin: `${pos.x}px ${pos.y}px` }}
                      />
                    )}

                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r="24"
                      fill={fillColor}
                      stroke={isSelected ? '#2B1710' : '#E4DED3'}
                      strokeWidth="3"
                      className="transition-all duration-200 shadow-card group-hover:scale-110"
                    />

                    <text
                      x={pos.x}
                      y={pos.y + 4}
                      textAnchor="middle"
                      fill={textColor}
                      fontSize="10"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      {node.label.slice(0, 3).toUpperCase()}
                    </text>

                    {/* Node Label Below */}
                    <text
                      x={pos.x}
                      y={pos.y + 38}
                      textAnchor="middle"
                      fill="#2A211D"
                      fontSize="10"
                      fontWeight="bold"
                      fontFamily="sans-serif"
                    >
                      {node.label}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>

          {/* Graph Legend */}
          <div className="w-full mt-2 pt-3 border-t border-[#E4DED3] flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#2B1710]" />
                <span className="text-[#756D66]">Selected Node</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#D9822B]" />
                <span className="text-[#756D66]">Downstream Ripple</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#2B6CB0]" />
                <span className="text-[#756D66]">Upstream Feeder</span>
              </div>
            </div>
            <span className="text-[#756D66]">Directional transfer coupling</span>
          </div>
        </div>

        {/* Right: Node Telemetry & Downstream Ripple Analysis (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-card rounded-2xl p-6 border border-[#E4DED3]">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#E4DED3]">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#2B1710] text-[#FFFEFB] uppercase">
                {selectedNode.category}
              </span>
              <StatusBadge level={selectedNode.status} size="sm" />
            </div>

            <h3 className="text-lg font-black text-[#2B1710] font-display mb-1">
              {selectedNode.label}
            </h3>
            <p className="text-xs text-[#756D66] font-mono mb-4 leading-relaxed">
              {selectedNode.description}
            </p>

            {/* Downstream Effects List */}
            <div className="mb-4">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#D9822B] mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                DOWNSTREAM CASCADE RECIPIENTS ({downstreamLinks.length})
              </h4>
              {downstreamLinks.length > 0 ? (
                <div className="space-y-2">
                  {downstreamLinks.map((link) => {
                    const targetNode = ENTITY_GRAPH_NODES.find((n) => n.id === link.target);
                    return (
                      <div
                        key={link.target}
                        onClick={() => setSelectedNodeId(link.target)}
                        className="p-3 rounded-xl bg-[#F7F4ED] border border-[#E4DED3] hover:border-[#D9822B] cursor-pointer transition-all text-xs font-mono"
                      >
                        <div className="flex justify-between font-bold text-[#2A211D] mb-1">
                          <span>➔ {targetNode?.label}</span>
                          <span className="text-[10px] text-[#756D66]">Weight: {link.weight}</span>
                        </div>
                        <div className="text-[11px] text-[#756D66]">{link.relationship}</div>
                        <code className="text-[10px] text-[#2B1710] bg-[#EFE8DB] px-1.5 py-0.5 rounded mt-1.5 inline-block font-mono">
                          {link.formula}
                        </code>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-xs font-mono text-[#756D66] bg-[#F7F4ED] p-3 rounded-xl border border-[#E4DED3]">
                  Terminal node in cascade chain.
                </div>
              )}
            </div>

            {/* Upstream Predecessors */}
            <div>
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#2B6CB0] mb-2">
                UPSTREAM FEEDER DEPENDENCIES ({upstreamLinks.length})
              </h4>
              {upstreamLinks.length > 0 ? (
                <div className="space-y-1.5 text-xs font-mono">
                  {upstreamLinks.map((link) => {
                    const sourceNode = ENTITY_GRAPH_NODES.find((n) => n.id === link.source);
                    return (
                      <div
                        key={link.source}
                        onClick={() => setSelectedNodeId(link.source)}
                        className="p-2.5 rounded-lg bg-[#F7F4ED] border border-[#E4DED3] hover:border-[#2B6CB0] cursor-pointer flex justify-between items-center"
                      >
                        <span>⬅ {sourceNode?.label}</span>
                        <span className="text-[10px] text-[#756D66]">{link.relationship}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-xs font-mono text-[#756D66] bg-[#F7F4ED] p-2.5 rounded-lg border border-[#E4DED3]">
                  Primary driving source node.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
