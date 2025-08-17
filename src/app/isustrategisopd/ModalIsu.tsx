'use client'

import { useState, useEffect } from "react";
import { Controller, SubmitHandler, useForm, useFieldArray } from "react-hook-form";
import { ButtonSky, ButtonSkyBorder, ButtonRed, ButtonRedBorder } from '@/components/global/Button';
import { getToken, getUser, getPeriode } from "@/components/lib/Cookie";
import { LoadingButtonClip } from "@/components/global/Loading";
import { OptionType, PermasalahanOpd, DataDukung, BidangUrusan, TargetJumlahData, TablePermasalahan } from "@/types";
import Select from "react-select";
import { AlertNotification } from "@/components/global/Alert";
import { TbCirclePlus, TbPlus, TbTrash } from "react-icons/tb";
import { useBrandingContext } from "@/context/BrandingContext";

interface FormValue {
    id?: string;
    kode_opd: string;
    nama_opd: string;
    kode_bidang_urusan: BidangUrusan;
    tahun_awal: string;
    tahun_akhir: string;
    isu_strategis: string;
    permasalahan_opd: FormPermasalahan[];
}
interface FormPermasalahan {
    data_dukung: FormDataDukung[];
    id_permasalahan: TablePermasalahan | null;
}
interface FormDataDukung {
    data_dukung: string;
    jumlah_data: TargetJumlahData[];
    narasi_data_dukung: string;
}
interface modal {
    isOpen: boolean;
    onClose: () => void;
    metode: 'edit' | 'baru' | '';
    id?: string;
    onSuccess: () => void;
}


export const ModalIsu: React.FC<modal> = ({ isOpen, onClose, id, metode, onSuccess }) => {

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormValue>();

    const { fields: PermasalahanField, append, remove } = useFieldArray({
        control,
        name: 'permasalahan_opd'
    });

    const [BidangUrusanOption, setBidangUrusanOption] = useState<BidangUrusan[]>([]);
    const [PermasalahanOption, setPermasalahanOption] = useState<TablePermasalahan[]>([]);

    const [User, setUser] = useState<any>(null);
    const [Periode, setPeriode] = useState<any>(null);
    const [Proses, setProses] = useState<boolean>(false);
    const [LoadingOption, setLoadingOption] = useState<boolean>(false);

    const token = getToken();
    const { branding } = useBrandingContext();
    const Tahun = branding?.tahun ? branding?.tahun.value : 0;

    useEffect(() => {
        const fetchUser = getUser();
        const fetchPeriode = getPeriode();
        if (fetchUser) {
            setUser(fetchUser.user);
        }
        if (fetchPeriode.periode) {
            const data = {
                value: fetchPeriode.periode.value,
                label: fetchPeriode.periode.label,
                id: fetchPeriode.periode.value,
                tahun_awal: fetchPeriode.periode.tahun_awal,
                tahun_akhir: fetchPeriode.periode.tahun_akhir,
                jenis_periode: fetchPeriode.periode.jenis_periode,
                tahun_list: fetchPeriode.periode.tahun_list
            }
            setPeriode(data);
        }
    }, []);

    const fetchBidangUrusanOption = async () => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        try {
            setLoadingOption(true);
            const response = await fetch(`${API_URL}/bidang_urusan/findall/${branding?.opd?.value}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `${token}`
                }
            });
            const result = await response.json();
            if (result.code === 200 || result.code === 201) {
                const data = result.data.map((item: BidangUrusan) => ({
                    value: item.kode_bidang_urusan,
                    label: `(${item.kode_bidang_urusan}) ${item.nama_bidang_urusan}`,
                    kode_bidang_urusan: item.kode_bidang_urusan,
                    nama_bidang_urusan: item.nama_bidang_urusan
                }));
                setBidangUrusanOption(data);
            } else {
                console.log(result.data);
                setBidangUrusanOption([]);
            }
        } catch (err) {
            setBidangUrusanOption([]);
            console.log(err);
        } finally {
            setLoadingOption(false);
        }
    }
    const fetchPermasalahanOption = async () => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL_PERMASALAHAN;
        try {
            setLoadingOption(true);
            const response = await fetch(`${API_URL}/permasalahan_terpilih/findall?kode_opd=${branding?.opd?.value}&tahun=${Tahun}`, {
                headers: {
                    'Content-Type': 'application/json',
                    // Authorization: `${token}`
                }
            });
            const result = await response.json();
            if (result.code === 200 || result.code === 201) {
                const data = result.data.map((item: TablePermasalahan) => ({
                    value: item.id_permasalahan,
                    label: item.nama_pohon,
                    id_permasalahan: item.id_permasalahan,
                    nama_pohon: item.nama_pohon,
                    jenis_masalah: item.jenis_masalah
                }));
                setPermasalahanOption(data);
            } else {
                console.log(result.data);
                setPermasalahanOption([]);
            }
        } catch (err) {
            setPermasalahanOption([]);
            console.log(err);
        } finally {
            setLoadingOption(false);
        }
    }

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL_PERMASALAHAN;
        const formDataNew = {
            //key : value
            nama_opd: branding?.opd?.label,
            kode_opd: branding?.opd?.value,
            kode_bidang_urusan: data.kode_bidang_urusan.value,
            nama_bidang_urusan: data.kode_bidang_urusan.nama_bidang_urusan,
            tahun_awal: Periode.tahun_awal,
            tahun_akhir: Periode.tahun_akhir,
            isu_strategis: data.isu_strategis,
            permasalahan_opd: data.permasalahan_opd.map((p) => ({
                data_dukung: p.data_dukung.map((dd) => ({
                    data_dukung: dd.data_dukung,
                    narasi_data_dukung: dd.narasi_data_dukung,
                    jumlah_data: [],
                })),
                id_permasalahan: p.id_permasalahan?.id_permasalahan,
            }))
        };
        const formDataEdit = {
            //key : value
            id: id,
            nama_opd: branding?.opd?.label,
            kode_opd: branding?.opd?.value,
            kode_bidang_urusan: data.kode_bidang_urusan.value,
            nama_bidang_urusan: data.kode_bidang_urusan.nama_bidang_urusan,
            tahun_awal: Periode.tahun_awal,
            tahun_akhir: Periode.tahun_akhir, 
            isu_strategis: data.isu_strategis, 
        };
        const getBody = () => {
            if (metode === "edit") return formDataEdit;
            if (metode === "baru") return formDataNew;
            return {}; // Default jika metode tidak sesuai
        };
        metode === 'baru' && console.log("baru :", formDataNew);
        metode === 'edit' && console.log("edit :", formDataEdit);
    };

    const handleClose = () => {
        onClose();
        reset();
    }

    const DataTerukurField = (alasanIndex: number) => {
        const { fields: dataDukungFields, append: appendDataDukung, remove: removeDataDukung } = useFieldArray({
            control,
            name: `permasalahan_opd.${alasanIndex}.data_dukung`, // Path ke array bersarang
        });
        return (
            PermasalahanField.map((permasalahanField, index) => {
                // Di sini, kita buat useFieldArray kedua untuk 'data_dukung'

                return (
                    <>
                        <div key={permasalahanField.id}>
                            {/* ... bagian lain dari form untuk permasalahan_opd */}

                            {/* Loop untuk 'data_dukung' */}
                            {dataDukungFields.map((dataDukungField, dataDukungIndex) => (
                                <div className="border rounded-lg p-2" key={dataDukungField.id}>
                                    {/* Input Controller yang diperbaiki */}
                                    <Controller
                                        name={`permasalahan_opd.${index}.data_dukung.${dataDukungIndex}.data_dukung`}
                                        control={control}
                                        defaultValue={dataDukungField.data_dukung} // Perbaikan: Gunakan dataDukungField
                                        render={({ field }) => (
                                            <textarea
                                                {...field}
                                                placeholder="masukkan data dukung"
                                                id={`permasalahan_opd.${index}.data_dukung.${dataDukungIndex}.data_dukung`}
                                            />
                                        )}
                                    />
                                    {/* Tombol hapus untuk 'data_dukung' */}
                                    <ButtonRedBorder
                                        type="button"
                                        onClick={() =>
                                            removeDataDukung(dataDukungIndex)
                                        }
                                    >
                                        Hapus Data Dukung
                                    </ButtonRedBorder>
                                </div>
                            ))}
                            {/* Tombol tambah untuk 'data_dukung' */}
                            <ButtonSkyBorder
                                type="button"
                                onClick={() => appendDataDukung({
                                    data_dukung: '',
                                    narasi_data_dukung: '',
                                    jumlah_data: []
                                }
                                )}
                            >
                                <TbPlus />
                                Tambah Data Dukung
                            </ButtonSkyBorder>
                        </div>
                    </>
                );
            })
        )
    }

    if (!isOpen) {
        return null;
    } else {

        return (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="fixed inset-0 bg-black opacity-30" onClick={handleClose}></div>
                <div className={`bg-white rounded-lg p-8 z-10 w-5/6 max-h-[90%] overflow-auto`}>
                    <div className="w-max-[500px] py-2 border-b">
                        <h1 className="text-xl uppercase text-center">{metode === 'baru' ? "Tambah" : "Edit"} Isu Strategis</h1>
                    </div>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col mx-5 py-5"
                    >
                        <div className="flex flex-col py-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="kode_bidang_urusan"
                            >
                                Bidang Urusan:
                            </label>
                            <Controller
                                name="kode_bidang_urusan"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        id="kode_bidang_urusan"
                                        options={BidangUrusanOption}
                                        isLoading={LoadingOption}
                                        onMenuOpen={() => {
                                            if (BidangUrusanOption.length == 0) {
                                                fetchBidangUrusanOption();
                                            } else {
                                                null
                                            }
                                        }}
                                        placeholder="Pilih Bidang Urusan"
                                        noOptionsMessage={() => `bidang urusan kosong, tambahkan di data master (super_admin)`}
                                        styles={{
                                            control: (baseStyles, state) => ({
                                                ...baseStyles,
                                                borderRadius: '8px',
                                                borderColor: 'black',
                                                '&:hover': {
                                                    borderColor: '#3673CA',
                                                },
                                            }),
                                        }}
                                    />
                                )}
                            />
                        </div>
                        <div className="flex flex-col py-3">
                            <label
                                className="uppercase text-xs font-bold text-gray-700 my-2"
                                htmlFor="isu_strategis"
                            >
                                Isu Strategis:
                            </label>
                            <Controller
                                name="isu_strategis"
                                control={control}
                                render={({ field }) => (
                                    <textarea
                                        {...field}
                                        className="border px-4 py-2 rounded-lg"
                                        id="isu_strategis"
                                        placeholder="masukkan Isu Strategis"
                                        onChange={(e) => {
                                            field.onChange(e);
                                        }}
                                    />
                                )}
                            />
                        </div>
                        {/* PERMASALAHAN ARRAY */}
                        {PermasalahanField.map((field, index) => (
                            <div key={index} className="flex flex-col my-2 py-2 px-5 border border-sky-700 rounded-lg">
                                <Controller
                                    name={`permasalahan_opd.${index}.id_permasalahan`}
                                    control={control}
                                    defaultValue={field.id_permasalahan}
                                    render={({ field }) => (
                                        <div className="flex flex-col py-3">
                                            <div className="flex items-center justify-between mb-2">
                                                <label className="flex uppercase text-xs font-bold text-gray-700 items-center">
                                                    Permasalahan ke {index + 1} :
                                                </label>
                                                {index >= 0 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => remove(index)}
                                                        className="border border-red-500 text-red-500 rounded-full p-1 hover:bg-red-500 hover:text-white"
                                                    >
                                                        <TbTrash />
                                                    </button>
                                                )}
                                            </div>
                                            <Select
                                                {...field}
                                                id={`permasalahan_opd.${index}.id_permasalahan`}
                                                options={PermasalahanOption}
                                                placeholder="pilih permasalahan"
                                                noOptionsMessage={() => `Permasalahan Terpilih kosong, pilih permasalahan di menu renstra/permasalahan`}
                                                onMenuOpen={() => {
                                                    if (PermasalahanOption.length === 0) {
                                                        fetchPermasalahanOption()
                                                    } else {
                                                        null
                                                    }
                                                }}
                                                styles={{
                                                    control: (baseStyles) => ({
                                                        ...baseStyles,
                                                        borderRadius: '8px',
                                                        borderColor: 'black',
                                                        '&:hover': {
                                                            borderColor: '#3673CA',
                                                        },
                                                    }),
                                                }}
                                            />
                                        </div>
                                    )}
                                />
                                {/* <DataTerukurField alasanIndex={index} /> */}
                            </div>
                        ))}
                        <ButtonSkyBorder
                            className="flex items-center gap-1 mb-3 mt-2 w-full"
                            type="button"
                            onClick={() =>
                                append({
                                    data_dukung: [],
                                    id_permasalahan: null,
                                })
                            }
                        >
                            <TbCirclePlus />
                            Tambah Pemasalahan
                        </ButtonSkyBorder>
                        <div className="flex flex-col gap-2 my-3">
                            <ButtonSky className="w-full" type="submit" disabled={Proses}>
                                {Proses ?
                                    <span className="flex">
                                        <LoadingButtonClip />
                                        Menyimpan...
                                    </span>
                                    :
                                    "Simpan"
                                }
                            </ButtonSky>
                            <ButtonRed className="w-full" onClick={handleClose}>
                                Batal
                            </ButtonRed>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}