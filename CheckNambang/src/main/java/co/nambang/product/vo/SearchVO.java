package co.nambang.product.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/*
 * 검색조건을 담는 클래스.
 */
 
@Data
@AllArgsConstructor
@NoArgsConstructor

public class SearchVO {
	private int page;
	private String searchCondition;
	private String keyword;
	private String category;
	private String brandChosung;
	
}
