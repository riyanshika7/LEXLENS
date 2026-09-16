"""Directed Clause Dependency Graph & O(E log V) Min-Heap Pathfinding Engine.

Models legal obligation sequencing, breach escalation, and optimal cure pathways
using binary min-heaps (heapq) with guaranteed O(E log V) time complexity.
"""

import heapq
from typing import Dict, List, Optional, Set, Tuple
from pydantic import BaseModel


class GraphNode(BaseModel):
    """Represents a clause node in the legal dependency graph."""
    node_id: str
    clause_title: str
    category: str
    risk_weight: float = 1.0  # Higher weight = greater financial/legal exposure
    description: str = ""


class GraphEdge(BaseModel):
    """Directed transition between clauses (e.g. Notice -> Cure -> Termination)."""
    source_id: str
    target_id: str
    condition: str
    friction_weight: float = 1.0  # Penalty / time cost to traverse


class PathResult(BaseModel):
    """Result of pathfinding through the legal graph."""
    path_nodes: List[str]
    path_titles: List[str]
    total_weight: float
    reasoning: str
    algorithm_complexity: str = "O(E log V) via Binary Min-Heap (heapq)"


class LegalGraphRouter:
    """Directed graph routing engine for contract clauses and breach escalation."""

    def __init__(self):
        self.nodes: Dict[str, GraphNode] = {}
        self.adjacency: Dict[str, List[Tuple[float, str, str]]] = {}  # source -> [(weight, target, condition)]

    def add_node(self, node: GraphNode) -> None:
        """Add a clause node to the graph."""
        self.nodes[node.node_id] = node
        if node.node_id not in self.adjacency:
            self.adjacency[node.node_id] = []

    def add_edge(self, edge: GraphEdge) -> None:
        """Add a directed edge between clause nodes."""
        if edge.source_id not in self.adjacency:
            self.adjacency[edge.source_id] = []
        self.adjacency[edge.source_id].append(
            (edge.friction_weight, edge.target_id, edge.condition)
        )

    def find_optimal_cure_path(self, start_node_id: str, target_node_id: str) -> Optional[PathResult]:
        """Find the lowest-friction cure path to remedy a breach in O(E log V) using heapq."""
        if start_node_id not in self.nodes or target_node_id not in self.nodes:
            return None

        heap: List[Tuple[float, str, List[str], List[str]]] = [
            (0.0, start_node_id, [start_node_id], [self.nodes[start_node_id].clause_title])
        ]
        visited: Set[str] = set()
        distances: Dict[str, float] = {start_node_id: 0.0}

        while heap:
            current_dist, current_node, path, titles = heapq.heappop(heap)

            if current_node in visited:
                continue
            visited.add(current_node)

            if current_node == target_node_id:
                return PathResult(
                    path_nodes=path,
                    path_titles=titles,
                    total_weight=round(current_dist, 2),
                    reasoning=f"Optimal cure trajectory identified with minimum cumulative friction ({round(current_dist, 2)}). Follow steps strictly before deadlines lapse.",
                )

            for weight, neighbor, condition in self.adjacency.get(current_node, []):
                new_dist = current_dist + weight
                if neighbor not in distances or new_dist < distances[neighbor]:
                    distances[neighbor] = new_dist
                    heapq.heappush(
                        heap,
                        (
                            new_dist,
                            neighbor,
                            path + [neighbor],
                            titles + [self.nodes.get(neighbor, GraphNode(node_id=neighbor, clause_title=neighbor, category="Unknown")).clause_title]
                        )
                    )

        return None

    def find_critical_risk_path(self, start_node_id: str, target_node_id: str) -> Optional[PathResult]:
        """Compute the highest-liability escalation path using min-heap on inverted weights in O(E log V)."""
        if start_node_id not in self.nodes or target_node_id not in self.nodes:
            return None

        heap: List[Tuple[float, str, List[str], List[str]]] = [
            (0.0, start_node_id, [start_node_id], [self.nodes[start_node_id].clause_title])
        ]
        visited: Set[str] = set()
        distances: Dict[str, float] = {start_node_id: 0.0}

        while heap:
            curr_cost, curr_node, path, titles = heapq.heappop(heap)
            if curr_node in visited:
                continue
            visited.add(curr_node)

            if curr_node == target_node_id:
                return PathResult(
                    path_nodes=path,
                    path_titles=titles,
                    total_weight=round(abs(curr_cost), 2),
                    reasoning=f"Critical escalation path exposed. Unchecked progression leads directly to maximum liability exposure ({round(abs(curr_cost), 2)}).",
                )

            for weight, neighbor, condition in self.adjacency.get(curr_node, []):
                inverted_step = -(weight + self.nodes.get(neighbor, GraphNode(node_id=neighbor, clause_title=neighbor, category="Unknown")).risk_weight)
                new_cost = curr_cost + inverted_step
                if neighbor not in distances or new_cost < distances[neighbor]:
                    distances[neighbor] = new_cost
                    heapq.heappush(
                        heap,
                        (
                            new_cost,
                            neighbor,
                            path + [neighbor],
                            titles + [self.nodes.get(neighbor, GraphNode(node_id=neighbor, clause_title=neighbor, category="Unknown")).clause_title]
                        )
                    )

        return None


def build_default_contract_graph() -> LegalGraphRouter:
    """Builds a representative legal obligation and dispute escalation graph."""
    router = LegalGraphRouter()

    nodes = [
        GraphNode(node_id="notice_inquiry", clause_title="1. Formal Notice & Delivery", category="Notice", risk_weight=1.0, description="Written communication within stipulated notice window."),
        GraphNode(node_id="cure_window", clause_title="2. Cure Period & Grace Timeline", category="Remedy", risk_weight=2.0, description="15-30 day window to rectify non-compliance without penalty."),
        GraphNode(node_id="mediation_step", clause_title="3. Informal Dispute & Mediation", category="Dispute Resolution", risk_weight=3.5, description="Mandatory good-faith mediation prior to formal litigation."),
        GraphNode(node_id="default_event", clause_title="4. Event of Default Declaration", category="Default", risk_weight=7.0, description="Declaration of material breach extinguishing cure rights."),
        GraphNode(node_id="acceleration", clause_title="5. Acceleration of Obligations", category="Remedies", risk_weight=8.5, description="Full balance of rent, fees, or deliverables becomes immediately due."),
        GraphNode(node_id="liquidated_damages", clause_title="6. Liquidated Damages & Indemnity", category="Liability", risk_weight=10.0, description="Stipulated financial damages and legal fee reimbursement."),
        GraphNode(node_id="settlement_release", clause_title="7. Mutual Release & Settlement", category="Exit", risk_weight=1.5, description="Executed settlement agreement releasing further liability."),
    ]

    for n in nodes:
        router.add_node(n)

    edges = [
        GraphEdge(source_id="notice_inquiry", target_id="cure_window", condition="Receive written notice", friction_weight=1.0),
        GraphEdge(source_id="cure_window", target_id="settlement_release", condition="Complete cure actions in time", friction_weight=1.5),
        GraphEdge(source_id="cure_window", target_id="default_event", condition="Failure to cure within deadline", friction_weight=4.0),
        GraphEdge(source_id="notice_inquiry", target_id="mediation_step", condition="Dispute validity of notice", friction_weight=2.5),
        GraphEdge(source_id="mediation_step", target_id="settlement_release", condition="Mediation reaches accord", friction_weight=2.0),
        GraphEdge(source_id="mediation_step", target_id="default_event", condition="Mediation impasse", friction_weight=4.5),
        GraphEdge(source_id="default_event", target_id="acceleration", condition="Default remains unaddressed", friction_weight=5.0),
        GraphEdge(source_id="acceleration", target_id="liquidated_damages", condition="Formal collection / litigation", friction_weight=6.0),
        GraphEdge(source_id="default_event", target_id="settlement_release", condition="Emergency negotiated settlement", friction_weight=6.5),
    ]

    for e in edges:
        router.add_edge(e)

    return router
