import dagre from "@dagrejs/dagre";
import type { Edge, Node } from "@xyflow/react";
import type { Content, Heading, List, ListItem, Paragraph, Root } from "mdast";
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
    const parsed = processor.parse(markdown) as Root;
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    let nodeId = 1;
    const headingStack: { id: string; depth: number }[] = [];

    function traverse(node: Content, parentId: string | null = null) {
        if (node.type === "heading") {
            const headingNode = node as Heading;
            const nodeLabel = headingNode.children
                .map((child) => ('value' in child ? child.value : ''))
                .join('') || "Empty";
            const nodeIdStr = `node-${nodeId++}`;
            const headingDepth = headingNode.depth;

            nodes.push({
                id: nodeIdStr,
                data: { label: nodeLabel },
                position: { x: Math.random() * 500, y: Math.random() * 500 },
            });

            while (
                headingStack.length > 0 &&
                headingStack[headingStack.length - 1]!.depth >= headingDepth
            ) {
                headingStack.pop();
            }

            if (headingStack.length > 0) {
                const parentHeading = headingStack[headingStack.length - 1];
                if (parentHeading) {
                    edges.push({
                        id: `edge-${nodeId}`,
                        source: parentHeading.id,
                        target: nodeIdStr,
                        type: "smoothstep",
                    });
                }
            }

            headingStack.push({ id: nodeIdStr, depth: headingDepth });

            headingNode.children.forEach((child) => traverse(child, nodeIdStr));
        } else if (node.type === "paragraph") {
            const paragraphNode = node as Paragraph;
            const textContent = paragraphNode.children
                .map((child) => ('value' in child ? child.value : ''))
                .join('') || "无内容";
            const nodeIdStr = `node-${nodeId++}`;

            nodes.push({
                id: nodeIdStr,
                data: { label: textContent },
                position: { x: Math.random() * 500, y: Math.random() * 500 },
            });

            if (headingStack.length > 0) {
                const parentHeading = headingStack[headingStack.length - 1];
                if (parentHeading) {
                    edges.push({
                        id: `edge-${nodeId}`,
                        source: parentHeading.id,
                        target: nodeIdStr,
                        type: "smoothstep",
                    });
                }
            }
        } else if (node.type === "list") {
            const listNode = node as List;
            listNode.children.forEach((item) => traverse(item, parentId));
        } else if (node.type === "listItem") {
            const listItemNode = node as ListItem;
            const listItemContent = listItemNode.children
                .map((child) => {
                    if (child.type === "paragraph") {
                        return (child as Paragraph).children
                            .map((grandchild) => ('value' in grandchild ? grandchild.value : ''))
                            .join('');
                    } else {
                        return 'value' in child ? child.value : '';
                    }
                })
                .join('') || "无内容";

            const nodeIdStr = `node-${nodeId++}`;

            nodes.push({
                id: nodeIdStr,
                data: { label: listItemContent },
                position: { x: Math.random() * 500, y: Math.random() * 500 },
            });

            if (headingStack.length > 0) {
                const parentHeading = headingStack[headingStack.length - 1];
                if (parentHeading) {
                    edges.push({
                        id: `edge-${nodeId}`,
                        source: parentHeading.id,
                        target: nodeIdStr,
                        type: "smoothstep",
                    });
                }
            }
        } else if ('children' in node) {
            node.children.forEach((child) => traverse(child as Content, parentId));
        }
    }

    parsed.children.forEach((child) => traverse(child));

    return getLayoutElements(nodes, edges);
};

export { parseMarkdownToFlowData };
