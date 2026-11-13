import asyncio,subprocess,sys,time
from playwright.async_api import async_playwright
srv=subprocess.Popen(["python3","-m","http.server","8765","-d",__import__("os").path.join(__import__("os").path.dirname(__import__("os").path.abspath(__file__)),"..","frontend")],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
R=[]
def ok(n,c):R.append((n,bool(c)));print(("PASS " if c else "FAIL ")+n)
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch();ctx=await b.new_context(viewport={"width":390,"height":800},device_scale_factor=2);pg=await ctx.new_page()
    errs=[];pg.on("pageerror",lambda e:errs.append(str(e)));pg.on("console",lambda m:errs.append(m.text) if m.type=="error" else None)
    await pg.goto("http://localhost:8765/index.html");await pg.wait_for_selector(".hero")
    ok("dashboard tampil",await pg.locator(".hero").count()==1)
    ok("tab bawah 5 item",await pg.locator("#tabs > *").count()==5)
    await pg.screenshot(path="/tmp/bawaulin_s_dash_m.png")
    # buat proyek
    await pg.goto("http://localhost:8765/index.html#proj");await pg.click("details.card summary");await pg.fill("#fp input[name=name]","Bawaulin.cash");await pg.fill("#fp input[name=goal]","Web");await pg.click("#fp button.btn")
    await pg.wait_for_selector(".card.tap");ok("proyek dibuat",await pg.locator(".card.tap").count()==1)
    # tugas
    await pg.goto("http://localhost:8765/index.html#task");await pg.click("details.card summary");await pg.fill("#ft input[name=title]","Tugas A");await pg.click("#ft button.btn")
    await pg.wait_for_selector("select[data-st]");await pg.select_option("select[data-st]","In Progress");await pg.wait_for_timeout(300)
    ok("status tugas berubah",await pg.locator("select[data-st]").input_value()=="In Progress")
    # approval
    await pg.goto("http://localhost:8765/index.html#appr");await pg.click("details.card summary")
    for n,v in [("action","Deploy"),("why","w"),("impact","i"),("risk","r")]:await pg.fill(f"#fa input[name={n}]",v)
    await pg.click("#fa button.btn");await pg.wait_for_selector("[data-a=ok]");ok("badge approval di tab",await pg.locator("#tabs .dot").count()==1)
    await pg.screenshot(path="/tmp/bawaulin_s_appr_m.png");await pg.click("[data-a=ok]");await pg.wait_for_timeout(300);await pg.click("[data-a=af][data-id=Disetujui]")
    ok("approval disetujui",await pg.locator(".chip.ok",has_text="Disetujui").count()>=1)
    # knowledge otomatis dari keputusan
    await pg.goto("http://localhost:8765/index.html#kb");await pg.wait_for_selector("#kl .card")
    ok("keputusan masuk Knowledge",await pg.locator("#kl .card",has_text="CEO Decision").count()==1)
    # tombol na
    await pg.goto("http://localhost:8765/index.html#gh");await pg.click("text=Connect GitHub");await pg.wait_for_selector("#toast:not([hidden])")
    ok("tombol belum tersedia memberi alasan","Belum tersedia" in await pg.inner_text("#toast"))
    # secret ditolak
    await pg.goto("http://localhost:8765/index.html#model");await pg.click("details.card summary");await pg.fill("#fm input[name=name]","P");await pg.fill("#fm input[name=model]","sk-abcdefghijklmnop12345");await pg.click("#fm button.btn")
    await pg.wait_for_selector("#toast:not([hidden])");ok("API key ditolak","Ditolak" in await pg.inner_text("#toast"))
    await pg.fill("#fm input[name=model]","model-x");await pg.click("#fm button.btn");await pg.wait_for_selector(".card:has-text('Koneksi: Belum Terhubung')");ok("provider tersimpan, status jujur",True)
    # more sheet + semua modul
    await pg.goto("http://localhost:8765/index.html#dash");await pg.click("[data-a=more]");await pg.wait_for_selector(".grid4");ok("sheet Lainnya memuat 14 modul",await pg.locator(".grid4 a").count()==14)
    await pg.screenshot(path="/tmp/bawaulin_s_more_m.png");await pg.click("[data-a=close].scrim",position={"x":5,"y":5})
    for m in ["dash","cmd","org","emp","task","proj","files","kb","model","gh","appr","fin","sec","set"]:
      await pg.goto(f"http://localhost:8765/index.html#{m}");await pg.wait_for_timeout(120)
      ok(f"modul {m} tampil",await pg.locator("#main").inner_text()!="" )
    # employee sheet
    await pg.goto("http://localhost:8765/index.html#emp");await pg.click("#el .card.tap >> nth=8");await pg.wait_for_selector("#fe");ok("detail karyawan",await pg.locator("#fe").count()==1)
    await pg.screenshot(path="/tmp/bawaulin_s_emp_m.png");await pg.click("#fe input[value=read_proj]");await pg.click("#fe button.btn");await pg.wait_for_timeout(300)
    # persist reload
    await pg.reload();await pg.wait_for_timeout(500);await pg.goto("http://localhost:8765/index.html#proj");await pg.wait_for_selector(".card.tap")
    ok("data tetap ada setelah reload (IndexedDB)",await pg.locator(".card.tap",has_text="Bawaulin.cash").count()==1)
    # finance
    await pg.goto("http://localhost:8765/index.html#fin");await pg.fill("#fb input[name=monthly]","1000");await pg.click("#fb button.btn");await pg.wait_for_timeout(200)
    await pg.click("details.card summary");await pg.fill("#fx input[name=label]","API");await pg.fill("#fx input[name=amount]","900");await pg.click("#fx button.btn");await pg.wait_for_selector(".banner.warn")
    ok("peringatan anggaran muncul",True);await pg.screenshot(path="/tmp/bawaulin_s_fin_m.png")
    # SW + offline
    await pg.goto("http://localhost:8765/index.html");await pg.evaluate("navigator.serviceWorker.ready");await pg.reload();await pg.wait_for_timeout(500)
    await ctx.set_offline(True);await pg.reload();await pg.wait_for_selector(".hero");ok("offline: aplikasi tetap terbuka",True)
    ok("chip Offline",await pg.locator("#hd .chip",has_text="Offline").count()==1);await ctx.set_offline(False)
    # desktop
    d=await b.new_context(viewport={"width":1280,"height":800});dp=await d.new_page();await dp.goto("http://localhost:8765/index.html#dash");await dp.wait_for_selector(".hero")
    ok("desktop: sidebar tampil, tab bawah tersembunyi",await dp.locator("#side").is_visible() and not await dp.locator("#tabs").is_visible())
    await dp.screenshot(path="/tmp/bawaulin_s_dash_d.png");await dp.goto("http://localhost:8765/index.html#org");await dp.wait_for_timeout(200);await dp.screenshot(path="/tmp/bawaulin_s_org_d.png")
    # tidak ada overflow horizontal di HP
    for m in ["dash","gh","sec","fin","model"]:
      await pg.goto(f"http://localhost:8765/index.html#{m}");await pg.wait_for_timeout(150)
      ok(f"tanpa scroll horizontal: {m}",await pg.evaluate("document.documentElement.scrollWidth<=window.innerWidth+1"))
    ok("tanpa error JS/console",not [x for x in errs if "favicon" not in x]);print(errs[:5])
    await b.close()
asyncio.run(main());srv.terminate()
print("TOTAL",sum(1 for _,c in R if c),"/",len(R))
