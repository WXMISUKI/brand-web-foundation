# 官方来源媒体审计与替换记录（2026-11-09）

## 来源与抓取结果

- 画册来源：<https://flbook.com.cn/c/LTc82gQQM3>，24 个 viewer 页面，产品文字、规格和页面裁剪仍以此来源为主。
- 原官网来源：<http://m.zgkomu.cn>。用户提供的 `https://www.m.zgkomu.cn` 当前 TLS 握手失败，HTTP 页面可访问并返回 200；页面包含产品中心、核心技术、关于我们、联系我们和产品详情页。
- 原官网产品详情页范围：`/display/754917.html`–`/display/754932.html`，并补充首页产品卡片和首页移动横幅接口 `/banner?mode=jsMobile&defaultBannerId=8397`。
- 只读取官方页面与图片，不提交表单、不写回原官网。

## 替换前问题与当前状态

生产只读审计（首页、产品目录/详情、新闻、知识、案例）发现 45 个 `img` 标签、24 个唯一媒体 URL、15 个唯一 SHA-256：

- 替换前，Hero、分类、方案、文章和案例背景指向 `/images/generated/*` 或 `field-hero-prototype`，属于生成/示例素材；本轮代码已移除这些路径的引用，磁盘中的 generated PNG 仅作为未使用遗留素材保留。
- 替换前生产媒体存在页面复用和同内容哈希重复：`greenhouse-growing-1.png` 与 `greenhouse-growing.png` 相同；`open-field-growing-1.png`、`open-field-growing-2.png` 与 `open-field-growing.png` 相同。页面复用与内容错误重复需要分开验收。
- 产品主图在首页、列表和详情中的重复是同一产品跨页面复用，不属于错误重复；其中 7 条已具备原官网一一对应的独立产品卡图，另 3 条继续保留 FLBOOK 裁剪图。

## 已落盘的官方素材

官方素材已复制到 `public/images/official-site/`，文件名与来源保持稳定：

- `hero-01.jpg`、`hero-02.jpg`、`hero-03.jpg`：原官网首页 `/banner?mode=jsMobile&defaultBannerId=8397` 接口返回的移动横幅；由于横幅由 JS 接口加载，未出现在静态首页 HTML 的 42 个图片 URL 中，但已保存来源接口和本地文件。
- `company-products.jpg`、`company-laboratory.jpg`、`company-research.jpg`、`contact-office.jpg`、`technology.jpg`：原官网首页/关于/联系/核心技术页面图片。
- `product-non-water-soluble.jpg`、`product-organic-peptide.jpg`、`product-organic-fulvic.jpg`、`product-organic-fish-peptide-protein.jpg`、`product-organic-fish-peptide-bacteria.jpg`、`product-suspended-120.jpg`、`product-suspended-200.jpg`：可与现有 10 条 FLBOOK 产品稳定对应的原官网产品卡图。

7 个产品图与原官网远程文件已做 SHA-256 对照，均为字节级一致；再与 FLBOOK 第 6、8、9、10、12、14、16 页的包装视觉逐项并排复核，包装颜色、容器/袋型和产品标识均一致。5 个公司/技术图片也已做同样对照。3 个横幅通过官方 banner 接口抓取并保存，保留接口 URL 作为来源证据。

## 替换映射

| 当前 slug | 文字/规格主来源 | 官方图片来源 | 处理 |
| --- | --- | --- | --- |
| `medium-element-granular-draft` | FLBOOK 6–7 页 | 原官网 `/display/754923.html` | 已替换为官方产品图 |
| `organic-water-soluble-growth-draft` | FLBOOK 第 8 页 | 原官网 `/display/754921.html` | 已替换为官方产品图 |
| `organic-water-soluble-quality-draft` | FLBOOK 第 9 页 | 原官网 `/display/754926.html` | 已替换为官方产品图 |
| `organic-water-soluble-absorption-draft` | FLBOOK 第 10 页 | 原官网 `/display/754931.html` | 已替换为官方产品图 |
| `organic-water-soluble-root-draft` | FLBOOK 第 12 页 | 原官网 `/display/754932.html` | 已替换为官方产品图 |
| `suspended-fertilizer-120-60-400-draft` | FLBOOK 14–15 页 | 原官网 `/display/754918.html` | 已替换为官方产品图 |
| `suspended-fertilizer-200-150-200-draft` | FLBOOK 16–17 页 | 原官网 `/display/754919.html` | 已替换为官方产品图 |
| `massive-element-liquid-quality-draft` | FLBOOK 第 18 页 | FLBOOK 第 18 页裁剪图 | 保留，原官网无稳定同名产品 |
| `medium-element-liquid-draft` | FLBOOK 第 20 页 | FLBOOK 第 20 页裁剪图 | 保留，原官网无稳定同名产品 |
| `organic-inorganic-compound-draft` | FLBOOK 第 22 页 | FLBOOK 第 22 页裁剪图 | 保留，避免把旧站其他复合肥型号误绑 |

产品文字、规格、页码和审核状态没有因图片替换而放宽；`owner-review` 与 `claimsVerified=false` 保持不变。

## 不能自动合并的内容

- 原官网有 30 余个产品详情，而 FLBOOK 当前只提供 10 条主产品资料。旧站产品不能在没有型号、包装、规格和停产状态核对的情况下批量追加到当前目录。
- 原官网没有可核验的新闻、知识文章或真实案例正文。当前这些栏目仍是站内编辑结构示例；本轮只替换其图片来源，不把示例标题宣称为原官网事实。
- 原官网首页横幅是中文移动站素材，已作为官方视觉素材使用；其文案不直接作为英文/中文产品 claims。
- 企业页已采用原官网“科研、开发、生产、销售 / 蚌埠淮上工业园区 / 2014 年”范围内的谨慎双语描述；员工、面积、服务时效等旧站数字未写入正式内容，继续保持待核验。
- Contact 页已接入原官网地址的英中版本；电话/WhatsApp 仍分别遵循业主当前提供的 WhatsApp 联系方式，未把旧站固定电话替换为新的业务渠道。

## 下一步验收

1. 本地运行 `npm run validate:flbook`、`npm run validate:content`、`npm run typecheck`。
2. 备份生产 PostgreSQL 与 Payload media 后，定向更新首页/公司媒体和 7 条产品媒体关系，禁止全量重导。
3. 公网回读 `/en`、`/zh`、产品目录/详情、新闻/知识/案例，确认无 `/images/generated/*`、无根横向溢出、无错误图片和错误 alt。
4. 旧站新增型号、真实新闻/案例和正式 claims 继续保持 `owner-review`，等待逐条业务确认。

## 公网媒体门禁

新增 `npm run audit:public-media`，当前生产运行结果：扫描 14 个英文/中文公开页面（含 About）、18 个唯一媒体 URL，无 HTTP 图片错误、无 generated/prototype 公网引用、无序列化 alt、无内容哈希重复。产品主图在首页/目录/详情之间的重复属于同一产品的页面复用，不是同一媒体内容被错误替代。

## 原官网候选产品清单

新增 `npm run extract:official-candidates`，从原官网产品中心提取 28 条官方候选产品，落盘到 `src/data/official-site-product-candidates.json`。候选项只包含官方名称、详情 URL、官方图片 URL、`owner-review` 和 `published:false`，没有写入 Payload 或公开目录；其中与当前 FLBOOK 10 条产品重合的项目仅作为来源交叉索引，额外型号仍需型号、包装、规格和停产状态审核。`npm run check:official-candidates` 已验证 28/28 详情页和 28/28 图片 URL 返回 HTTP 200。

候选审核包见 [official-site-candidate-review-packet-2026-11-09.md](official-site-candidate-review-packet-2026-11-09.md)，已标出 3 组同名冲突：有机水溶肥料-多肽、复合肥料 16-16-16、大量元素水溶肥。它们不能仅按名称合并。

`npm run test:official-candidates` 已加入合同测试，确保候选数量、官方来源 URL、owner-review、published:false 和 3 组同名冲突不会在后续刷新时漂移。
