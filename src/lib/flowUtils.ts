import dagre from "@dagrejs/dagre";
import type { Edge, Node } from "@xyflow/react";
import type { Content } from "mdast";
import remarkParse from "remark-parse";
import { unified } from "unified";

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 172;
const nodeHeight = 36;
const getLayoutElements = (nodes: Node[], edges: Edge[]) => {
    dagreGraph.setGraph({ rankdir: "LR" });

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    nodes.forEach((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        node.position = {
            x: nodeWithPosition.x - nodeWidth / 2,
            y: nodeWithPosition.y - nodeHeight / 2,
        };
    });
    return { nodes, edges };
};

const parseMarkdownToFlowData = (markdown: string) => {
    const processor = unified().use(remarkParse);
    const parsed = processor.parse(markdown);
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    let nodeId = 1;
    const nodeStack: { id: string; depth: number }[] = [];

    function traverse(node: Content, depth = 0) {
        if (node.type === "heading" || node.type === "listItem") {
            const nodeLabel = getNodeLabel(node);
            const nodeIdStr = `node-${nodeId++}`;

            nodes.push({
                id: nodeIdStr,
                data: { label: nodeLabel },
                position: { x: 0, y: 0 },
            });

            while (nodeStack.length > 0 && nodeStack[nodeStack.length - 1]!.depth >= depth) {
                nodeStack.pop();
            }

            if (nodeStack.length > 0) {
                const parentNode = nodeStack[nodeStack.length - 1];
                if (parentNode) {
                    edges.push({
                        id: `edge-${nodeId}`,
                        source: parentNode.id,
                        target: nodeIdStr,
                        type: "smoothstep",
                    });
                }
            }

            nodeStack.push({ id: nodeIdStr, depth });

            if ('children' in node) {
                node.children.forEach((child) => traverse(child, depth + 1));
            }
        } else if (node.type === "list") {
            const listNode = node;
            listNode.children.forEach((item) => traverse(item, depth));
        } else if ('children' in node) {
            node.children.forEach((child) => traverse(child, depth));
        }
    }

    function getNodeLabel(node: Content): string {
        if (node.type === "heading") {
            return node.children
                .map((child) => ('value' in child ? child.value : ''))
                .join('') || "Empty";
        } else if (node.type === "listItem") {
            return node.children
                .map((child) => {
                    if (child.type === "paragraph") {
                        return child.children
                            .map((grandchild) => ('value' in grandchild ? grandchild.value : ''))
                            .join('');
                    } else {
                        return 'value' in child ? child.value : '';
                    }
                })
                .join('') || "Empty";
        }
        return "Empty";
    }

    parsed.children.forEach((child) => traverse(child));

    return getLayoutElements(nodes, edges);
};

export { parseMarkdownToFlowData };
