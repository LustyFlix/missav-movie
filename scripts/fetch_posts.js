const fs = require("fs");
const path = require("path");
const xml2js = require("xml2js");
const cheerio = require("cheerio");

const FLARESOLVERR_URL = "https://mabelle-supervenient-talitha.ngrok-free.dev/v1";

const SITEMAP_URLS = [
  'https://missav.ws/sitemap_items_1.xml',
  'https://missav.ws/sitemap_items_2.xml',
  'https://missav.ws/sitemap_items_3.xml',
  'https://missav.ws/sitemap_items_4.xml',
  'https://missav.ws/sitemap_items_5.xml',
  'https://missav.ws/sitemap_items_6.xml',
  'https://missav.ws/sitemap_items_7.xml',
  'https://missav.ws/sitemap_items_8.xml',
  'https://missav.ws/sitemap_items_9.xml',
  'https://missav.ws/sitemap_items_10.xml',
  'https://missav.ws/sitemap_items_11.xml',
  'https://missav.ws/sitemap_items_12.xml',
  'https://missav.ws/sitemap_items_13.xml',
  'https://missav.ws/sitemap_items_14.xml',
  'https://missav.ws/sitemap_items_15.xml',
  'https://missav.ws/sitemap_items_16.xml',
  'https://missav.ws/sitemap_items_17.xml',
  'https://missav.ws/sitemap_items_18.xml',
  'https://missav.ws/sitemap_items_19.xml',
  'https://missav.ws/sitemap_items_20.xml',
  'https://missav.ws/sitemap_items_21.xml',
  'https://missav.ws/sitemap_items_22.xml',
  'https://missav.ws/sitemap_items_23.xml',
  'https://missav.ws/sitemap_items_24.xml',
  'https://missav.ws/sitemap_items_25.xml',
  'https://missav.ws/sitemap_items_26.xml',
  'https://missav.ws/sitemap_items_27.xml',
  'https://missav.ws/sitemap_items_28.xml',
  'https://missav.ws/sitemap_items_29.xml',
  'https://missav.ws/sitemap_items_30.xml',
  'https://missav.ws/sitemap_items_31.xml',
  'https://missav.ws/sitemap_items_32.xml',
  'https://missav.ws/sitemap_items_33.xml',
  'https://missav.ws/sitemap_items_34.xml',
  'https://missav.ws/sitemap_items_35.xml',
  'https://missav.ws/sitemap_items_36.xml',
  'https://missav.ws/sitemap_items_37.xml',
  'https://missav.ws/sitemap_items_38.xml',
  'https://missav.ws/sitemap_items_39.xml',
  'https://missav.ws/sitemap_items_40.xml',
  'https://missav.ws/sitemap_items_41.xml',
  'https://missav.ws/sitemap_items_42.xml',
  'https://missav.ws/sitemap_items_43.xml',
  'https://missav.ws/sitemap_items_44.xml',
  'https://missav.ws/sitemap_items_45.xml',
  'https://missav.ws/sitemap_items_46.xml',
  'https://missav.ws/sitemap_items_47.xml',
  'https://missav.ws/sitemap_items_48.xml',
  'https://missav.ws/sitemap_items_49.xml',
  'https://missav.ws/sitemap_items_50.xml',
  'https://missav.ws/sitemap_items_51.xml',
  'https://missav.ws/sitemap_items_52.xml',
  'https://missav.ws/sitemap_items_53.xml',
  'https://missav.ws/sitemap_items_54.xml',
  'https://missav.ws/sitemap_items_55.xml',
  'https://missav.ws/sitemap_items_56.xml',
  'https://missav.ws/sitemap_items_57.xml',
  'https://missav.ws/sitemap_items_58.xml',
  'https://missav.ws/sitemap_items_59.xml',
  'https://missav.ws/sitemap_items_60.xml',
  'https://missav.ws/sitemap_items_61.xml',
  'https://missav.ws/sitemap_items_62.xml',
  'https://missav.ws/sitemap_items_63.xml',
  'https://missav.ws/sitemap_items_64.xml',
  'https://missav.ws/sitemap_items_65.xml',
  'https://missav.ws/sitemap_items_66.xml',
  'https://missav.ws/sitemap_items_67.xml',
  'https://missav.ws/sitemap_items_68.xml',
  'https://missav.ws/sitemap_items_69.xml',
  'https://missav.ws/sitemap_items_70.xml',
  'https://missav.ws/sitemap_items_71.xml',
  'https://missav.ws/sitemap_items_72.xml',
  'https://missav.ws/sitemap_items_73.xml',
  'https://missav.ws/sitemap_items_74.xml',
  'https://missav.ws/sitemap_items_75.xml',
  'https://missav.ws/sitemap_items_76.xml',
  'https://missav.ws/sitemap_items_77.xml',
  'https://missav.ws/sitemap_items_78.xml',
  'https://missav.ws/sitemap_items_79.xml',
  'https://missav.ws/sitemap_items_80.xml',
  'https://missav.ws/sitemap_items_81.xml',
  'https://missav.ws/sitemap_items_82.xml',
  'https://missav.ws/sitemap_items_83.xml',
  'https://missav.ws/sitemap_items_84.xml',
  'https://missav.ws/sitemap_items_85.xml',
  'https://missav.ws/sitemap_items_86.xml',
  'https://missav.ws/sitemap_items_87.xml',
  'https://missav.ws/sitemap_items_88.xml',
  'https://missav.ws/sitemap_items_89.xml',
  'https://missav.ws/sitemap_items_90.xml',
  'https://missav.ws/sitemap_items_91.xml',
  'https://missav.ws/sitemap_items_92.xml',
  'https://missav.ws/sitemap_items_93.xml',
  'https://missav.ws/sitemap_items_94.xml',
  'https://missav.ws/sitemap_items_95.xml',
  'https://missav.ws/sitemap_items_96.xml',
  'https://missav.ws/sitemap_items_97.xml',
  'https://missav.ws/sitemap_items_98.xml',
  'https://missav.ws/sitemap_items_99.xml',
  'https://missav.ws/sitemap_items_100.xml',
  'https://missav.ws/sitemap_items_101.xml',
  'https://missav.ws/sitemap_items_102.xml',
  'https://missav.ws/sitemap_items_103.xml',
  'https://missav.ws/sitemap_items_104.xml',
  'https://missav.ws/sitemap_items_105.xml',
  'https://missav.ws/sitemap_items_106.xml',
  'https://missav.ws/sitemap_items_107.xml',
  'https://missav.ws/sitemap_items_108.xml',
  'https://missav.ws/sitemap_items_109.xml',
  'https://missav.ws/sitemap_items_110.xml',
  'https://missav.ws/sitemap_items_111.xml',
  'https://missav.ws/sitemap_items_112.xml',
  'https://missav.ws/sitemap_items_113.xml',
  'https://missav.ws/sitemap_items_114.xml',
  'https://missav.ws/sitemap_items_115.xml',
  'https://missav.ws/sitemap_items_116.xml',
  'https://missav.ws/sitemap_items_117.xml',
  'https://missav.ws/sitemap_items_118.xml',
  'https://missav.ws/sitemap_items_119.xml',
  'https://missav.ws/sitemap_items_120.xml',
  'https://missav.ws/sitemap_items_121.xml',
  'https://missav.ws/sitemap_items_122.xml',
  'https://missav.ws/sitemap_items_123.xml',
  'https://missav.ws/sitemap_items_124.xml',
  'https://missav.ws/sitemap_items_125.xml',
  'https://missav.ws/sitemap_items_126.xml',
  'https://missav.ws/sitemap_items_127.xml',
  'https://missav.ws/sitemap_items_128.xml',
  'https://missav.ws/sitemap_items_129.xml',
  'https://missav.ws/sitemap_items_130.xml',
  'https://missav.ws/sitemap_items_131.xml',
  'https://missav.ws/sitemap_items_132.xml',
  'https://missav.ws/sitemap_items_133.xml',
  'https://missav.ws/sitemap_items_134.xml',
  'https://missav.ws/sitemap_items_135.xml',
  'https://missav.ws/sitemap_items_136.xml',
  'https://missav.ws/sitemap_items_137.xml',
  'https://missav.ws/sitemap_items_138.xml',
  'https://missav.ws/sitemap_items_139.xml',
  'https://missav.ws/sitemap_items_140.xml',
  'https://missav.ws/sitemap_items_141.xml',
  'https://missav.ws/sitemap_items_142.xml',
  'https://missav.ws/sitemap_items_143.xml',
  'https://missav.ws/sitemap_items_144.xml',
  'https://missav.ws/sitemap_items_145.xml',
  'https://missav.ws/sitemap_items_146.xml',
  'https://missav.ws/sitemap_items_147.xml',
  'https://missav.ws/sitemap_items_148.xml',
  'https://missav.ws/sitemap_items_149.xml',
  'https://missav.ws/sitemap_items_150.xml',
  'https://missav.ws/sitemap_items_151.xml',
  'https://missav.ws/sitemap_items_152.xml',
  'https://missav.ws/sitemap_items_153.xml',
  'https://missav.ws/sitemap_items_154.xml',
  'https://missav.ws/sitemap_items_155.xml',
  'https://missav.ws/sitemap_items_156.xml',
  'https://missav.ws/sitemap_items_157.xml',
  'https://missav.ws/sitemap_items_158.xml',
  'https://missav.ws/sitemap_items_159.xml',
  'https://missav.ws/sitemap_items_160.xml',
  'https://missav.ws/sitemap_items_161.xml',
  'https://missav.ws/sitemap_items_162.xml',
  'https://missav.ws/sitemap_items_163.xml',
  'https://missav.ws/sitemap_items_164.xml',
  'https://missav.ws/sitemap_items_165.xml',
  'https://missav.ws/sitemap_items_166.xml',
  'https://missav.ws/sitemap_items_167.xml',
  'https://missav.ws/sitemap_items_168.xml',
  'https://missav.ws/sitemap_items_169.xml',
  'https://missav.ws/sitemap_items_170.xml',
  'https://missav.ws/sitemap_items_171.xml',
  'https://missav.ws/sitemap_items_172.xml',
  'https://missav.ws/sitemap_items_173.xml',
  'https://missav.ws/sitemap_items_174.xml',
  'https://missav.ws/sitemap_items_175.xml',
  'https://missav.ws/sitemap_items_176.xml',
  'https://missav.ws/sitemap_items_177.xml',
  'https://missav.ws/sitemap_items_178.xml',
  'https://missav.ws/sitemap_items_179.xml',
  'https://missav.ws/sitemap_items_180.xml',
  'https://missav.ws/sitemap_items_181.xml',
  'https://missav.ws/sitemap_items_182.xml',
  'https://missav.ws/sitemap_items_183.xml',
  'https://missav.ws/sitemap_items_184.xml',
  'https://missav.ws/sitemap_items_185.xml',
  'https://missav.ws/sitemap_items_186.xml',
  'https://missav.ws/sitemap_items_187.xml',
  'https://missav.ws/sitemap_items_188.xml',
  'https://missav.ws/sitemap_items_189.xml',
  'https://missav.ws/sitemap_items_190.xml',
  'https://missav.ws/sitemap_items_191.xml',
  'https://missav.ws/sitemap_items_192.xml',
  'https://missav.ws/sitemap_items_193.xml',
  'https://missav.ws/sitemap_items_194.xml',
  'https://missav.ws/sitemap_items_195.xml',
  'https://missav.ws/sitemap_items_196.xml',
  'https://missav.ws/sitemap_items_197.xml',
  'https://missav.ws/sitemap_items_198.xml',
  'https://missav.ws/sitemap_items_199.xml',
  'https://missav.ws/sitemap_items_200.xml',
  'https://missav.ws/sitemap_items_201.xml',
  'https://missav.ws/sitemap_items_202.xml',
  'https://missav.ws/sitemap_items_203.xml',
  'https://missav.ws/sitemap_items_204.xml',
  'https://missav.ws/sitemap_items_205.xml',
  'https://missav.ws/sitemap_items_206.xml',
  'https://missav.ws/sitemap_items_207.xml',
  'https://missav.ws/sitemap_items_208.xml',
  'https://missav.ws/sitemap_items_209.xml',
  'https://missav.ws/sitemap_items_210.xml',
  'https://missav.ws/sitemap_items_211.xml',
  'https://missav.ws/sitemap_items_212.xml',
  'https://missav.ws/sitemap_items_213.xml',
  'https://missav.ws/sitemap_items_214.xml',
  'https://missav.ws/sitemap_items_215.xml',
  'https://missav.ws/sitemap_items_216.xml',
  'https://missav.ws/sitemap_items_217.xml',
  'https://missav.ws/sitemap_items_218.xml',
  'https://missav.ws/sitemap_items_219.xml',
  'https://missav.ws/sitemap_items_220.xml',
  'https://missav.ws/sitemap_items_221.xml',
  'https://missav.ws/sitemap_items_222.xml',
  'https://missav.ws/sitemap_items_223.xml',
  'https://missav.ws/sitemap_items_224.xml',
  'https://missav.ws/sitemap_items_225.xml',
  'https://missav.ws/sitemap_items_226.xml',
  'https://missav.ws/sitemap_items_227.xml',
  'https://missav.ws/sitemap_items_228.xml',
  'https://missav.ws/sitemap_items_229.xml',
  'https://missav.ws/sitemap_items_230.xml',
  'https://missav.ws/sitemap_items_231.xml',
  'https://missav.ws/sitemap_items_232.xml',
  'https://missav.ws/sitemap_items_233.xml',
  'https://missav.ws/sitemap_items_234.xml',
  'https://missav.ws/sitemap_items_235.xml',
  'https://missav.ws/sitemap_items_236.xml',
  'https://missav.ws/sitemap_items_237.xml',
  'https://missav.ws/sitemap_items_238.xml',
  'https://missav.ws/sitemap_items_239.xml',
  'https://missav.ws/sitemap_items_240.xml',
  'https://missav.ws/sitemap_items_241.xml',
  'https://missav.ws/sitemap_items_242.xml',
  'https://missav.ws/sitemap_items_243.xml',
  'https://missav.ws/sitemap_items_244.xml',
  'https://missav.ws/sitemap_items_245.xml',
  'https://missav.ws/sitemap_items_246.xml',
  'https://missav.ws/sitemap_items_247.xml',
  'https://missav.ws/sitemap_items_248.xml',
  'https://missav.ws/sitemap_items_249.xml',
  'https://missav.ws/sitemap_items_250.xml',
  'https://missav.ws/sitemap_items_251.xml',
  'https://missav.ws/sitemap_items_252.xml',
  'https://missav.ws/sitemap_items_253.xml',
  'https://missav.ws/sitemap_items_254.xml',
  'https://missav.ws/sitemap_items_255.xml',
  'https://missav.ws/sitemap_items_256.xml',
  'https://missav.ws/sitemap_items_257.xml',
  'https://missav.ws/sitemap_items_258.xml',
  'https://missav.ws/sitemap_items_259.xml',
  'https://missav.ws/sitemap_items_260.xml',
  'https://missav.ws/sitemap_items_261.xml',
  'https://missav.ws/sitemap_items_262.xml',
  'https://missav.ws/sitemap_items_263.xml',
  'https://missav.ws/sitemap_items_264.xml',
  'https://missav.ws/sitemap_items_265.xml',
  'https://missav.ws/sitemap_items_266.xml',
  'https://missav.ws/sitemap_items_267.xml',
  'https://missav.ws/sitemap_items_268.xml',
  'https://missav.ws/sitemap_items_269.xml',
  'https://missav.ws/sitemap_items_270.xml',
  'https://missav.ws/sitemap_items_271.xml',
  'https://missav.ws/sitemap_items_272.xml',
  'https://missav.ws/sitemap_items_273.xml',
  'https://missav.ws/sitemap_items_274.xml',
  'https://missav.ws/sitemap_items_275.xml',
  'https://missav.ws/sitemap_items_276.xml',
  'https://missav.ws/sitemap_items_277.xml',
  'https://missav.ws/sitemap_items_278.xml',
  'https://missav.ws/sitemap_items_279.xml',
  'https://missav.ws/sitemap_items_280.xml',
  'https://missav.ws/sitemap_items_281.xml',
  'https://missav.ws/sitemap_items_282.xml',
  'https://missav.ws/sitemap_items_283.xml',
  'https://missav.ws/sitemap_items_284.xml',
  'https://missav.ws/sitemap_items_285.xml',
  'https://missav.ws/sitemap_items_286.xml',
  'https://missav.ws/sitemap_items_287.xml',
  'https://missav.ws/sitemap_items_288.xml',
  'https://missav.ws/sitemap_items_289.xml',
  'https://missav.ws/sitemap_items_290.xml',
  'https://missav.ws/sitemap_items_291.xml',
  'https://missav.ws/sitemap_items_292.xml',
  'https://missav.ws/sitemap_items_293.xml',
  'https://missav.ws/sitemap_items_294.xml',
  'https://missav.ws/sitemap_items_295.xml',
  'https://missav.ws/sitemap_items_296.xml',
  'https://missav.ws/sitemap_items_297.xml',
  'https://missav.ws/sitemap_items_298.xml',
  'https://missav.ws/sitemap_items_299.xml',
  'https://missav.ws/sitemap_items_300.xml',
  'https://missav.ws/sitemap_items_301.xml',
  'https://missav.ws/sitemap_items_302.xml',
  'https://missav.ws/sitemap_items_303.xml',
  'https://missav.ws/sitemap_items_304.xml',
  'https://missav.ws/sitemap_items_305.xml',
  'https://missav.ws/sitemap_items_306.xml',
  'https://missav.ws/sitemap_items_307.xml',
  'https://missav.ws/sitemap_items_308.xml',
  'https://missav.ws/sitemap_items_309.xml',
  'https://missav.ws/sitemap_items_310.xml',
  'https://missav.ws/sitemap_items_311.xml',
  'https://missav.ws/sitemap_items_312.xml',
  'https://missav.ws/sitemap_items_313.xml',
  'https://missav.ws/sitemap_items_314.xml',
  'https://missav.ws/sitemap_items_315.xml',
  'https://missav.ws/sitemap_items_316.xml',
  'https://missav.ws/sitemap_items_317.xml',
  'https://missav.ws/sitemap_items_318.xml',
  'https://missav.ws/sitemap_items_319.xml',
  'https://missav.ws/sitemap_items_320.xml',
  'https://missav.ws/sitemap_items_321.xml',
  'https://missav.ws/sitemap_items_322.xml',
  'https://missav.ws/sitemap_items_323.xml',
  'https://missav.ws/sitemap_items_324.xml',
  'https://missav.ws/sitemap_items_325.xml',
  'https://missav.ws/sitemap_items_326.xml',
  'https://missav.ws/sitemap_items_327.xml',
  'https://missav.ws/sitemap_items_328.xml',
  'https://missav.ws/sitemap_items_329.xml',
  'https://missav.ws/sitemap_items_330.xml',
  'https://missav.ws/sitemap_items_331.xml',
  'https://missav.ws/sitemap_items_332.xml',
  'https://missav.ws/sitemap_items_333.xml',
  'https://missav.ws/sitemap_items_334.xml',
  'https://missav.ws/sitemap_items_335.xml',
  'https://missav.ws/sitemap_items_336.xml',
  'https://missav.ws/sitemap_items_337.xml',
  'https://missav.ws/sitemap_items_338.xml',
  'https://missav.ws/sitemap_items_339.xml',
  'https://missav.ws/sitemap_items_340.xml',
  'https://missav.ws/sitemap_items_341.xml',
  'https://missav.ws/sitemap_items_342.xml',
  'https://missav.ws/sitemap_items_343.xml',
  'https://missav.ws/sitemap_items_344.xml',
  'https://missav.ws/sitemap_items_345.xml',
  'https://missav.ws/sitemap_items_346.xml',
  'https://missav.ws/sitemap_items_347.xml',
  'https://missav.ws/sitemap_items_348.xml',
  'https://missav.ws/sitemap_items_349.xml',
  'https://missav.ws/sitemap_items_350.xml',
  'https://missav.ws/sitemap_items_351.xml',
  'https://missav.ws/sitemap_items_352.xml',
  'https://missav.ws/sitemap_items_353.xml',
  'https://missav.ws/sitemap_items_354.xml',
  'https://missav.ws/sitemap_items_355.xml',
  'https://missav.ws/sitemap_items_356.xml',
  'https://missav.ws/sitemap_items_357.xml',
  'https://missav.ws/sitemap_items_358.xml',
  'https://missav.ws/sitemap_items_359.xml',
  'https://missav.ws/sitemap_items_360.xml',
  'https://missav.ws/sitemap_items_361.xml',
  'https://missav.ws/sitemap_items_362.xml',
  'https://missav.ws/sitemap_items_363.xml',
  'https://missav.ws/sitemap_items_364.xml',
  'https://missav.ws/sitemap_items_365.xml',
  'https://missav.ws/sitemap_items_366.xml',
  'https://missav.ws/sitemap_items_367.xml',
  'https://missav.ws/sitemap_items_368.xml',
  'https://missav.ws/sitemap_items_369.xml',
  'https://missav.ws/sitemap_items_370.xml',
  'https://missav.ws/sitemap_items_371.xml',
  'https://missav.ws/sitemap_items_372.xml',
  'https://missav.ws/sitemap_items_373.xml',
  'https://missav.ws/sitemap_items_374.xml',
  'https://missav.ws/sitemap_items_375.xml',
  'https://missav.ws/sitemap_items_376.xml',
  'https://missav.ws/sitemap_items_377.xml',
  'https://missav.ws/sitemap_items_378.xml',
  'https://missav.ws/sitemap_items_379.xml',
  'https://missav.ws/sitemap_items_380.xml',
  'https://missav.ws/sitemap_items_381.xml',
  'https://missav.ws/sitemap_items_382.xml',
  'https://missav.ws/sitemap_items_383.xml',
  'https://missav.ws/sitemap_items_384.xml',
  'https://missav.ws/sitemap_items_385.xml',
  'https://missav.ws/sitemap_items_386.xml',
  'https://missav.ws/sitemap_items_387.xml',
  'https://missav.ws/sitemap_items_388.xml',
  'https://missav.ws/sitemap_items_389.xml',
  'https://missav.ws/sitemap_items_390.xml',
  'https://missav.ws/sitemap_items_391.xml',
  'https://missav.ws/sitemap_items_392.xml',
  'https://missav.ws/sitemap_items_393.xml',
  'https://missav.ws/sitemap_items_394.xml',
  'https://missav.ws/sitemap_items_395.xml',
  'https://missav.ws/sitemap_items_396.xml',
  'https://missav.ws/sitemap_items_397.xml',
  'https://missav.ws/sitemap_items_398.xml',
  'https://missav.ws/sitemap_items_399.xml',
  'https://missav.ws/sitemap_items_400.xml',
  'https://missav.ws/sitemap_items_401.xml',
  'https://missav.ws/sitemap_items_402.xml',
  'https://missav.ws/sitemap_items_403.xml',
  'https://missav.ws/sitemap_items_404.xml',
  'https://missav.ws/sitemap_items_405.xml',
  'https://missav.ws/sitemap_items_406.xml',
  'https://missav.ws/sitemap_items_407.xml',
  'https://missav.ws/sitemap_items_408.xml',
  'https://missav.ws/sitemap_items_409.xml',
  'https://missav.ws/sitemap_items_410.xml',
  'https://missav.ws/sitemap_items_411.xml',
  'https://missav.ws/sitemap_items_412.xml',
  'https://missav.ws/sitemap_items_413.xml',
  'https://missav.ws/sitemap_items_414.xml',
  'https://missav.ws/sitemap_items_415.xml',
  'https://missav.ws/sitemap_items_416.xml',
  'https://missav.ws/sitemap_items_417.xml',
  'https://missav.ws/sitemap_items_418.xml',
  'https://missav.ws/sitemap_items_419.xml',
  'https://missav.ws/sitemap_items_420.xml',
  'https://missav.ws/sitemap_items_421.xml',
  'https://missav.ws/sitemap_items_422.xml',
  'https://missav.ws/sitemap_items_423.xml',
  'https://missav.ws/sitemap_items_424.xml',
  'https://missav.ws/sitemap_items_425.xml',
  'https://missav.ws/sitemap_items_426.xml',
  'https://missav.ws/sitemap_items_427.xml',
  'https://missav.ws/sitemap_items_428.xml',
  'https://missav.ws/sitemap_items_429.xml',
  'https://missav.ws/sitemap_items_430.xml',
  'https://missav.ws/sitemap_items_431.xml',
  'https://missav.ws/sitemap_items_432.xml',
  'https://missav.ws/sitemap_items_433.xml',
  'https://missav.ws/sitemap_items_434.xml',
  'https://missav.ws/sitemap_items_435.xml',
  'https://missav.ws/sitemap_items_436.xml',
  'https://missav.ws/sitemap_items_437.xml',
  'https://missav.ws/sitemap_items_438.xml',
  'https://missav.ws/sitemap_items_439.xml',
  'https://missav.ws/sitemap_items_440.xml',
  'https://missav.ws/sitemap_items_441.xml',
  'https://missav.ws/sitemap_items_442.xml',
  'https://missav.ws/sitemap_items_443.xml',
  'https://missav.ws/sitemap_items_444.xml',
  'https://missav.ws/sitemap_items_445.xml',
  'https://missav.ws/sitemap_items_446.xml',
  'https://missav.ws/sitemap_items_447.xml',
  'https://missav.ws/sitemap_items_448.xml',
  'https://missav.ws/sitemap_items_449.xml',
  'https://missav.ws/sitemap_items_450.xml',
  'https://missav.ws/sitemap_items_451.xml',
  'https://missav.ws/sitemap_items_452.xml',
  'https://missav.ws/sitemap_items_453.xml',
  'https://missav.ws/sitemap_items_454.xml',
  'https://missav.ws/sitemap_items_455.xml',
  'https://missav.ws/sitemap_items_456.xml',
  'https://missav.ws/sitemap_items_457.xml',
  'https://missav.ws/sitemap_items_458.xml',
  'https://missav.ws/sitemap_items_459.xml',
  'https://missav.ws/sitemap_items_460.xml',
  'https://missav.ws/sitemap_items_461.xml',
  'https://missav.ws/sitemap_items_462.xml',
  'https://missav.ws/sitemap_items_463.xml',
  'https://missav.ws/sitemap_items_464.xml',
  'https://missav.ws/sitemap_items_465.xml',
  'https://missav.ws/sitemap_items_466.xml',
  'https://missav.ws/sitemap_items_467.xml',
  'https://missav.ws/sitemap_items_468.xml',
  'https://missav.ws/sitemap_items_469.xml',
  'https://missav.ws/sitemap_items_470.xml',
  'https://missav.ws/sitemap_items_471.xml',
  'https://missav.ws/sitemap_items_472.xml',
  'https://missav.ws/sitemap_items_473.xml',
  'https://missav.ws/sitemap_items_474.xml',
  'https://missav.ws/sitemap_items_475.xml',
  'https://missav.ws/sitemap_items_476.xml',
  'https://missav.ws/sitemap_items_477.xml',
  'https://missav.ws/sitemap_items_478.xml',
  'https://missav.ws/sitemap_items_479.xml',
  'https://missav.ws/sitemap_items_480.xml',
  'https://missav.ws/sitemap_items_481.xml',
  'https://missav.ws/sitemap_items_482.xml',
  'https://missav.ws/sitemap_items_483.xml',
  'https://missav.ws/sitemap_items_484.xml',
  'https://missav.ws/sitemap_items_485.xml',
  'https://missav.ws/sitemap_items_486.xml'
];

const POSTS_DIR = path.join(__dirname, "../data/posts");
const INDEX_DIR = path.join(__dirname, "../data/index");
const META_DIR = path.join(__dirname, "../data/meta");

[POSTS_DIR, INDEX_DIR, META_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// ---------- FETCH ----------
async function fetchWithFlareSolverr(url) {
  const res = await fetch(FLARESOLVERR_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cmd: "request.get", url, maxTimeout: 60000 })
  });

  const data = await res.json();
  if (!data.solution) throw new Error("FlareSolverr failed");
  return data.solution.response;
}

async function smartFetch(url) {
  try {
    const res = await fetch(url);
    if (res.ok) return await res.text();
  } catch {}
  console.log("⚡ FlareSolverr:", url);
  return await fetchWithFlareSolverr(url);
}

// ---------- SITEMAP ----------
async function fetchSitemap(url) {
  const xml = await smartFetch(url);
  const parser = new xml2js.Parser();
  const result = await parser.parseStringPromise(xml);

  return result.urlset.url.map(u => {
    if (u["xhtml:link"]) {
      const en = u["xhtml:link"].find(x => x.$.hreflang === "en");
      return en ? en.$.href : null;
    }
    return null;
  }).filter(Boolean);
}

// ---------- HELPERS ----------
function getKey(url) {
  const match = url.match(/([a-z0-9\-]+)$/i);
  return match ? match[1].toLowerCase() : "unknown";
}

function getIndexFile(key) {
  return path.join(INDEX_DIR, key[0] + ".json");
}

function getMetaFile(key) {
  return path.join(META_DIR, key[0] + ".json");
}

function slugFromUrl(url) {
  const clean = url.replace(/https?:\/\/[^\/]+\//, "").replace(/\/$/, "");
  const parts = clean.split("/");
  const langs = ["en","cn","zh","ja","ko","ms","th","de","fr","vi","id","fil","pt"];
  let lang = "xx";
  for (const p of parts) if (langs.includes(p)) lang = p;
  const id = parts[parts.length - 1] || "unknown";
  const safeId = id.replace(/[^a-z0-9\-]/gi,"").toLowerCase();
  const slug = `${lang}-${safeId}.json`;
  const level1 = safeId.slice(0,2)||"00";
  const level2 = safeId.slice(2,4)||"00";
  const level3 = safeId.slice(4,6)||"00";
  const dir = path.join(POSTS_DIR, lang, level1, level2, level3);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir,{recursive:true});
  return path.join(lang, level1, level2, level3, slug);
}

// ---------- DECODE VIDEO SOURCES (NO PUPPETEER) ----------
function decodePackedSources(encryptedString) {
  if (!encryptedString) return [];
  // The string is normally split by | and packed like JS obfuscator
  const parts = encryptedString.split("|");

  // Example decoding logic (adapt to real pattern)
  return [
    { name: "High Quality", url: "https://hls.lustyflix.com/proxy?url=" + parts[0], type: "hls" },
    { name: "Medium Quality", url: "https://hls.lustyflix.com/proxy?url=" + parts[1], type: "hls" },
    { name: "Low Quality", url: "https://hls.lustyflix.com/proxy?url=" + parts[2], type: "hls" }
  ];
}

// ---------- MAIN DOWNLOAD ----------
async function downloadPost(url) {
  try {
    const key = getKey(url);
    const indexFile = getIndexFile(key);

    if (fs.existsSync(indexFile)) {
      const data = JSON.parse(fs.readFileSync(indexFile));
      if (data[key]) { console.log("⏩ Skip:", key); return; }
    }

    const html = await smartFetch(url);
    const $ = cheerio.load(html);

    // ---------- EXTRACT DATA ----------
    const title = $("meta[property='og:title']").attr("content") || $("title").text() || key;
    const description = $("meta[property='og:description']").attr("content") || null;
    const poster = $("meta[property='og:image']").attr("content") || null;
    const releaseDate = $("time").first().text() || null;
    const duration = parseInt($("meta[property='og:video:duration']").attr("content")) || null;

    let genres = [];
    $(".space-y-2 .text-secondary").each((_, el) => {
      const label = $(el).find("span").text().trim();
      if (label==="Genre:") $(el).find("a").each((_, a)=>genres.push($(a).text().trim()));
    });

    let cast = [];
    $(".space-y-2 .text-secondary").each((_, el) => {
      const label = $(el).find("span").text().trim();
      if (label==="Actress:") $(el).find("a").each((_, a)=>cast.push($(a).text().trim()));
    });

    let maker = null;
    $(".text-secondary").each((_, el)=>{
      const label = $(el).find("span").text().trim();
      if(label==="Maker:") maker = $(el).find("a").first().text().trim();
    });

    // ---------- ENCRYPTED SOURCE STRING ----------
    let encryptedString = null;
    $("script").each((_, el)=>{
      const content = $(el).html();
      if(content && content.includes(".split('|')")){
        const splitIndex = content.indexOf(".split('|')");
        const beforeSplit = content.substring(0, splitIndex);
        const lastQuote = beforeSplit.lastIndexOf("'");
        const firstQuote = beforeSplit.lastIndexOf("'", lastQuote-1);
        encryptedString = beforeSplit.substring(firstQuote+1,lastQuote);
      }
    });

    // ---------- FINAL JSON ----------
    const sources = decodePackedSources(encryptedString);

    const data = {
      id: key,
      title,
      description,
      poster,
      release_date: releaseDate,
      duration,
      genres,
      cast,
      maker,
      sources,
      url
    };

    const relativePath = slugFromUrl(url);
    const filePath = path.join(POSTS_DIR, relativePath);
    fs.writeFileSync(filePath, JSON.stringify(data,null,2));

    // ---------- INDEX ----------
    let idx = {};
    if (fs.existsSync(indexFile)) { try { idx = JSON.parse(fs.readFileSync(indexFile)); } catch {} }
    idx[key] = relativePath;
    fs.writeFileSync(indexFile, JSON.stringify(idx));

    // ---------- META ----------
    const metaFile = getMetaFile(key);
    let meta = {};
    if (fs.existsSync(metaFile)) { try { meta = JSON.parse(fs.readFileSync(metaFile)); } catch {} }
    meta[key] = { title, image: poster, path: relativePath };
    fs.writeFileSync(metaFile, JSON.stringify(meta));

    console.log("✅ Saved JSON:", key);

  } catch (err) {
    console.error("❌ Error:", url, err.message);
  }
}

// ---------- RUN ----------
(async ()=>{
  for(const sitemap of SITEMAP_URLS){
    console.log("📄 Sitemap:", sitemap);
    const urls = await fetchSitemap(sitemap);
    const BATCH = 3;
    for(let i=0;i<urls.length;i+=BATCH){
      await Promise.all(urls.slice(i,i+BATCH).map(downloadPost));
    }
  }
})();
