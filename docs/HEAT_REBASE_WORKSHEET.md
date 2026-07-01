# Heat Re-base Worksheet — NotebookLM (BOM/CSIRO)

Goal: replace HIVE's overstated `days_over_35/40` with BOM station climatology + CSIRO projections, per climate zone. Fill the **4 blank columns** and return the table to Claude — it will rewrite all 152 suburbs.

## Upload to NotebookLM
- **BOM Climate statistics** for each station below (bom.gov.au → Climate Data Online → search station → 'Statistics' → the row *Mean number of days ≥ 35°C* and *≥ 40°C*).
- **State climate projection reports** (for 2030/2050): AdaptNSW · Victoria's Climate Projections 2019 · Queensland Future Climate · WA/SA/TAS/NT climate projections · CSIRO *Climate Change in Australia*.

## Prompts (reuse per station / per report)
**Baseline (BOM):**
```
From the BOM climate statistics for [STATION], quote the ANNUAL mean number of days ≥ 35°C and the annual mean number of days ≥ 40°C.
```
**Projection (state report / CSIRO):**
```
For [REGION/STATION], quote the projected annual number of days ≥ 35°C for the baseline, ~2030 and ~2050, and state the emissions scenario (prefer a mid/high scenario e.g. SSP2-4.5 or RCP8.5).
```

## The 46 zones — fill BOM current / 2030 / 2050 / days≥40
| State | Zone | BOM station | #subs | HIVE now (wrong) | **BOM ≥35 now** | **≥35 2030** | **≥35 2050** | **≥40 now** |
|---|---|---|---|---|---|---|---|---|
| ACT | Canberra | Canberra Airport | 6 | 17–22 | | | | |
| NSW | Far West NSW | Broken Hill | 1 | 68–68 | | | | |
| NSW | Hunter | Cessnock | 3 | 32–36 | | | | |
| NSW | Mid North Coast | Coffs Harbour | 5 | 12–18 | | | | |
| NSW | Central West NSW | Dubbo | 3 | 20–45 | | | | |
| NSW | Capital Region | Goulburn | 1 | 19–19 | | | | |
| NSW | Northern Rivers | Lismore | 3 | 16–24 | | | | |
| NSW | Shoalhaven | Nowra | 1 | 20–20 | | | | |
| NSW | Sydney metro | Observatory Hill | 1 | 30–30 | | | | |
| NSW | W Sydney | Penrith Lakes | 7 | 33–40 | | | | |
| NSW | New England | Tamworth | 2 | 18–38 | | | | |
| NSW | Riverina | Wagga Wagga | 2 | 28–32 | | | | |
| NSW | Newcastle | Williamtown RAAF | 1 | 22–22 | | | | |
| NSW | Illawarra | Wollongong Bellambi | 2 | 14–16 | | | | |
| NT | NT Outback | Alice Springs | 11 | 85–105 | | | | |
| NT | Darwin | Darwin Airport | 2 | 92–98 | | | | |
| QLD | Ipswich | Amberley | 2 | 25–26 | | | | |
| QLD | Brisbane | Brisbane Aero | 1 | 20–20 | | | | |
| QLD | Logan | Brisbane Aero | 3 | 26–26 | | | | |
| QLD | Moreton | Brisbane Aero | 1 | 24–24 | | | | |
| QLD | Wide Bay | Bundaberg | 3 | 22–30 | | | | |
| QLD | Cairns | Cairns Aero | 3 | 55–62 | | | | |
| QLD | Mackay | Mackay | 3 | 42–45 | | | | |
| QLD | Sunshine Coast | Maroochydore | 1 | 18–18 | | | | |
| QLD | QLD Outback | Mount Isa | 4 | 82–118 | | | | |
| QLD | Darling Downs | Oakey | 3 | 40–62 | | | | |
| QLD | Central QLD | Rockhampton | 3 | 32–48 | | | | |
| QLD | Toowoomba | Toowoomba | 1 | 22–22 | | | | |
| QLD | Townsville | Townsville Aero | 2 | 65–85 | | | | |
| SA | Adelaide | Adelaide Kent Town | 6 | 34–58 | | | | |
| SA | SE SA | Mount Gambier | 4 | 14–58 | | | | |
| SA | SA Outback | Woomera | 7 | 30–90 | | | | |
| TAS | NW Tas | Devonport | 5 | 3–6 | | | | |
| TAS | Hobart | Hobart Ellerslie Rd | 5 | 6–8 | | | | |
| TAS | SE Tas | Hobart Ellerslie Rd | 1 | 6–6 | | | | |
| TAS | Launceston | Launceston Airport | 2 | 8–8 | | | | |
| VIC | Ballarat | Ballarat | 1 | 16–16 | | | | |
| VIC | Bendigo | Bendigo | 3 | 28–60 | | | | |
| VIC | Melbourne | Melbourne Olympic Park | 10 | 22–33 | | | | |
| VIC | Wimmera/Mallee | Mildura | 1 | 42–42 | | | | |
| VIC | Gippsland | Sale | 3 | 14–20 | | | | |
| VIC | Hume VIC | Wangaratta | 3 | 30–38 | | | | |
| WA | WA Outback S | Kalgoorlie-Boulder | 3 | 28–110 | | | | |
| WA | WA Wheatbelt | Merredin | 2 | 62–82 | | | | |
| WA | Perth | Perth Airport | 6 | 45–52 | | | | |
| WA | Pilbara | Port Hedland | 9 | 95–154 | | | | |

## Suburbs per zone (so you know coverage)
- **ACT · Canberra** (Canberra Airport): Tuggeranong, Gungahlin, Belconnen, Woden / Weston Creek, Molonglo / Wright, Fraser / Charnwood
- **NSW · Far West NSW** (Broken Hill): Broken Hill
- **NSW · Hunter** (Cessnock): Muswellbrook, Cessnock, Singleton
- **NSW · Mid North Coast** (Coffs Harbour): Coffs Harbour, Kempsey, Port Macquarie, Taree, Forster / Tuncurry
- **NSW · Central West NSW** (Dubbo): Dubbo, Orange, Bathurst
- **NSW · Capital Region** (Goulburn): Queanbeyan
- **NSW · Northern Rivers** (Lismore): Lismore, Grafton, Tweed Heads / Banora Point
- **NSW · Shoalhaven** (Nowra): Goulburn
- **NSW · Sydney metro** (Observatory Hill): Redfern / Waterloo
- **NSW · W Sydney** (Penrith Lakes): Mount Druitt, Campbelltown, Penrith, Liverpool, Bankstown, Claymore / Macquarie Fields, Villawood / Fairfield
- **NSW · New England** (Tamworth): Tamworth, Armidale
- **NSW · Riverina** (Wagga Wagga): Albury, Wagga Wagga
- **NSW · Newcastle** (Williamtown RAAF): Maitland
- **NSW · Illawarra** (Wollongong Bellambi): Wollongong, Nowra
- **NT · NT Outback** (Alice Springs): Alice Springs, Katherine, Tennant Creek, Nhulunbuy / Yirrkala, Jabiru, Hermannsburg / Ntaria, Alyangula (Groote Eylandt), Yuendumu, Maningrida, Wadeye (Port Keats), Borroloola
- **NT · Darwin** (Darwin Airport): Palmerston, Casuarina / Darwin
- **QLD · Ipswich** (Amberley): Goodna, Ipswich / Booval
- **QLD · Brisbane** (Brisbane Aero): Redcliffe
- **QLD · Logan** (Brisbane Aero): Logan Central, Eagleby, Woodridge / Kingston
- **QLD · Moreton** (Brisbane Aero): Caboolture / Morayfield
- **QLD · Wide Bay** (Bundaberg): Bundaberg, Hervey Bay, Maryborough
- **QLD · Cairns** (Cairns Aero): Manunda / Cairns, Mareeba, Innisfail
- **QLD · Mackay** (Mackay): Mackay, Airlie Beach / Proserpine, Bowen
- **QLD · Sunshine Coast** (Maroochydore): Caloundra / Sunshine Coast
- **QLD · QLD Outback** (Mount Isa): Mount Isa, Longreach, Winton, Mount Isa North
- **QLD · Darling Downs** (Oakey): Dalby, St George, Roma
- **QLD · Central QLD** (Rockhampton): Rockhampton, Gladstone, Emerald
- **QLD · Toowoomba** (Toowoomba): Toowoomba
- **QLD · Townsville** (Townsville Aero): Garbutt / Townsville, Charters Towers
- **SA · Adelaide** (Adelaide Kent Town): Elizabeth / Davoren Park, Morphett Vale, Salisbury, Paralowie, Gawler, Christies Beach
- **SA · SE SA** (Mount Gambier): Murray Bridge, Mount Gambier, Renmark, Berri
- **SA · SA Outback** (Woomera): Port Augusta, Whyalla, Coober Pedy, Port Pirie, Roxby Downs, Port Lincoln, Ceduna
- **TAS · NW Tas** (Devonport): Devonport, Burnie, Queenstown, Ulverstone, Smithton
- **TAS · Hobart** (Hobart Ellerslie Rd): Bridgewater / Brighton, Glenorchy, Moonah, Kingston / Kingborough, New Town
- **TAS · SE Tas** (Hobart Ellerslie Rd): Sorell
- **TAS · Launceston** (Launceston Airport): Ravenswood / Launceston, Ravenswood Heights
- **VIC · Ballarat** (Ballarat): Ballarat
- **VIC · Bendigo** (Bendigo): Bendigo, Swan Hill, Mildura
- **VIC · Melbourne** (Melbourne Olympic Park): Broadmeadows, Dandenong, Frankston, Sunshine / Brimbank, Craigieburn, Reservoir / Preston, Werribee / Wyndham, Springvale / Noble Park, Sunbury, Melton
- **VIC · Wimmera/Mallee** (Mildura): Horsham
- **VIC · Gippsland** (Sale): Moe, Sale, Warragul
- **VIC · Hume VIC** (Wangaratta): Wodonga, Shepparton, Cobram
- **WA · WA Outback S** (Kalgoorlie-Boulder): Kalgoorlie, Esperance, Meekatharra
- **WA · WA Wheatbelt** (Merredin): Geraldton, Carnarvon
- **WA · Perth** (Perth Airport): Armadale, Mirrabooka, Mandurah, Balga / Girrawheen, Rockingham, Midland
- **WA · Pilbara** (Port Hedland): Port Hedland, Broome, Karratha, Newman, Derby, Halls Creek, Marble Bar, Tom Price, Wiluna

## Return format
Give Claude the filled table (Zone → ≥35 now/2030/2050, ≥40 now). Claude maps each zone's suburbs and rewrites `days_over_35_current/2030/2050` and `days_over_40_current` for all 152, preserving each suburb's relative rank within the zone.