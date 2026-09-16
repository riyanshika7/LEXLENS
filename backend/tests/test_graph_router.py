"""Tests for Directed Clause Dependency Graph & O(E log V) Min-Heap Pathfinding."""

from backend.services.graph_router import LegalGraphRouter, GraphNode, GraphEdge, build_default_contract_graph


def test_default_graph_construction():
    """Verify default contract escalation graph initializes with nodes and edges."""
    graph = build_default_contract_graph()
    assert len(graph.nodes) >= 6
    assert "notice_inquiry" in graph.nodes
    assert "liquidated_damages" in graph.nodes
    assert "cure_window" in graph.nodes


def test_optimal_cure_pathfinding():
    """Verify Dijkstra min-heap pathfinding identifies the lowest-friction remedy path."""
    graph = build_default_contract_graph()
    result = graph.find_optimal_cure_path("notice_inquiry", "settlement_release")

    assert result is not None
    assert result.path_nodes[0] == "notice_inquiry"
    assert result.path_nodes[-1] == "settlement_release"
    assert result.total_weight > 0
    assert "O(E log V)" in result.algorithm_complexity
    assert len(result.path_titles) == len(result.path_nodes)


def test_critical_risk_pathfinding():
    """Verify worst-case liability escalation pathfinding identifies max exposure route."""
    graph = build_default_contract_graph()
    result = graph.find_critical_risk_path("notice_inquiry", "liquidated_damages")

    assert result is not None
    assert result.path_nodes[0] == "notice_inquiry"
    assert result.path_nodes[-1] == "liquidated_damages"
    # Should traverse notice -> cure_window -> default_event -> acceleration -> liquidated_damages
    assert "default_event" in result.path_nodes
    assert result.total_weight > 10.0


def test_unreachable_node_returns_none():
    """Verify disjoint graph query returns None instead of infinite loop or crash."""
    graph = LegalGraphRouter()
    graph.add_node(GraphNode(node_id="isolated_a", clause_title="Isolated A", category="General"))
    graph.add_node(GraphNode(node_id="isolated_b", clause_title="Isolated B", category="General"))

    res = graph.find_optimal_cure_path("isolated_a", "isolated_b")
    assert res is None
