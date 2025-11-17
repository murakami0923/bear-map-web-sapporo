import type { ReactNode } from 'react';

interface AboutPageProps {
  onNavigateHome: () => void;
}

/**
 * 「このサイトについて」ページを構築し、アプリの目的と利用データを案内する。
 *
 * @param {AboutPageProps} props マップへ戻るコールバック
 * @returns {JSX.Element} サイト概要とリンク群を含むセクション
 */
const AboutPage = ({ onNavigateHome }: AboutPageProps): JSX.Element => {
  /**
   * リストをわかりやすくするための小さなヘルパー。
   *
   * @param {ReactNode} children リスト内容
   * @returns {JSX.Element} リスト要素
   */
  const renderListItem = (children: ReactNode): JSX.Element => {
    return <li>{children}</li>;
  };

  return (
    <section className="about-page" aria-labelledby="about-page-title">
      {/* サイト概要ヘッダと戻る導線 */}
      <div className="about-page-header">
        <div>
          <p className="about-page-subtitle">/about</p>
          <h1 id="about-page-title">このサイトについて</h1>
          <p className="about-page-lead">
            熊の出没情報を地図にプロットし、札幌市内での出没状況を視覚的に確認できるツールです。
          </p>
        </div>
        <button type="button" className="primary-button" onClick={onNavigateHome}>
          マップへ戻る
        </button>
      </div>

      {/* 主な機能を説明するセクション */}
      <div className="about-card">
        <h2>主な機能</h2>
        <ul className="about-list">
          {renderListItem('OpenStreetMap タイルを背景に MapLibre で地図を表示します。')}
          {renderListItem('熊アイコン（icon/bear.svg）で出没地点を示し、クリックで詳細をモーダル表示します。')}
          {renderListItem('フィルタモーダルから年・月・状況を組み合わせて検索できます。')}
          {renderListItem('GeoJSON データは data/bears.geojson に配置したものをフェッチして利用します。')}
        </ul>
      </div>

      {/* データの出典をまとめたセクション */}
      <div className="about-card">
        <h2>データソース</h2>
        <p>
          札幌市オープンデータ『札幌市内のヒグマ出没情報』を加工した GeoJSON を使用しています。原データは
          CC BY 4.0 ライセンスで公開されており、地図タイルは OpenStreetMap contributors の提供です。
        </p>
      </div>

      {/* 利用手順の説明 */}
      <div className="about-card">
        <h2>使い方</h2>
        <ol className="about-steps">
          <li>マップをズーム・パンして関心のある地域に移動します。</li>
          <li>左上のフィルタアイコン から検索条件を入力して「絞り込む」を押します。</li>
          <li>表示された熊アイコンをクリックすると詳細を確認できます。</li>
          <li>「フィルタ解除」ボタンで条件を初期化できます。</li>
        </ol>
      </div>
    </section>
  );
};

export default AboutPage;
