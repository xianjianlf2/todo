import dagre from "@dagrejs/dagre";
import {
    Edge,
    Node
} from "@xyflow/react";
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
    const headingStack: { id: string; depth: number }[] = []; // 用于保存标题节点的栈

    function traverse(node: any, parentId: string | null = null) {
        if (node.type === "heading") {
            const nodeLabel =
                node.children.map((child: any) => child.value || "").join("") ||
                "无标题";
            const nodeIdStr = `node-${nodeId++}`;
            const headingDepth = node.depth;

            // 创建标题节点
            nodes.push({
                id: nodeIdStr,
                data: { label: nodeLabel },
                position: { x: Math.random() * 500, y: Math.random() * 500 },
            });

            // 处理栈：根据标题深度调整栈的层次
            while (
                headingStack.length > 0 &&
                headingStack[headingStack.length - 1]!.depth >= headingDepth
            ) {
                headingStack.pop(); // 当前标题比栈顶的标题层级更高或相同，弹出栈顶
            }

            // 如果栈中有标题，说明这是该标题的子标题
            if (headingStack.length > 0) {
                const parentHeading = headingStack[headingStack.length - 1];
                if (!parentHeading) return;
                edges.push({
                    id: `edge-${nodeId}`,
                    source: parentHeading.id,
                    target: nodeIdStr,
                    type: "smoothstep",
                });
            }

            // 将当前标题压入栈中
            headingStack.push({ id: nodeIdStr, depth: headingDepth });

            // 处理该标题下的子节点
            node.children.forEach((child: any) => traverse(child, nodeIdStr));
        } else if (node.type === "paragraph") {
            // 如果是段落节点，将段落中的文本拼接成一个字符串
            const textContent =
                node.children.map((child: any) => child.value || "").join("") ||
                "无内容";
            const nodeIdStr = `node-${nodeId++}`;

            // 创建段落节点
            nodes.push({
                id: nodeIdStr,
                data: { label: textContent },
                position: { x: Math.random() * 500, y: Math.random() * 500 },
            });

            // 段落的父节点应该是当前栈顶的标题
            if (headingStack.length > 0) {
                const parentHeading = headingStack[headingStack.length - 1];
                if (!parentHeading) return;
                edges.push({
                    id: `edge-${nodeId}`,
                    source: parentHeading.id,
                    target: nodeIdStr,
                    type: "smoothstep",
                });
            }
        } else if (node.type === "list") {
            // 如果是列表节点，递归处理每个列表项
            node.children.forEach((item: any) => traverse(item, parentId));
        } else if (node.type === "listItem") {
            // 对于列表项，将其内容拼接成一个节点
            const listItemContent =
                node.children
                    .map((child: any) => {
                        if (child.type === "paragraph") {
                            return child.children
                                .map((grandchild: any) => grandchild.value || "")
                                .join("");
                        } else {
                            return child.value || "";
                        }
                    })
                    .join("") || "无内容";

            const nodeIdStr = `node-${nodeId++}`;

            // 创建列表项节点
            nodes.push({
                id: nodeIdStr,
                data: { label: listItemContent },
                position: { x: Math.random() * 500, y: Math.random() * 500 },
            });

            // 列表项的父节点是当前栈顶的标题
            if (headingStack.length > 0) {
                const parentHeading = headingStack[headingStack.length - 1];
                if (!parentHeading) return;
                edges.push({
                    id: `edge-${nodeId}`,
                    source: parentHeading.id,
                    target: nodeIdStr,
                    type: "smoothstep",
                });
            }
        } else if (node.children) {
            // 如果是其他类型的节点，递归处理其子节点
            node.children.forEach((child: any) => traverse(child, parentId));
        }
    }

    // 开始遍历解析后的 Markdown AST
    traverse(parsed);

    return getLayoutElements(nodes, edges);
};

export { parseMarkdownToFlowData };
