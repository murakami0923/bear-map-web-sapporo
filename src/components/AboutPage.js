import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * 「このサイトについて」ページを構築し、アプリの目的と利用データを案内する。
 *
 * @param {AboutPageProps} props マップへ戻るコールバック
 * @returns {JSX.Element} サイト概要とリンク群を含むセクション
 */
const AboutPage = ({ onNavigateHome }) => {
    /**
     * リストをわかりやすくするための小さなヘルパー。
     *
     * @param {ReactNode} children リスト内容
     * @returns {JSX.Element} リスト要素
     */
    const renderListItem = (children) => {
        return _jsx("li", { children: children });
    };
    return (_jsxs("section", { className: "about-page", "aria-labelledby": "about-page-title", children: [_jsxs("div", { className: "about-page-header", children: [_jsxs("div", { children: [_jsx("p", { className: "about-page-subtitle", children: "/about" }), _jsx("h1", { id: "about-page-title", children: "\u3053\u306E\u30B5\u30A4\u30C8\u306B\u3064\u3044\u3066" }), _jsx("p", { className: "about-page-lead", children: "\u718A\u306E\u51FA\u6CA1\u60C5\u5831\u3092\u5730\u56F3\u306B\u30D7\u30ED\u30C3\u30C8\u3057\u3001\u672D\u5E4C\u5E02\u5185\u3067\u306E\u51FA\u6CA1\u72B6\u6CC1\u3092\u8996\u899A\u7684\u306B\u78BA\u8A8D\u3067\u304D\u308B\u30C4\u30FC\u30EB\u3067\u3059\u3002" })] }), _jsx("button", { type: "button", className: "primary-button", onClick: onNavigateHome, children: "\u30DE\u30C3\u30D7\u3078\u623B\u308B" })] }), _jsxs("div", { className: "about-card", children: [_jsx("h2", { children: "\u4E3B\u306A\u6A5F\u80FD" }), _jsxs("ul", { className: "about-list", children: [renderListItem('OpenStreetMap タイルを背景に MapLibre で地図を表示します。'), renderListItem('熊アイコン（icon/bear.svg）で出没地点を示し、クリックで詳細をモーダル表示します。'), renderListItem('フィルタモーダルから年・月・状況を組み合わせて検索できます。'), renderListItem('GeoJSON データは data/bears.geojson に配置したものをフェッチして利用します。')] })] }), _jsxs("div", { className: "about-card", children: [_jsx("h2", { children: "\u30C7\u30FC\u30BF\u30BD\u30FC\u30B9" }), _jsx("p", { children: "\u672D\u5E4C\u5E02\u30AA\u30FC\u30D7\u30F3\u30C7\u30FC\u30BF\u300E\u672D\u5E4C\u5E02\u5185\u306E\u30D2\u30B0\u30DE\u51FA\u6CA1\u60C5\u5831\u300F\u3092\u52A0\u5DE5\u3057\u305F GeoJSON \u3092\u4F7F\u7528\u3057\u3066\u3044\u307E\u3059\u3002\u539F\u30C7\u30FC\u30BF\u306F CC BY 4.0 \u30E9\u30A4\u30BB\u30F3\u30B9\u3067\u516C\u958B\u3055\u308C\u3066\u304A\u308A\u3001\u5730\u56F3\u30BF\u30A4\u30EB\u306F OpenStreetMap contributors \u306E\u63D0\u4F9B\u3067\u3059\u3002" })] }), _jsxs("div", { className: "about-card", children: [_jsx("h2", { children: "\u4F7F\u3044\u65B9" }), _jsxs("ol", { className: "about-steps", children: [_jsx("li", { children: "\u30DE\u30C3\u30D7\u3092\u30BA\u30FC\u30E0\u30FB\u30D1\u30F3\u3057\u3066\u95A2\u5FC3\u306E\u3042\u308B\u5730\u57DF\u306B\u79FB\u52D5\u3057\u307E\u3059\u3002" }), _jsx("li", { children: "\u5DE6\u4E0A\u306E\u30D5\u30A3\u30EB\u30BF\u30A2\u30A4\u30B3\u30F3 \u304B\u3089\u691C\u7D22\u6761\u4EF6\u3092\u5165\u529B\u3057\u3066\u300C\u7D5E\u308A\u8FBC\u3080\u300D\u3092\u62BC\u3057\u307E\u3059\u3002" }), _jsx("li", { children: "\u8868\u793A\u3055\u308C\u305F\u718A\u30A2\u30A4\u30B3\u30F3\u3092\u30AF\u30EA\u30C3\u30AF\u3059\u308B\u3068\u8A73\u7D30\u3092\u78BA\u8A8D\u3067\u304D\u307E\u3059\u3002" }), _jsx("li", { children: "\u300C\u30D5\u30A3\u30EB\u30BF\u89E3\u9664\u300D\u30DC\u30BF\u30F3\u3067\u6761\u4EF6\u3092\u521D\u671F\u5316\u3067\u304D\u307E\u3059\u3002" })] })] })] }));
};
export default AboutPage;
