import type { ReactNode } from 'react';

const ICON_BASE_PATH = import.meta.env.VITE_ROOT_DIR + 'icon/';
const QR_BASE_PATH = import.meta.env.VITE_ROOT_DIR + 'qr/';

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
          {renderListItem('出没地点をアイコンで示し、クリックあるいはタップで詳細をモーダル表示します。')}
          {renderListItem('※アイコンの種類については後述の説明をご参照ください。')}
          {renderListItem('フィルタモーダルから年・月・状況を組み合わせて検索できます。')}
          {renderListItem('GeoJSON データは data/bears.geojson に配置したものをフェッチして利用します。')}
        </ul>
      </div>

      {/* アイコンの説明 */}
      <div className="about-card">
        <h2>アイコンの種類について</h2>
        <div>
          <ul className="about-icon-list">
            <li><img src={ICON_BASE_PATH + 'bear.svg'} width="32px" height="32px" /> 熊を目撃</li>
            <li><img src={ICON_BASE_PATH + 'like-bear.svg'} width="32px" height="32px" /> 熊らしき動物を目撃</li>
            <li><img src={ICON_BASE_PATH + 'excrement.svg'} width="32px" height="32px" /> 糞を目撃</li>
            <li><img src={ICON_BASE_PATH + 'footprint.svg'} width="32px" height="32px" /> 足跡を目撃</li>
            <li><img src={ICON_BASE_PATH + 'camera.svg'} width="32px" height="32px" /> カメラで目撃</li>
            <li><img src={ICON_BASE_PATH + 'voice.svg'} width="32px" height="32px" /> 鳴き声を聞いた</li>
            <li><img src={ICON_BASE_PATH + 'other.svg'} width="32px" height="32px" /> その他</li>
          </ul>
        </div>
        <p>
          なお、目撃情報に複数の記述が含まれる場合は、このリストの順で優先度を設定しています。
        </p>
        <p>
          例えば、「糞を目撃」と「足跡を目撃」の両方が記述されている場合、「糞を目撃」のアイコンとしています。<br/>
          この場合、糞はマーキングの目的もあり、縄張りの主張や個体間のコミュニケーションなどで利用され、人への影響が多いと考えられるため、優先度を上げています。
        </p>
      </div>

      {/* データの出典をまとめたセクション */}
      <div className="about-card">
        <h2>データの出典について</h2>
        <p>
          札幌市オープンデータ『札幌市内のヒグマ出没情報』を加工した GeoJSON を使用しています。<br/>
          原データは CC BY 4.0 ライセンスで公開されております。
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

      {/* 問い合わせについて */}
      <div className="about-card">
        <h2>お問い合わせ先</h2>
        <p>
          このサイトについてのお問い合わせ（ご質問、ご要望、ご指摘など）については、下記の連絡先へお願いいたします。
        </p>
        <div className="contact-links">
          <div className="contact-item">
            <h3>メール</h3>
            <a href="mailto:murakami77@nifty.com">murakami77@nifty.com</a>
            <div className="contact-qr">
              <img
                src={QR_BASE_PATH + 'qr_sqare_mail_nifty.png'}
                alt="メールアドレスのQRコード"
                width="128"
                height="128"
              />
            </div>
          </div>
          <div className="contact-item">
            <h3>X</h3>
            <a href="https://x.com/murakami77mm" target="_blank" rel="noreferrer">
              @murakami77mm
            </a>
            <div className="contact-qr">
              <img
                src={QR_BASE_PATH + 'qr_sqare_x_murakami77mm.png'}
                alt="X アカウントのQRコード"
                width="128"
                height="128"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPage;
